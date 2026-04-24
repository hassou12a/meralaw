import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type AssistantMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function buildGroundedPrompt(message: string, laws: Array<{
  titleAr: string;
  titleFr: string;
  referenceNumber: string;
  category: string;
  descriptionAr: string;
  descriptionFr: string;
  contentAr: string;
  contentFr: string;
}>, caseContext?: string) {
  const context = laws
    .map((law, index) => {
      return [
        `Source ${index + 1}: ${law.titleFr} / ${law.titleAr}`,
        `Reference: ${law.referenceNumber}`,
        `Category: ${law.category}`,
        `French summary: ${law.descriptionFr}`,
        `Arabic summary: ${law.descriptionAr}`,
        `French content excerpt: ${law.contentFr.slice(0, 800)}`,
        `Arabic content excerpt: ${law.contentAr.slice(0, 800)}`,
      ].join('\n');
    })
    .join('\n\n');

  return `You are an Algerian legal assistant for administrative law.
Use only the supplied legal sources. If the sources are insufficient, say so clearly.
Answer in Arabic if the user's message is mostly Arabic, otherwise answer in French.
Structure the answer with:
1. Brief legal assessment
2. Applicable laws
3. Practical next steps
4. Source references

User question:
${message}${caseContext || ''}

Legal sources:
${context}`;
}

function buildFallbackAnswer(message: string, laws: Array<{
  titleAr: string;
  titleFr: string;
  referenceNumber: string;
  category: string;
  descriptionAr: string;
  descriptionFr: string;
}>, caseContext?: string) {
  const isArabic = /[\u0600-\u06FF]/.test(message);

  if (laws.length === 0) {
    const noResults = isArabic
      ? 'لم أجد نصوصًا قانونية مطابقة بشكل كافٍ داخل قاعدة البيانات الحالية. جرّب توسيع السؤال أو البحث باسم القانون أو رقم المرجع.'
      : "Je n'ai pas trouvé de textes suffisamment pertinents dans la base actuelle. Essayez avec un intitulé de loi ou une référence précise.";
    return caseContext ? `${noResults}\n\n${caseContext}` : noResults;
  }

  const intro = isArabic
    ? 'استنادًا إلى النصوص المتاحة في المنصة، هذه أهم المراجع الأقرب لسؤالك:'
    : 'Sur la base des textes disponibles dans la plateforme, voici les références les plus proches de votre question :';

  const recommendations = laws
    .map((law, index) => {
      const summary = isArabic ? law.descriptionAr : law.descriptionFr;
      return `${index + 1}. ${isArabic ? law.titleAr : law.titleFr} (${law.referenceNumber}) - ${summary}`;
    })
    .join('\n');

  const closing = isArabic
    ? '\n\nراجع النص الكامل لكل قانون من صفحة التفاصيل قبل اتخاذ أي إجراء قانوني.'
    : '\n\nConsultez le texte intégral de chaque loi depuis la page de détail avant toute décision juridique.';

  const result = `${intro}\n\n${recommendations}${closing}`;
  return caseContext ? `${result}\n\n${caseContext}` : result;
}

export async function POST(request: Request) {
  try {
    const { message, caseId, history } = (await request.json()) as {
      message?: string;
      caseId?: string;
      history?: AssistantMessage[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch case context if caseId is provided
    let caseContext = '';
    if (caseId) {
      try {
        const caseData = await prisma.case.findUnique({
          where: { id: caseId },
          include: {
            caseLaws: { include: { law: true } },
            notes: true,
          },
        });
        if (caseData) {
          caseContext = `\n\nCase Context:\nName: ${caseData.name}\nDescription: ${caseData.description || 'N/A'}\n`;
          if (caseData.caseLaws.length > 0) {
            caseContext += `\nAttached Laws:\n${caseData.caseLaws.map(cl => `- ${cl.law.titleFr || cl.law.titleAr} (${cl.law.referenceNumber})`).join('\n')}`;
          }
          if (caseData.notes.length > 0) {
            caseContext += `\n\nNotes:\n${caseData.notes.map(n => `- ${n.content.substring(0, 200)}`).join('\n')}`;
          }
        }
      } catch (e) {
        console.error('Error fetching case context:', e);
      }
    }

    const searchTerms = message
      .trim()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length >= 2)
      .slice(0, 8);

    const conditions: Prisma.LawWhereInput[] = searchTerms.flatMap((term) => [
      { titleAr: { contains: term } },
      { titleFr: { contains: term, mode: 'insensitive' } },
      { descriptionAr: { contains: term } },
      { descriptionFr: { contains: term, mode: 'insensitive' } },
      { contentAr: { contains: term } },
      { contentFr: { contains: term, mode: 'insensitive' } },
      { referenceNumber: { contains: term, mode: 'insensitive' } },
    ]);

    const laws = await prisma.law.findMany({
      where: {
        OR: conditions,
      },
      take: 5,
      orderBy: [{ isVerified: 'desc' }, { updatedAt: 'desc' }],
      select: {
        titleAr: true,
        titleFr: true,
        referenceNumber: true,
        category: true,
        descriptionAr: true,
        descriptionFr: true,
        contentAr: true,
        contentFr: true,
      },
    });

    const sources = laws.map((law) => ({
      law: law.titleFr || law.titleAr,
      article: law.category,
      reference: law.referenceNumber,
    }));

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        content: buildFallbackAnswer(message, laws, caseContext),
        sources,
      });
    }

    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const previousMessages =
        history?.slice(-8).map((item) => ({
          role: item.role,
          content: item.content,
        })) || [];

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1800,
        system: buildGroundedPrompt(message, laws, caseContext),
        messages: [
          ...previousMessages,
          { role: 'user', content: message },
        ],
      });

      const content = response.content[0];
      if (content?.type === 'text') {
        return NextResponse.json({
          content: content.text,
          sources,
        });
      }
    } catch (aiError) {
      console.error('AI error:', aiError);
    }

    return NextResponse.json({
      content: buildFallbackAnswer(message, laws, caseContext),
      sources,
    });
  } catch (error) {
    console.error('Assistant error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
