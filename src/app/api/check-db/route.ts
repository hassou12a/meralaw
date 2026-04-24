import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const count = await prisma.law.count();
    return NextResponse.json({ 
      status: 'ok',
      laws: count 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
