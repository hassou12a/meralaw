import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdministrativeLawCatalog } from '@/lib/legal-catalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const catalog = getAdministrativeLawCatalog(category).slice(0, limit);
    const existingReferenceNumbers = await prisma.law.findMany({
      select: { referenceNumber: true },
    });

    const existingRefs = new Set(existingReferenceNumbers.map((law) => law.referenceNumber));
    const trulyNewLaws = catalog.filter((law) => !existingRefs.has(law.referenceNumber));

    return NextResponse.json({
      laws: trulyNewLaws,
      count: trulyNewLaws.length,
      message: `Found ${trulyNewLaws.length} curated administrative laws from official JORADP references`,
    });
  } catch (error) {
    console.error('Error fetching administrative feed:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch administrative feed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { laws } = await request.json();

    if (!Array.isArray(laws) || laws.length === 0) {
      return NextResponse.json({ error: 'No laws provided' }, { status: 400 });
    }

    const addedLaws = [];
    const errors = [];

    for (const lawData of laws) {
      try {
        if (!lawData.titleAr || !lawData.titleFr || !lawData.referenceNumber) {
          errors.push({ law: lawData.titleAr || lawData.titleFr || 'Unknown', error: 'Missing required fields' });
          continue;
        }

        const existing = await prisma.law.findUnique({
          where: { referenceNumber: lawData.referenceNumber },
        });

        if (existing) {
          errors.push({ law: lawData.referenceNumber, error: 'Law already exists' });
          continue;
        }

        const law = await prisma.law.create({
          data: {
            titleAr: lawData.titleAr,
            titleFr: lawData.titleFr,
            titleEn: lawData.titleEn || lawData.titleFr,
            category: lawData.category || 'إداري',
            lawType: lawData.lawType || 'قانون',
            referenceNumber: lawData.referenceNumber,
            year: lawData.year || new Date().getFullYear(),
            publicationDate: lawData.publicationDate || `${new Date().getFullYear()}-01-01`,
            journalOfficiel: lawData.journalOfficiel || `JORADP ${new Date().getFullYear()}/000`,
            descriptionAr: lawData.descriptionAr || lawData.titleAr,
            descriptionFr: lawData.descriptionFr || lawData.titleFr,
            descriptionEn: lawData.descriptionEn || lawData.titleFr,
            contentAr: lawData.contentAr || lawData.descriptionAr || lawData.titleAr,
            contentFr: lawData.contentFr || lawData.descriptionFr || lawData.titleFr,
            contentEn: lawData.contentEn || lawData.descriptionEn || lawData.titleFr,
            source: lawData.source || 'JORADP',
            sourceUrl: lawData.sourceUrl || null,
            pdfUrlAr: lawData.pdfUrlAr || null,
            pdfUrlFr: lawData.pdfUrlFr || null,
            jorfYear: lawData.jorfYear || null,
            jorfNumber: lawData.jorfNumber || null,
            isVerified: lawData.isVerified ?? true,
            isPremium: false,
            tags: Array.isArray(lawData.tags) ? lawData.tags : ['administrative-law'],
          },
        });

        addedLaws.push(law);
      } catch (error) {
        errors.push({
          law: lawData.referenceNumber || lawData.titleAr || 'Unknown',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      added: addedLaws.length,
      errors: errors.length,
      laws: addedLaws,
      errorDetails: errors,
    });
  } catch (error) {
    console.error('Error adding laws from feed:', error);
    return NextResponse.json(
      {
        error: 'Failed to add laws',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
