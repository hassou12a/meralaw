import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countLaws() {
  try {
    const count = await prisma.law.count();
    console.log(`Total number of Law records: ${count}`);
  } catch (error) {
    console.error('Error counting laws:', error);
  } finally {
    await prisma.$disconnect();
  }
}

countLaws();