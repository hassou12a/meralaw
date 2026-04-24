import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const laws = await prisma.law.findMany({
    select: { category: true },
  });
  const cats = [...new Set(laws.map(l => l.category))];
  console.log('EXISTING_CATS:' + JSON.stringify(cats));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });