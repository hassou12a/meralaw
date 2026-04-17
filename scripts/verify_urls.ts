import { prisma } from '../src/lib/db';
import { LAWS_DATA } from '../src/lib/joradp';
import { buildJoradpUrl } from '../src/lib/joradp';

async function verifyUrls() {
  console.log('🔍 Verifying JORADP PDF URLs...\n');

  const results = {
    found: 0,
    notFound: 0,
    errors: [] as string[],
  };

  for (const law of LAWS_DATA) {
    const pdfAr = buildJoradpUrl(law.jorfYear, law.jorfNumber, 'ar');
    const pdfFr = buildJoradpUrl(law.jorfYear, law.jorfNumber, 'fr');

    const [statusAr, statusFr] = await Promise.all([
      fetch(pdfAr, { method: 'HEAD' }).then(r => r.status).catch(() => 0),
      fetch(pdfFr, { method: 'HEAD' }).then(r => r.status).catch(() => 0),
    ]);

    const foundAr = statusAr === 200;
    const foundFr = statusFr === 200;

    if (foundAr) results.found++;
    else {
      results.notFound++;
      results.errors.push(`AR: ${law.referenceNumber} (${statusAr})`);
    }

    if (foundFr) results.found++;
    else {
      results.notFound++;
      results.errors.push(`FR: ${law.referenceNumber} (${statusFr})`);
    }

    console.log(
      `${law.referenceNumber} | ${foundAr ? '✅' : '❌'} AR | ${foundFr ? '✅' : '❌'} FR | ` +
      `JORF ${law.jorfYear}/${law.jorfNumber}`
    );
  }

  console.log(`\n📊 Summary: ${results.found}/${LAWS_DATA.length * 2} URLs verified`);

  if (results.errors.length > 0) {
    console.log('\n❌ Failed URLs:');
    results.errors.forEach(e => console.log(`  - ${e}`));
  }

  console.log('\n--- Checking DB laws ---');
  const dbLaws = await prisma.law.findMany({
    where: { isVerified: true },
    select: { referenceNumber: true, pdfUrlAr: true, pdfUrlFr: true },
  });

  let dbFound = 0, dbNotFound = 0;
  for (const law of dbLaws) {
    if (!law.pdfUrlAr || !law.pdfUrlFr) {
      dbNotFound++;
      continue;
    }
    const [ar, fr] = await Promise.all([
      fetch(law.pdfUrlAr, { method: 'HEAD' }).then(r => r.status).catch(() => 0),
      fetch(law.pdfUrlFr, { method: 'HEAD' }).then(r => r.status).catch(() => 0),
    ]);
    if (ar === 200) dbFound++;
    else dbNotFound++;
    if (fr === 200) dbFound++;
    else dbNotFound++;
  }

  console.log(`DB PDFs: ${dbFound}/${dbLaws.length * 2} verified`);

  return results;
}

verifyUrls()
  .catch(console.error)
  .finally(() => prisma.$disconnect());