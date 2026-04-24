import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if Law table exists by trying to count
    const count = await prisma.law.count();
    console.log(`Law table exists. Count: ${count}`);
  } catch (error) {
    console.error('Error checking Law table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();