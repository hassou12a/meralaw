import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (year) {
      where.year = parseInt(year);
    }

    if (query) {
      where.OR = [
        { titleAr: { contains: query } },
        { titleFr: { contains: query } },
        { titleEn: { contains: query } },
        { descriptionAr: { contains: query } },
        { descriptionFr: { contains: query } },
        { descriptionEn: { contains: query } },
      ];
    }

    const [laws, total] = await Promise.all([
      prisma.law.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit === -1 ? undefined : limit,
        select: {
          id: true,
          titleAr: true,
          titleFr: true,
          titleEn: true,
          category: true,
          referenceNumber: true,
          year: true,
          publicationDate: true,
          journalOfficiel: true,
          descriptionAr: true,
          descriptionFr: true,
          descriptionEn: true,
          contentAr: true,
          contentFr: true,
          isPremium: true,
          createdAt: true,
          jorfYear: true,
          jorfNumber: true,
          pdfUrlAr: true,
          pdfUrlFr: true,
          isVerified: true,
          source: true,
          sourceUrl: true,
          lawType: true,
        },
      }),
      prisma.law.count({ where }),
    ]);

    const isNewLaw = (createdAt: Date) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt > thirtyDaysAgo;
    };

    return NextResponse.json({
      laws: laws.map((law) => ({
        ...law,
        isNew: isNewLaw(law.createdAt),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching laws:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
