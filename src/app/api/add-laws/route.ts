import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const LAWS = [
  { titleAr: "الدستور الجزائري", titleFr: "Constitution algérienne", referenceNumber: "96-438", category: "دستور", year: 1996, jorfYear: 1996, jorfNumber: 76 },
  { titleAr: "التعديل الدستوري 2020", titleFr: "Constitution amendment 2020", referenceNumber: "20-01", category: "دستور", year: 2020, jorfYear: 2020, jorfNumber: 82 },
  { titleAr: "قانون الإجراءات المدنية", titleFr: "Code civile", referenceNumber: "08-09", category: "إجراءات", year: 2008, jorfYear: 2008, jorfNumber: 21 },
  { titleAr: "القانون المدني", titleFr: "Code civil", referenceNumber: "75-58", category: "قوانين مرجعية", year: 1975, jorfYear: 1975, jorfNumber: 78 },
  { titleAr: "قانون العقوبات", titleFr: "Code pénal", referenceNumber: "66-156", category: "قوانين مرجعية", year: 1966, jorfYear: 1966, jorfNumber: 49 },
  { titleAr: "قانون الأسرة", titleFr: "Code de la famille", referenceNumber: "84-11", category: "قوانين مرجعية", year: 1984, jorfYear: 1984, jorfNumber: 24 },
  { titleAr: "قانون العمل", titleFr: "Code du travail", referenceNumber: "90-11", category: "قوانين مرجعية", year: 1990, jorfYear: 1990, jorfNumber: 17 },
  { titleAr: "قانون البلدية", titleFr: "Loi sur la commune", referenceNumber: "11-10", category: "إدارة محلية", year: 2011, jorfYear: 2011, jorfNumber: 37 },
  { titleAr: "قانون الولاية", titleFr: "Loi sur la wilaya", referenceNumber: "12-07", category: "إدارة محلية", year: 2012, jorfYear: 2012, jorfNumber: 12 },
  { titleAr: "قانون الصفقات العمومية", titleFr: "Marchés publics", referenceNumber: "15-247", category: "صفقات عمومية", year: 2015, jorfYear: 2015, jorfNumber: 50 },
];

export async function GET() {
  try {
    let inserted = 0;
    for (const law of LAWS) {
      const existing = await prisma.law.findUnique({ where: { referenceNumber: law.referenceNumber } });
      if (!existing) {
        await prisma.law.create({
          data: {
            ...law,
            publicationDate: `${law.year}-01-01`,
            journalOfficiel: `JORF ${law.jorfNumber}/${law.jorfYear}`,
            descriptionAr: law.titleAr,
            descriptionFr: law.titleFr,
            contentAr: law.titleAr,
            contentFr: law.titleFr,
            pdfUrlAr: `https://www.joradp.dz/FTP/jo-arabe/${law.jorfYear}/A${law.jorfYear}${String(law.jorfNumber).padStart(3,'0')}.pdf`,
            pdfUrlFr: `https://www.joradp.dz/FTP/jo-francais/${law.jorfYear}/F${law.jorfYear}${String(law.jorfNumber).padStart(3,'0')}.pdf`,
            isVerified: true,
          },
        });
        inserted++;
      }
    }
    const count = await prisma.law.count();
    return NextResponse.json({ success: true, inserted, total: count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}