import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ADMINISTRATIVE_LAW_CATALOG } from '@/lib/legal-catalog';

export async function POST() {
  try {
    const results = { inserted: 0, updated: 0, errors: 0 };

    for (const law of ADMINISTRATIVE_LAW_CATALOG) {
      try {
        const existing = await prisma.law.findUnique({
          where: { referenceNumber: law.referenceNumber },
        });

        if (existing) {
          await prisma.law.update({
            where: { referenceNumber: law.referenceNumber },
            data: law,
          });
          results.updated++;
        } else {
          await prisma.law.create({ data: law });
          results.inserted++;
        }
      } catch {
        results.errors++;
      }
    }

    const total = await prisma.law.count({
      where: {
        OR: [{ tags: { has: 'administrative-law' } }, { source: 'JORADP' }],
      },
    });

    return NextResponse.json({
      success: true,
      ...results,
      total,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.law.count();
    const administrative = await prisma.law.count({
      where: {
        OR: [{ tags: { has: 'administrative-law' } }, { source: 'JORADP' }],
      },
    });

    return NextResponse.json({ count, administrative });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
