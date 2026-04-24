require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

async function checkPDFExists(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ status: 'NO_URL', url });
      return;
    }

    const request = https.get(url, (response) => {
      if (response.statusCode >= 200 && response.statusCode < 400) {
        resolve({ status: 'OK', statusCode: response.statusCode, url });
      } else {
        resolve({ status: 'FAIL', statusCode: response.statusCode, url });
      }
    });

    request.on('error', (error) => {
      resolve({ status: 'ERROR', error: error.message, url });
    });

    request.setTimeout(10000, () => {
      request.destroy();
      resolve({ status: 'TIMEOUT', url });
    });
  });
}

async function main() {
  const laws = await prisma.law.findMany({ orderBy: { id: 'asc' } });
  console.log(`\n🔍 Checking ${laws.length} laws...\n`);

  let totalWorking = 0;
  let totalFailing = 0;
  let totalNoURL = 0;

  for (const law of laws) {
    console.log(`📜 ${law.titleFr} (${law.referenceNumber})`);

    const checks = [
      { type: 'Arabic PDF', url: law.pdfUrlAr },
      { type: 'French PDF', url: law.pdfUrlFr }
    ];

    for (const check of checks) {
      if (!check.url) {
        console.log(`  ❌ ${check.type}: No URL provided`);
        totalNoURL++;
        continue;
      }

      const result = await checkPDFExists(check.url);
      
      switch (result.status) {
        case 'OK':
          console.log(`  ✅ ${check.type}: ${result.statusCode} (${new URL(check.url).hostname})`);
          totalWorking++;
          break;
        case 'FAIL':
          console.log(`  ❌ ${check.type}: HTTP ${result.statusCode} - ${check.url}`);
          totalFailing++;
          break;
        case 'ERROR':
          console.log(`  ❌ ${check.type}: Network error - ${result.error}`);
          totalFailing++;
          break;
        case 'TIMEOUT':
          console.log(`  ⏰ ${check.type}: Timeout - ${check.url}`);
          totalFailing++;
          break;
      }
    }
    console.log('');
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Working PDFs: ${totalWorking}`);
  console.log(`❌ Failed PDFs: ${totalFailing}`);
  console.log(`🔗 No URLs: ${totalNoURL}`);
  console.log(`📊 Total laws checked: ${laws.length}`);

  await prisma.$disconnect();
}

main().catch(console.error);