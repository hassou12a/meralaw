require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allLaws = await prisma.law.findMany({
    select: {
      id: true,
      titleAr: true,
      referenceNumber: true,
      sourceUrl: true,
      source: true,
      pdfUrlAr: true,
      pdfUrlFr: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`\n📊 إجمالي القوانين: ${allLaws.length}\n`);
  console.log('───────────────────────────────────────────────────────\n');

  allLaws.forEach((law, i) => {
    console.log(`${String(i + 1).padStart(2)}. [${law.referenceNumber}] ${law.titleAr}`);
    console.log(`    sourceUrl : ${law.sourceUrl}`);
    console.log(`    pdfUrlAr  : ${law.pdfUrlAr || '—'}`);
    console.log(`    pdfUrlFr  : ${law.pdfUrlFr || '—'}`);
    console.log('');
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
