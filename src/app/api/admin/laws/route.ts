import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all laws or search
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const lawType = searchParams.get('lawType') || '';
    const isPremium = searchParams.get('isPremium');
    const isVerified = searchParams.get('isVerified');

    const where: any = {};

    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleFr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { referenceNumber: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
        { descriptionFr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (lawType) where.lawType = lawType;
    if (isPremium !== null) where.isPremium = isPremium === 'true';
    if (isVerified !== null) where.isVerified = isVerified === 'true';

    const laws = await prisma.law.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit results
    });

    const total = await prisma.law.count({ where });

    return NextResponse.json({ laws, stats: { total } });
  } catch (error) {
    console.error('Error fetching laws:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new law
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.titleAr || !data.titleFr || !data.referenceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if reference number already exists
    const existingLaw = await prisma.law.findUnique({
      where: { referenceNumber: data.referenceNumber },
    });

    if (existingLaw) {
      return NextResponse.json(
        { error: 'Law with this reference number already exists' },
        { status: 400 }
      );
    }

    const law = await prisma.law.create({
      data: {
        titleAr: data.titleAr,
        titleFr: data.titleFr,
        titleEn: data.titleEn || '',
        category: data.category || '',
        referenceNumber: data.referenceNumber,
        year: parseInt(data.year) || new Date().getFullYear(),
        publicationDate: data.publicationDate || '',
        journalOfficiel: data.journalOfficiel || '',
        descriptionAr: data.descriptionAr || '',
        descriptionFr: data.descriptionFr || '',
        descriptionEn: data.descriptionEn || '',
        contentAr: data.contentAr || '',
        contentFr: data.contentFr || '',
        contentEn: data.contentEn || '',
        source: data.source || '',
        sourceUrl: data.sourceUrl || null,
        pdfUrlAr: data.pdfUrlAr || null,
        pdfUrlFr: data.pdfUrlFr || null,
        pdfUrlEn: data.pdfUrlEn || null,
        jorfYear: data.jorfYear ? parseInt(data.jorfYear) : null,
        jorfNumber: data.jorfNumber ? parseInt(data.jorfNumber) : null,
        isPremium: data.isPremium || false,
        isVerified: data.isVerified !== false,
        tags: Array.isArray(data.tags) ? data.tags : [],
        lawType: data.lawType || 'loi',
      },
    });

    return NextResponse.json({ law }, { status: 201 });
  } catch (error) {
    console.error('Error adding law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update law
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Law ID required' }, { status: 400 });
    }

    const data = await request.json();

    const law = await prisma.law.update({
      where: { id },
      data: {
        titleAr: data.titleAr,
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        category: data.category,
        referenceNumber: data.referenceNumber,
        year: data.year ? parseInt(data.year) : undefined,
        publicationDate: data.publicationDate,
        journalOfficiel: data.journalOfficiel,
        descriptionAr: data.descriptionAr,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        contentAr: data.contentAr,
        contentFr: data.contentFr,
        contentEn: data.contentEn,
        source: data.source,
        sourceUrl: data.sourceUrl,
        pdfUrlAr: data.pdfUrlAr,
        pdfUrlFr: data.pdfUrlFr,
        pdfUrlEn: data.pdfUrlEn,
        jorfYear: data.jorfYear ? parseInt(data.jorfYear) : undefined,
        jorfNumber: data.jorfNumber ? parseInt(data.jorfNumber) : undefined,
        isPremium: data.isPremium,
        isVerified: data.isVerified,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
        lawType: data.lawType,
      },
    });

    return NextResponse.json({ law });
  } catch (error) {
    console.error('Error updating law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove law
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Law ID required' }, { status: 400 });
    }

    await prisma.law.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Law deleted successfully' });
  } catch (error) {
    console.error('Error deleting law:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
