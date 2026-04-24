require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fix broken links by syncing sourceUrl with working pdfUrlAr, and fixing French links
const fixes = [
  {
    referenceNumber: '11-10',
    // Municipality law - JOR 37/2011
    sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2011/A2011037.pdf',
    pdfUrlAr: 'https://www.joradp.dz/FTP/jo-arabe/2011/A2011037.pdf',
    pdfUrlFr: 'https://www.joradp.dz/FTP/jo-francais/2011/F2011037.pdf',
  },
  {
    referenceNumber: 'PRES-12-048',
    // Keep working links, only fix French if needed
    pdfUrlFr: 'https://www.joradp.dz/FTP/jo-francais/2012/F2012010.pdf',
  },
  {
    referenceNumber: '15-247',
    // Public contracts - JOR 50/2015
    sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2015/A2015050.pdf',
    pdfUrlAr: 'https://www.joradp.dz/FTP/jo-arabe/2015/A2015050.pdf',
    pdfUrlFr: 'https://www.joradp.dz/FTP/jo-francais/2015/F2015050.pdf',
  },
  {
    referenceNumber: '20-140',
    // Central administration - JOR 24/2020
    sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2020/A2020024.pdf',
    pdfUrlAr: 'https://www.joradp.dz/FTP/jo-arabe/2020/A2020024.pdf',
    pdfUrlFr: 'https://www.joradp.dz/FTP/jo-francais/2020/F2020024.pdf',
  },
  {
    referenceNumber: '25-86',
    // Ramadan allowance - JOR 13/2025
    sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2025/A2025013.pdf',
    pdfUrlAr: 'https://www.joradp.dz/FTP/jo-arabe/2025/A2025013.pdf',
    pdfUrlFr: 'https://www.joradp.dz/FTP/jo-francais/2025/F2025013.pdf',
  },
];

async function main() {
  console.log('🔧 Fixing broken links...\n');

  for (const fix of fixes) {
    const data = {};
    if (fix.sourceUrl) data.sourceUrl = fix.sourceUrl;
    if (fix.pdfUrlAr) data.pdfUrlAr = fix.pdfUrlAr;
    if (fix.pdfUrlFr) data.pdfUrlFr = fix.pdfUrlFr;

    const updated = await prisma.law.update({
      where: { referenceNumber: fix.referenceNumber },
      data,
    });
    console.log(`✅ Fixed [${fix.referenceNumber}] ${updated.titleAr}`);
  }

  console.log('\n🎉 All broken links fixed!');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
