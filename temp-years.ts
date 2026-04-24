import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const years = await prisma.law.findMany({
    select: { year: true },
    distinct: ['year'],
    orderBy: [{ year: 'desc' }]
  });
  
  console.log('Years in database:');
  years.forEach(y => console.log(y.year));
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});