import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const results = { users: 0, laws: 0 };

    // Create test users
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const testUsers = [
      { email: 'admin@meralaw.dz', name: 'Admin User', profession: 'avocat' },
      { email: 'user@meralaw.dz', name: 'Test User', profession: 'juriste' },
    ];

    for (const u of testUsers) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        await prisma.user.create({
          data: { ...u, password: hashedPassword, plan: 'PRO' },
        });
        results.users++;
      }
    }

    // Seed laws if none exist
    const lawCount = await prisma.law.count();
    if (lawCount === 0) {
      const laws = [
        { titleAr: 'الدستور الجزائري', titleFr: 'Constitution algérienne', category: 'دستور', referenceNumber: '96-438', year: 1996, jorfYear: 1996, jorfNumber: 76, isVerified: true },
        { titleAr: 'القانون المدني', titleFr: 'Code civil', category: 'قوانين مرجعية', referenceNumber: '75-58', year: 1975, jorfYear: 1975, jorfNumber: 78, isVerified: true },
        { titleAr: 'قانون العقوبات', titleFr: 'Code pénal', category: 'قوانين مرجعية', referenceNumber: '66-156', year: 1966, jorfYear: 1966, jorfNumber: 49, isVerified: true },
        { titleAr: 'قانون الأسرة', titleFr: 'Code de la famille', category: 'قوانين مرجعية', referenceNumber: '84-11', year: 1984, jorfYear: 1984, jorfNumber: 24, isVerified: true },
        { titleAr: 'قانون العمل', titleFr: 'Code du travail', category: 'قوانين مرجعية', referenceNumber: '90-11', year: 1990, jorfYear: 1990, jorfNumber: 17, isVerified: true },
      ];

      for (const law of laws) {
        await prisma.law.create({ data: law });
        results.laws++;
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}