import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const laws = await prisma.law.findMany({
    select: {
      id: true,
      titleAr: true,
      referenceNumber: true,
      jorfYear: true,
      jorfNumber: true,
      pdfUrlAr: true,
      pdfUrlFr: true,
      sourceUrl: true,
    },
    orderBy: [{ year: 'asc' }],
  });

  console.log(`Found ${laws.length} laws:\n`);
  
  for (const law of laws) {
    console.log(`ID: ${law.id}`);
    console.log(`Title: ${law.titleAr}`);
    console.log(`Reference: ${law.referenceNumber}`);
    console.log(`JORF Year: ${law.jorfYear}, Number: ${law.jorfNumber}`);
    console.log(`PDF URL AR: ${law.pdfUrlAr || 'NULL'}`);
    console.log(`PDF URL FR: ${law.pdfUrlFr || 'NULL'}`);
    console.log(`Source URL: ${law.sourceUrl || 'NULL'}`);
    console.log('---');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());