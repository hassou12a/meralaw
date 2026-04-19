import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@meralaw.dz' },
    update: {},
    create: {
      id: 'cl7kj9v1o0001',
      email: 'admin@meralaw.dz',
      password: hashedPassword,
      name: 'Prof. HOUSSEM ABDALLAH MERAMRIA',
      profession: 'Avocat',
      plan: 'ADMIN',
    },
  });

  console.log('Admin created:', admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());