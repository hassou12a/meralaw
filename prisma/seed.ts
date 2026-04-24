import { PrismaClient } from '@prisma/client';
import { ADMINISTRATIVE_LAW_CATALOG } from '../src/lib/legal-catalog';

const prisma = new PrismaClient();

async function main() {
  let inserted = 0;
  let updated = 0;

  for (const law of ADMINISTRATIVE_LAW_CATALOG) {
    const existing = await prisma.law.findUnique({
      where: { referenceNumber: law.referenceNumber },
    });

    if (existing) {
      await prisma.law.update({
        where: { referenceNumber: law.referenceNumber },
        data: law,
      });
      updated++;
    } else {
      await prisma.law.create({
        data: law,
      });
      inserted++;
    }
  }

  console.log(`Administrative law seed complete: ${inserted} inserted, ${updated} updated`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
