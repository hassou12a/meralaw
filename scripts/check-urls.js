const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const laws = await prisma.law.findMany({ take: 5 });
  for (const l of laws) {
    console.log(`${l.referenceNumber} | ${l.pdfUrlAr} | ${l.pdfUrlFr}`);
  }
  await prisma.$disconnect();
})();