import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ARABIC_STOPWORDS = ['في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي', 'تلك', 'those', 'les', 'la', 'le', 'et', 'ou', 'du', 'au'];
const FRENCH_STOPWORDS = ['les', 'la', 'le', 'et', 'ou', 'du', 'au', 'des', 'une', 'un', 'pour', 'dans', 'sur', 'avec', 'par', 'ce', 'cette', 'ces'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category');
    const yearFrom = searchParams.get('yearFrom');
    const yearTo = searchParams.get('yearTo');
    const lang = searchParams.get('lang') || 'both';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    if (!q || q.length < 2) {
      return NextResponse.json({ laws: [], total: 0, suggestions: [] });
    }

    // Build search query
    const queryNormalized = q.replace(/[^\w\s\u0600-\u06FF]/g, ' ').replace(/\s+/g, ' ').trim();
    
    const where: Record<string, unknown> = {};
    
    // Category filter
    if (category && category !== 'all') {
      where.category = category;
    }
    
    // Year range filter
    if (yearFrom || yearTo) {
      where.year = {};
      if (yearFrom) (where.year as Record<string, number>).gte = parseInt(yearFrom);
      if (yearTo) (where.year as Record<string, number>).lte = parseInt(yearTo);
    }

    // For full-text search, use raw SQL
    let laws: unknown[] = [];
    let total = 0;

    try {
      // Try PostgreSQL full-text search
      const searchQuery = queryNormalized.toLowerCase();
      
      let sqlConditions = [];
      let params: (string | number)[] = [];
      let paramIndex = 1;

      if (lang === 'ar' || lang === 'both') {
        sqlConditions.push(`(to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", '')) @@ plainto_tsquery('arabic', $${paramIndex}) OR "titleAr" ILIKE $${paramIndex + 1})`);
        params.push(searchQuery, `%${searchQuery}%`);
        paramIndex += 2;
      }

      if (lang === 'fr' || lang === 'both') {
        sqlConditions.push(`(to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", '')) @@ plainto_tsquery('french', $${paramIndex}) OR "titleFr" ILIKE $${paramIndex + 1})`);
        params.push(searchQuery, `%${searchQuery}%`);
        paramIndex += 2;
      }

      let whereClause = sqlConditions.length > 0 ? `WHERE (${sqlConditions.join(' OR ')})` : '';
      
      if (category && category !== 'all') {
        whereClause = whereClause ? whereClause + ' AND "category" = $' + paramIndex : 'WHERE "category" = $' + paramIndex;
        params.push(category);
        paramIndex++;
      }

      const sql = `
        SELECT id, "titleAr", "titleFr", "category", "referenceNumber", "year", "contentAr", "contentFr",
               ts_headline('arabic', "contentAr", plainto_tsquery('arabic', $1), 'MaxWords=25, MinWords=8, StartSel=<b>, StopSel=</b>') as headline_ar,
               ts_headline('french', "contentFr", plainto_tsquery('french', $1), 'MaxWords=25, MinWords=8, StartSel=<b>, StopSel=</b>') as headline_fr,
               ts_rank(to_tsvector('arabic', "titleAr" || ' ' || "contentAr"), plainto_tsquery('arabic', $1)) +
               ts_rank(to_tsvector('french', "titleFr" || ' ' || "contentFr"), plainto_tsquery('french', $1)) as rank
        FROM "Law"
        ${whereClause}
        ORDER BY rank DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      params.push(limit, (page - 1) * limit);

      const offset = (page - 1) * limit;
      const countSql = `SELECT COUNT(*) as total FROM "Law" ${whereClause}`;
      
      const lawsResult = await prisma.$queryRawUnsafe(sql, ...params);
      const totalResult = await prisma.$queryRawUnsafe(countSql, ...params.slice(0, -2));
      laws = lawsResult as unknown[];
      total = Number((totalResult as { total: bigint }[])[0]?.total || 0);

      total = Number((total as unknown as { total: bigint }[])[0]?.total || 0);
    } catch {
      // Fallback to Prisma contains search
      const orConditions = [
        { titleAr: { contains: q } },
        { titleFr: { contains: q } },
        { contentAr: { contains: q } },
        { contentFr: { contains: q } },
        { referenceNumber: { contains: q } },
      ];
      
      where.OR = orConditions;
      
      const [lawsResult, totalResult] = await Promise.all([
        prisma.law.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.law.count({ where }),
      ]);
      
      laws = lawsResult;
      total = totalResult;
    }

    // Get suggestions (titles that start with query)
    const suggestions = await prisma.law.findMany({
      where: {
        OR: [
          { titleAr: { startsWith: q } },
          { titleFr: { startsWith: q } },
        ],
      },
      take: 5,
      select: { titleAr: true, titleFr: true, referenceNumber: true, category: true },
    });

    // Log search for analytics
    try {
      await prisma.searchLog.create({
        data: {
          query: q,
          resultsCount: total,
          language: lang,
          category: category || null,
        },
      });
    } catch {}

    const lawsArray = Array.isArray(laws) ? laws : [];
    
    return NextResponse.json({
      laws: lawsArray.map((law: unknown) => ({
        id: (law as Record<string, unknown>).id,
        titleAr: (law as Record<string, unknown>).titleAr,
        titleFr: (law as Record<string, unknown>).titleFr,
        category: (law as Record<string, unknown>).category,
        referenceNumber: (law as Record<string, unknown>).referenceNumber,
        year: (law as Record<string, unknown>).year,
        headlineAr: (law as Record<string, unknown>).headline_ar,
        headlineFr: (law as Record<string, unknown>).headline_fr,
      })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      suggestions: suggestions.map((s) => ({
        titleAr: s.titleAr,
        titleFr: s.titleFr,
        referenceNumber: s.referenceNumber,
        category: s.category,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}