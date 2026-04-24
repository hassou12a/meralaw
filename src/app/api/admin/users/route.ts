import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan');

    const where: Record<string, unknown> = {};
    if (plan && plan !== 'all') {
      where.plan = plan;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        profession: true,
        plan: true,
        isPaymentPending: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      total: await prisma.user.count(),
      pro: await prisma.user.count({ where: { plan: 'PRO' } }),
      free: await prisma.user.count({ where: { plan: 'FREE' } }),
      pending: await prisma.user.count({ where: { isPaymentPending: true } }),
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, plan } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const updateData: Record<string, unknown> = { plan };

    if (plan === 'PRO') {
      updateData.subscriptionStartDate = now;
      updateData.subscriptionEndDate = endDate;
      updateData.isPaymentPending = false;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (plan === 'PRO') {
      await prisma.subscription.upsert({
        where: { userId },
        update: { status: 'active', startDate: now, endDate: endDate },
        create: { userId, status: 'active', startDate: now, endDate: endDate },
      });
    }

    return NextResponse.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}