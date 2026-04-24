import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profession: true,
        plan: true,
        createdAt: true,
        subscriptionEndDate: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, profession } = await request.json();

    if (!name || !profession) {
      return NextResponse.json({ error: 'Name and profession are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: String(name).trim(),
        profession: String(profession).trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        profession: true,
        plan: true,
        createdAt: true,
        subscriptionEndDate: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
