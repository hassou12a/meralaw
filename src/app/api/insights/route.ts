import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const dailyTips = {
  ar: [
    { title: 'مبدأ عدم جواز الردع', content: 'لا يجوز للمحكمة أن تقضي بشيء لم يطلبه الخصوم.' },
    { title: 'التقادم', content: 'التقادم عشرون سنة ما لم يرد نص يقصره.' },
    { title: 'حجية الأمر المقضي', content: 'الحكم النهائي يكتسب حجية الشيء المقضي به.' },
    { title: 'الإثبات بالكتابة', content: 'يجب أن يثبت العقد الذي قيمته تزيد على خمسة آلاف دينار بكتابة.' },
    { title: 'الحيازة', content: 'الحيازة تثبت الملكية في المنقولات ما لم يثبت العكس.' },
    { title: 'المسؤولية العقدية', content: 'المتعهد بالتزام يلتزم بتنفيذه ما لم يقع إخلال بسبب قوة قاهرة.' },
  ],
  fr: [
    { title: 'Principe de la demande', content: 'Le juge ne peut statuer sur ce qui n\'a pas été demandé.' },
    { title: 'Prescription', content: 'La prescription est de 20 ans sauf texte particulier.' },
    { title: 'Chose jugée', content: 'Le jugement définitif acquiert l\'autorité de la chose jugée.' },
    { title: 'Preuve par écrit', content: 'Le contrat de valeur supérieure à 5 000 DA doit être prouvé par écrit.' },
    { title: 'Possession', content: 'La possession fait foi de propriété en matière mobilière sauf preuve contraire.' },
    { title: 'Responsabilité contractuelle', content: 'Le débiteur est tenu d\'exécuter son obligation sauf force majeure.' },
  ],
  en: [
    { title: 'Principle of Claim', content: 'The court cannot rule on what has not been requested.' },
    { title: 'Prescription', content: 'Prescription is 20 years unless otherwise stipulated.' },
    { title: 'Res Judicata', content: 'Final judgments acquire the authority of res judicata.' },
    { title: 'Written Proof', content: 'Contracts exceeding 5,000 DZD must be proven in writing.' },
    { title: 'Possession', content: 'Possession is proof of ownership for movables unless proven otherwise.' },
    { title: 'Contractual Liability', content: 'The debtor must perform their obligation except in case of force majeure.' },
  ],
};

function getDailyTipIndex(): number {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'ar') as 'ar' | 'fr' | 'en';

    // Get daily tip based on day of year
    const tips = dailyTips[lang] || dailyTips.ar;
    const tipIndex = getDailyTipIndex() % tips.length;
    const dailyTip = tips[tipIndex];

    // Get 3 tips (rotated)
    const rotatedTips = [
      tips[tipIndex],
      tips[(tipIndex + 1) % tips.length],
      tips[(tipIndex + 2) % tips.length],
    ];

    // Fetch latest laws as "articles"
    const latestLaws = await prisma.law.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titleAr: true,
        titleFr: true,
        titleEn: true,
        descriptionAr: true,
        descriptionFr: true,
        descriptionEn: true,
        category: true,
        referenceNumber: true,
        year: true,
      },
    });

    const articles = latestLaws.map((law) => ({
      id: law.id,
      title: lang === 'ar' ? law.titleAr : lang === 'fr' ? law.titleFr : law.titleEn,
      desc: lang === 'ar' ? law.descriptionAr : lang === 'fr' ? law.descriptionFr : law.descriptionEn,
      category: law.category,
      reference: law.referenceNumber,
      year: law.year,
    }));

    return NextResponse.json({
      dailyTips: rotatedTips,
      articles,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
