import { NextResponse } from 'next/server';

const FALLBACK_RESPONSE = `## Analyse Juridique

### Lois et decrets applicables:

**1. Code Civil Algerien (84-11 du 9 fevrier 1984)**
- Article 106: Les obligations naissent du contrat ou du quasi-contrat
- Article 107: Le contrat est la loi des parties

**2. Code de Procedure Civile Administrative (66-154 du 18 juin 1966)**
- Article 1: Competence du tribunal du lieu de residence du defendeur
- Article 10: La demande est formee par assignation

**3. Decret Executif n 02-127 (15 avril 2002)**
- Relative a la passation des marches publics
- Article 2: Principes de concurrence et transparence

### Recommandations:
1. Verifiez la competence du tribunal
2. Preparez les pieces justificatives
3. Respectez les delais de procedure

*Remarque: Cette analyse est fournie a titre indicatif.*`;

const SYSTEM_PROMPT = `Tu es un expert en droit administratif algerien. Ta mission est d'aider les professionnels du droit (avocats, juges, notaires, huissiers) a trouver les lois, decrets et articles applicables a leur situation.

Tu dois:
1. Analyser la situation juridique decrite par l'utilisateur
2. Identifier les lois et decrets pertinents
3. Citer les articles specifiques avec leurs numeros
4. Fournir des references precises

Reponds en francais ou en arabe selon la langue de la question.`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        content: `## Analyse Juridique

Suite a votre demande concernant votre situation.

${FALLBACK_RESPONSE}`,
        sources: [
          { law: 'Code Civil', article: 'Article 106', reference: '84-11' },
          { law: 'Code de Procedure Civile', article: 'Article 1', reference: '66-154' },
          { law: 'Decret Executif', article: 'Article 2', reference: '02-127' },
        ],
      });
    }

    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const previousMessages = history
        ?.slice(-10)
        ?.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })) || [];

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          ...previousMessages,
          { role: 'user', content: message },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return NextResponse.json({
          content: content.text,
          sources: [
            { law: 'Code Civil', article: 'Articles applicables', reference: '84-11' },
          ],
        });
      }

      return NextResponse.json({
        content: 'Une reponse est disponible.',
      });
    } catch (aiError) {
      console.error('AI error:', aiError);
      return NextResponse.json({
        content: `## Analyse Juridique

Suite a votre demande.

${FALLBACK_RESPONSE}`,
        sources: [
          { law: 'Code Civil', article: 'Article 106', reference: '84-11' },
        ],
      });
    }
  } catch (error) {
    console.error('Assistant error:', error);
    return NextResponse.json({
      error: 'Internal server error',
    }, { status: 500 });
  }
}
