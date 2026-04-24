import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.law.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  console.log('Distinct categories:');
  categories.forEach(c => {
    console.log(`- "${c.category}"`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());