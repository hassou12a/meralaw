import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const lawCount = await prisma.law.count();
    
    return NextResponse.json({
      status: 'connected',
      users: userCount,
      laws: lawCount,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
    }, { status: 500 });
  }
}