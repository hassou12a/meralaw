import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const law = await prisma.law.findUnique({
      where: { id: params.id },
    });

    if (!law) {
      return NextResponse.json(
        { error: 'Law not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(law);
  } catch (error) {
    console.error('Error fetching law:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
