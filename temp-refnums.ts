import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const laws = await prisma.law.findMany({
    select: { referenceNumber: true },
  });
  const refs = laws.map(l => l.referenceNumber);
  console.log('EXISTING_REFS:' + JSON.stringify(refs));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });