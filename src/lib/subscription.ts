import { prisma } from '@/lib/db';

export async function hasProAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;
  if (user.plan !== 'PRO') return false;
  
  if (user.subscriptionEndDate) {
    if (new Date() > user.subscriptionEndDate) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'FREE' },
      });
      return false;
    }
  }

  return true;
}

export async function checkAndUpdateSubscription(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return 'FREE';

  if (user.plan === 'PRO' && user.subscriptionEndDate) {
    if (new Date() > user.subscriptionEndDate) {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          plan: 'FREE',
          subscriptionStartDate: null,
          subscriptionEndDate: null,
        },
      });
      return 'FREE';
    }
  }

  return user.plan;
}

export async function activateProSubscription(
  userId: string, 
  months: number = 1
): Promise<boolean> {
  try {
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    await prisma.user.update({
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

    return true;
  } catch (error) {
    console.error('Error activating subscription:', error);
    return false;
  }
}