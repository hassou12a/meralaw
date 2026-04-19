import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== USERS ===');
  const users = await prisma.user.findMany();
  console.log(users);

  console.log('\n=== LAWS ===');
  const laws = await prisma.law.findMany();
  console.log(laws);

  console.log('\n=== Total counts ===');
  console.log('Users:', users.length);
  console.log('Laws:', laws.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());