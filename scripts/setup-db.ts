import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@meralaw.dz' },
    update: {},
    create: {
      id: 'adm_001',
      email: 'admin@meralaw.dz',
      password: hashedPassword,
      name: 'Prof. HOUSSEM ABDALLAH MERAMRIA',
      profession: 'Avocat',
      plan: 'ADMIN',
    },
  });
  console.log('Admin created:', admin.email);

  // Add 10 Algerian laws
  const laws = [
    { titleAr: 'المدنية', titleFr: 'Code Civil', titleEn: 'Civil Code', category: 'مدني', ref: 'CC-1975', year: 1975, jorf: 57, premium: false },
    { titleAr: 'العقوبات', titleFr: 'Code Pénal', titleEn: 'Penal Code', category: 'جنائي', ref: 'CP-1966', year: 1966, jorf: 46, premium: false },
    { titleAr: 'الإجراءات المدنية', titleFr: 'Code de Procédure Civile', titleEn: 'Civil Procedure', category: 'مدني', ref: 'CPC-1998', year: 1998, jorf: 73, premium: false },
    { titleAr: 'التجارة', titleFr: 'Code de Commerce', titleEn: 'Commercial Code', category: 'تجاري', ref: 'CM-1989', year: 1989, jorf: 44, premium: false },
    { titleAr: 'العمل', titleFr: 'Code du Travail', titleEn: 'Labor Code', category: 'شغل', ref: 'CT-1990', year: 1990, jorf: 24, premium: false },
    { titleAr: 'الأسر', titleFr: 'Code de la Famille', titleEn: 'Family Code', category: 'أسري', ref: 'CF-1984', year: 1984, jorf: 24, premium: false },
    { titleAr: 'الإجراءات الجنائية', titleFr: 'Code de Procédure Pénale', titleEn: 'Criminal Procedure', category: 'جنائي', ref: 'CPP-1966', year: 1966, jorf: 50, premium: false },
    { titleAr: 'الضرائب', titleFr: 'Code des Impôts', titleEn: 'Tax Code', category: 'ضريبي', ref: 'CI-1985', year: 1985, jorf: 54, premium: false },
    { titleAr: 'الجمارك', titleFr: 'Code des Douanes', titleEn: 'Customs Code', category: 'جمارك', ref: 'CD-1979', year: 1979, jorf: 52, premium: false },
    { titleAr: 'العقار', titleFr: 'Code de la Propriété', titleEn: 'Property Code', category: 'عقاري', ref: 'CP-1974', year: 1974, jorf: 56, premium: false },
  ];

  for (let i = 0; i < laws.length; i++) {
    const l = laws[i];
    await prisma.law.upsert({
      where: { id: `law_${String(i + 1).padStart(3, '0')}` },
      update: {},
       create: {
         id: `law_${String(i + 1).padStart(3, '0')}`,
         titleAr: l.titleAr,
         titleFr: l.titleFr,
         titleEn: l.titleEn,
         category: l.category,
         referenceNumber: l.ref,
         year: l.year,
         publicationDate: `${l.year}-01-01`,
         journalOfficiel: `JOURNAL OFFICIEL ${l.jorf}`,
         descriptionAr: l.titleAr,
         descriptionFr: l.titleFr,
         descriptionEn: l.titleEn,
         contentAr: l.titleAr,
         contentFr: l.titleFr,
         contentEn: l.titleEn,
         isPremium: l.premium,
         isVerified: true,
         jorfYear: l.year,
         jorfNumber: l.jorf,
       },
    });
    console.log('Law added:', l.titleFr);
  }

  console.log('\n✅ Setup complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());