import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const results = { users: 0, laws: 0 };

    // Create test users
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const testUsers = [
      { email: 'admin@meralaw.dz', name: 'Admin User', profession: 'avocat' },
      { email: 'user@meralaw.dz', name: 'Test User', profession: 'juriste' },
    ];

    for (const u of testUsers) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        await prisma.user.create({
          data: { ...u, password: hashedPassword, plan: 'PRO' },
        });
        results.users++;
      }
    }

    // Seed laws if none exist
    const lawCount = await prisma.law.count();
    if (lawCount === 0) {
       const laws = [
         {
           titleAr: 'الدستور الجزائري',
           titleFr: 'Constitution algérienne',
           titleEn: 'Algerian Constitution',
           category: 'دستور',
           referenceNumber: '96-438',
           year: 1996,
           publicationDate: '1996-12-07',
           journalOfficiel: 'JORF 76/1996',
           descriptionAr: 'الدستور الجزائري',
           descriptionFr: 'Constitution algérienne',
           descriptionEn: 'Algerian Constitution',
           contentAr: 'محتوى الدستور الجزائري',
           contentFr: 'Contenu de la constitution algérienne',
           contentEn: 'Content of the Algerian Constitution',
           jorfYear: 1996,
           jorfNumber: 76,
           isVerified: true,
           isPremium: false,
         },
         {
           titleAr: 'القانون المدني',
           titleFr: 'Code civil',
           titleEn: 'Civil Code',
           category: 'قوانين مرجعية',
           referenceNumber: '75-58',
           year: 1975,
           publicationDate: '1975-06-18',
           journalOfficiel: 'JORF 78/1975',
           descriptionAr: 'القانون المدني',
           descriptionFr: 'Code civil',
           descriptionEn: 'Civil Code',
           contentAr: 'محتوى القانون المدني',
           contentFr: 'Contenu du code civil',
           contentEn: 'Content of the Civil Code',
           jorfYear: 1975,
           jorfNumber: 78,
           isVerified: true,
           isPremium: false,
         },
         {
           titleAr: 'قانون العقوبات',
           titleFr: 'Code pénal',
           titleEn: 'Penal Code',
           category: 'قوانين مرجعية',
           referenceNumber: '66-156',
           year: 1966,
           publicationDate: '1966-06-21',
           journalOfficiel: 'JORF 49/1966',
           descriptionAr: 'قانون العقوبات',
           descriptionFr: 'Code pénal',
           descriptionEn: 'Penal Code',
           contentAr: 'محتوى قانون العقوبات',
           contentFr: 'Contenu du code pénal',
           contentEn: 'Content of the Penal Code',
           jorfYear: 1966,
           jorfNumber: 49,
           isVerified: true,
           isPremium: false,
         },
         {
           titleAr: 'قانون الأسرة',
           titleFr: 'Code de la famille',
           titleEn: 'Family Code',
           category: 'قوانين مرجعية',
           referenceNumber: '84-11',
           year: 1984,
           publicationDate: '1984-05-09',
           journalOfficiel: 'JORF 24/1984',
           descriptionAr: 'قانون الأسرة',
           descriptionFr: 'Code de la famille',
           descriptionEn: 'Family Code',
           contentAr: 'محتوى قانون الأسرة',
           contentFr: 'Contenu du code de la famille',
           contentEn: 'Content of the Family Code',
           jorfYear: 1984,
           jorfNumber: 24,
           isVerified: true,
           isPremium: false,
         },
         {
           titleAr: 'قانون العمل',
           titleFr: 'Code du travail',
           titleEn: 'Labor Code',
           category: 'قوانين مرجعية',
           referenceNumber: '90-11',
           year: 1990,
           publicationDate: '1990-04-14',
           journalOfficiel: 'JORF 17/1990',
           descriptionAr: 'قانون العمل',
           descriptionFr: 'Code du travail',
           descriptionEn: 'Labor Code',
           contentAr: 'محتوى قانون العمل',
           contentFr: 'Contenu du code du travail',
           contentEn: 'Content of the Labor Code',
           jorfYear: 1990,
           jorfNumber: 17,
           isVerified: true,
           isPremium: false,
         },
       ];

      for (const law of laws) {
        await prisma.law.create({ data: law });
        results.laws++;
      }
    }

    return NextResponse.json({ success: true, ...results });
   } catch (error) {
     const message = error instanceof Error ? error.message : 'Unknown error';
     return NextResponse.json({ error: message }, { status: 500 });
   }
}