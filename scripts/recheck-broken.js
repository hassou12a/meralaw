require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

// Check specific URLs with delay to avoid rate limiting
const urlsToCheck = [
  { ref: 'LOI-03-010', url: 'https://www.joradp.dz/FTP/jo-arabe/2003/A2003043.pdf', name: 'sourceUrl (same as pdf)' },
  { ref: 'PRES-12-048', url: 'https://www.joradp.dz/FTP/jo-francais/2012/F2012010.pdf', name: 'pdfUrlFr' },
  { ref: '12-07', url: 'https://www.joradp.dz/FTP/jo-arabe/2012/A2012012.pdf', name: 'pdfUrlAr' },
  { ref: '12-07', url: 'https://www.joradp.dz/FTP/jo-francais/2012/F2012012.pdf', name: 'pdfUrlFr' },
  { ref: 'LOI-18-14', url: 'https://www.joradp.dz/FTP/jo-arabe/2018/A2018050.pdf', name: 'sourceUrl (same as pdf)' },
  { ref: '20-01', url: 'https://www.joradp.dz/FTP/jo-arabe/2020/A2020082.pdf', name: 'pdfUrlAr' },
  { ref: '22-18', url: 'https://www.joradp.dz/FTP/jo-arabe/2022/A2022050.pdf', name: 'sourceUrl (same as pdf)' },
  { ref: '22-18', url: 'https://www.joradp.dz/FTP/jo-francais/2022/F2022050.pdf', name: 'pdfUrlFr' },
  { ref: '23-316', url: 'https://www.joradp.dz/FTP/jo-arabe/2023/A2023068.pdf', name: 'sourceUrl (same as pdf)' },
  { ref: '25-54', url: 'https://www.joradp.dz/FTP/jo-francais/2025/F2025014.pdf', name: 'pdfUrlFr' },
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 15000 }, (res) => {
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
    });
    req.on('error', (e) => resolve({ ok: false, status: `ERROR: ${e.message}` }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 'TIMEOUT' }); });
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🔍 Rechecking potentially broken links with delays...\n');

  for (const item of urlsToCheck) {
    await delay(2000); // Wait 2 seconds between requests
    const result = await checkUrl(item.url);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} [${item.ref}] ${item.name}: ${result.status}`);
    console.log(`   ${item.url}`);
    console.log('');
  }

  console.log('\n📝 Note: If some show ERROR, try opening the URL directly in browser.');
  console.log('   JORADP server sometimes blocks automated requests.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
