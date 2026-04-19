import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LAWS_DATA } from '@/lib/joradp';
import { buildJoradpUrl } from '@/lib/joradp';

export async function POST() {
  try {
    const results = { inserted: 0, updated: 0, errors: 0 };
    
    for (const law of LAWS_DATA) {
      try {
        const existing = await prisma.law.findUnique({
          where: { referenceNumber: law.referenceNumber },
        });
        
         const data = {
           titleAr: law.titleAr,
           titleFr: law.titleFr,
           titleEn: law.titleFr,
           referenceNumber: law.referenceNumber,
           category: law.category,
           year: law.jorfYear,
           publicationDate: `${law.jorfYear}-01-01`,
           journalOfficiel: `JORF ${law.jorfNumber}/${law.jorfYear}`,
           descriptionAr: `${law.titleAr} - ${law.category}`,
           descriptionFr: `${law.titleFr} - ${law.category}`,
           descriptionEn: `${law.titleFr} - ${law.category}`,
           contentAr: law.titleAr,
           contentFr: law.titleFr,
           contentEn: law.titleFr,
           jorfYear: law.jorfYear,
           jorfNumber: law.jorfNumber,
           pdfUrlAr: buildJoradpUrl(law.jorfYear, law.jorfNumber, 'ar'),
           pdfUrlFr: buildJoradpUrl(law.jorfYear, law.jorfNumber, 'fr'),
           isVerified: true,
         };
        
        if (existing) {
          await prisma.law.update({
            where: { referenceNumber: law.referenceNumber },
            data,
          });
          results.updated++;
        } else {
          await prisma.law.create({ data });
          results.inserted++;
        }
      } catch (e) {
        results.errors++;
      }
    }
    
    const total = await prisma.law.count({
      where: { isVerified: true },
    });
    
    return NextResponse.json({
      success: true,
      ...results,
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await prisma.law.count();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}