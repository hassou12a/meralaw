import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================');
  console.log('       MERALAW DATABASE SUMMARY');
  console.log('========================================\n');

  // ADMIN ACCOUNT
  console.log('🔑 ADMIN ACCOUNT:');
  console.log('---------------------------------------');
  const admin = await prisma.user.findFirst({ where: { plan: 'ADMIN' } });
  if (admin) {
    console.log(`ID:         ${admin.id}`);
    console.log(`Email:      ${admin.email}`);
    console.log(`Password:   admin123`);
    console.log(`Name:       ${admin.name}`);
    console.log(`Profession: ${admin.profession}`);
    console.log(`Plan:       ${admin.plan}`);
    console.log(`Created:    ${admin.createdAt}`);
  }

  // ALL LAWS
  console.log('\n📜 ALL LAWS (10):');
  console.log('---------------------------------------');
  const laws = await prisma.law.findMany({ orderBy: { year: 'asc' } });
  laws.forEach((law, i) => {
    console.log(`\n${i + 1}. ${law.titleFr}`);
    console.log(`   ID:             ${law.id}`);
    console.log(`   Arabic:         ${law.titleAr}`);
    console.log(`   English:        ${law.titleEn}`);
    console.log(`   Category:      ${law.category}`);
    console.log(`   Reference:     ${law.referenceNumber}`);
    console.log(`   Year:          ${law.year}`);
    console.log(`   Journal:        ${law.journalOfficiel}`);
    console.log(`   JORF #:        ${law.jorfNumber}/${law.jorfYear}`);
    console.log(`   Premium:       ${law.isPremium ? 'Yes' : 'No'}`);
    console.log(`   Verified:      ${law.isVerified ? 'Yes' : 'No'}`);
    console.log(`   PDF Arabic:     ${law.pdfUrlAr || '(none)'}`);
    console.log(`   PDF French:     ${law.pdfUrlFr || '(none)'}`);
    console.log(`   Description:   ${law.descriptionFr}`);
  });

  console.log('\n========================================');
  console.log('           END OF DATABASE');
  console.log('========================================');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());