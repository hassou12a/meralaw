import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'PRO',
        subscriptionStartDate: now,
        subscriptionEndDate: endDate,
        isPaymentPending: false,
      },
    });

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        status: 'active',
        startDate: now,
        endDate: endDate,
      },
      create: {
        userId,
        status: 'active',
        startDate: now,
        endDate: endDate,
      },
    });

    return NextResponse.json({ 
      message: 'User activated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        isPaymentPending: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profession: true,
        paymentReceiptUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ pendingUsers });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}