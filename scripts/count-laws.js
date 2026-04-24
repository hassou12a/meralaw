require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.law.count();
  console.log('Total laws:', count);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });