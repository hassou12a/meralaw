import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const law = await prisma.law.findUnique({
    where: { referenceNumber: '96-438' },
    select: {
      id: true,
      titleAr: true,
      category: true,
      referenceNumber: true,
    },
  });
  console.log('Law:', law);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());