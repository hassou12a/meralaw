# Database Migration - Step by Step

## Option 1: Run SQL in Supabase (RECOMMENDED)

1. Open https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in left sidebar
4. Copy ALL content from `scripts/COMPLETE_MIGRATION.sql`
5. Paste into SQL Editor
6. Click **Run**

## Option 2: Using psql

```bash
psql $DATABASE_URL -f scripts/COMPLETE_MIGRATION.sql
```

## What the migration does:

| Step | Action |
|------|--------|
| 1 | Adds `jorfYear`, `jorfNumber`, `pdfUrlAr`, `pdfUrlFr`, `sourceVerified` columns |
| 2 | Enables `pg_trgm` extension for trigram similarity |
| 3 | Creates GIN indexes for Arabic full-text search |
| 4 | Creates GIN indexes for French full-text search |
| 5 | Creates trigram indexes for similarity search |
| 6 | Seeds 16 real Algerian laws with JORF references |

## After running, verify:

```sql
-- Check seeded laws
SELECT "referenceNumber", "titleAr", "jorfYear", "sourceVerified" 
FROM "Law" 
WHERE "sourceVerified" = true
ORDER BY "jorfYear";

-- Category breakdown
SELECT "category", COUNT(*)::int as total
FROM "Law"
WHERE "sourceVerified" = true
GROUP BY "category";
```

## Test full-text search:

```sql
-- Arabic search
SELECT "titleAr", "titleFr", "referenceNumber"
FROM "Law"
WHERE to_tsvector('arabic', COALESCE("titleAr", '')) @@ plainto_tsquery('arabic', 'صفقات');

-- French search
SELECT "titleAr", "titleFr", "referenceNumber"
FROM "Law"
WHERE to_tsvector('french', COALESCE("titleFr", '')) @@ plainto_tsquery('french', 'marchés');
```

## 16 Laws seeded:

| # | Reference | Arabic Title | Year | JORF |
|---|-----------|-------------|------|------|
| 1 | 96-438 | الدستور الجزائري | 1996 | 76 |
| 2 | 20-01 | التعديل الدستوري 2020 | 2020 | 82 |
| 3 | 08-09 | قانون الإجراءات المدنية والإدارية | 2008 | 21 |
| 4 | 06-03 | القانون الأساسي العام للوظيفة العمومية | 2006 | 46 |
| 5 | 90-02 | المرسوم التنفيذي المتعلق بممارسة حق الإضراب | 1990 | 2 |
| 6 | 11-10 | قانون البلدية | 2011 | 37 |
| 7 | 12-07 | قانون الولاية | 2012 | 12 |
| 8 | 15-247 | قانون الصفقات العمومية | 2015 | 50 |
| 9 | 23-316 | تعديل الصفقات 2023 | 2023 | 68 |
| 10 | 05-04 | تنظيم السجن | 2005 | 12 |
| 11 | 20-140 | المرسوم التنفيذي تنظيم الإدارة المركزية | 2020 | 24 |
| 12 | 84-17 | قانون المالية العامة | 1984 | 28 |
| 13 | 75-58 | القانون المدني | 1975 | 78 |
| 14 | 66-156 | قانون العقوبات | 1966 | 49 |
| 15 | 84-11 | قانون الأسرة | 1984 | 24 |
| 16 | 90-11 | قانون العمل | 1990 | 17 |