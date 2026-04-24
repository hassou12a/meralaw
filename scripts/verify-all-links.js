require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url || url === 'null') {
      resolve({ ok: false, status: 'NO_URL' });
      return;
    }
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      const status = res.statusCode;
      if (status >= 200 && status < 400) {
        resolve({ ok: true, status });
      } else {
        resolve({ ok: false, status });
      }
    });
    req.on('error', () => resolve({ ok: false, status: 'ERROR' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: 'TIMEOUT' });
    });
    req.end();
  });
}

async function main() {
  const laws = await prisma.law.findMany({
    select: {
      referenceNumber: true,
      titleAr: true,
      sourceUrl: true,
      pdfUrlAr: true,
      pdfUrlFr: true,
    },
    orderBy: { year: 'asc' },
  });

  console.log(`\n🔍 Checking ${laws.length} laws...\n`);

  let working = 0;
  let broken = 0;
  const brokenList = [];

  for (let i = 0; i < laws.length; i++) {
    const law = laws[i];
    console.log(`${String(i + 1).padStart(2)}. [${law.referenceNumber}] ${law.titleAr}`);

    const sourceRes = await checkUrl(law.sourceUrl);
    const pdfArRes = await checkUrl(law.pdfUrlAr);
    const pdfFrRes = await checkUrl(law.pdfUrlFr);

    const sourceOk = sourceRes.ok ? '✅' : '❌';
    const pdfArOk = pdfArRes.ok ? '✅' : '❌';
    const pdfFrOk = pdfFrRes.ok ? '✅' : (law.pdfUrlFr ? '❌' : '➖');

    console.log(`    sourceUrl: ${sourceOk} (${sourceRes.status})`);
    console.log(`    pdfUrlAr : ${pdfArOk} (${pdfArRes.status})`);
    console.log(`    pdfUrlFr : ${pdfFrOk} (${pdfFrRes.status})`);

    if (sourceRes.ok && pdfArRes.ok && (pdfFrRes.ok || !law.pdfUrlFr)) {
      working++;
    } else {
      broken++;
      brokenList.push({
        ref: law.referenceNumber,
        title: law.titleAr,
        source: sourceRes.ok,
        pdfAr: pdfArRes.ok,
        pdfFr: pdfFrRes.ok || !law.pdfUrlFr,
      });
    }
    console.log('');
  }

  console.log('────────────────────────────────────────');
  console.log(`✅ Working: ${working}/${laws.length}`);
  console.log(`❌ Broken:  ${broken}/${laws.length}`);
  console.log('────────────────────────────────────────');

  if (brokenList.length > 0) {
    console.log('\n❌ Laws with broken links:\n');
    brokenList.forEach((item) => {
      console.log(`  [${item.ref}] ${item.title}`);
      if (!item.source) console.log('    → sourceUrl broken');
      if (!item.pdfAr) console.log('    → pdfUrlAr broken');
      if (!item.pdfFr) console.log('    → pdfUrlFr broken');
    });
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
