require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allLaws = await prisma.law.findMany({
    select: {
      id: true,
      titleAr: true,
      titleFr: true,
      referenceNumber: true,
      sourceUrl: true,
      source: true,
      pdfUrlAr: true,
      pdfUrlFr: true,
    },
    orderBy: { year: 'desc' },
  });

  console.log(`\n📊 إجمالي القوانين: ${allLaws.length}\n`);

  // Laws WITH source URL
  const withSource = allLaws.filter(l => l.sourceUrl && l.sourceUrl.trim() !== '' && l.sourceUrl !== 'null');
  console.log(`✅ قوانين لديها رابط مصدر: ${withSource.length}`);

  // Laws WITHOUT source URL
  const withoutSource = allLaws.filter(l => !l.sourceUrl || l.sourceUrl.trim() === '' || l.sourceUrl === 'null');
  console.log(`❌ قوانين بدون رابط مصدر: ${withoutSource.length}\n`);

  if (withoutSource.length > 0) {
    console.log('📋 القوانين التي لا تحتوي على رابط مصدر:\n');
    withoutSource.forEach((law, i) => {
      console.log(`${i + 1}. [${law.referenceNumber}] ${law.titleAr}`);
      console.log(`   المصدر: ${law.source || 'غير محدد'}`);
      console.log(`   رابط PDF AR: ${law.pdfUrlAr || '❌ لا يوجد'}`);
      console.log(`   رابط PDF FR: ${law.pdfUrlFr || '❌ لا يوجد'}`);
      console.log('');
    });
  }

  // Check for invalid/broken URLs
  console.log('\n🔗 القوانين التي لديها رابط لكنه قد لا يعمل:\n');
  const potentiallyBroken = withSource.filter(l => 
    !l.sourceUrl.startsWith('http') || 
    l.sourceUrl.includes('localhost') ||
    l.sourceUrl.includes('example.com')
  );
  
  if (potentiallyBroken.length > 0) {
    potentiallyBroken.forEach((law, i) => {
      console.log(`${i + 1}. [${law.referenceNumber}] ${law.titleAr}`);
      console.log(`   الرابط: ${law.sourceUrl}`);
      console.log('');
    });
  } else {
    console.log('✅ جميع الروابط تبدو صالحة!\n');
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
