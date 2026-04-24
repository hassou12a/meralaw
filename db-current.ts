import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const laws = await prisma.law.findMany({
    select: {
      id: true,
      titleAr: true,
      referenceNumber: true,
      category: true,
      year: true,
    },
    orderBy: [{ year: 'asc' }],
  });
  
  console.log(`Currently ${laws.length} laws in database:\n`);
  
  for (const law of laws) {
    console.log(`ID: ${law.id}`);
    console.log(`Title: ${law.titleAr}`);
    console.log(`Reference: ${law.referenceNumber}`);
    console.log(`Category: ${law.category}`);
    console.log(`Year: ${law.year}`);
    console.log('---');
  }
  
  // Show unique categories
  const categories = [...new Set(laws.map(l => l.category))];
  console.log(`\nUnique categories (${categories.length}):`);
  categories.forEach(c => console.log(`- ${c}`));
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});