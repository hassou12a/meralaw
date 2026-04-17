-- ============================================================
-- FULL-TEXT SEARCH MIGRATION FOR ALGERIAN LAWS DB
-- ============================================================
-- Run this in Supabase SQL Editor or via psql
-- ============================================================

-- 1. Enable pg_trgm extension for trigram similarity
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Add search columns to Law table
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "tags" TEXT[];

-- 3. Create GIN indexes for full-text search (fast queries)
-- Arabic search index
CREATE INDEX IF NOT EXISTS "idx_laws_search_ar" 
ON "Law" USING GIN (
  to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", ''))
);

-- French search index
CREATE INDEX IF NOT EXISTS "idx_laws_search_fr" 
ON "Law" USING GIN (
  to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", ''))
);

-- 4. Create trigram indexes for similarity search (short queries fallback)
CREATE INDEX IF NOT EXISTS "idx_laws_trgm_ar" ON "Law" USING GIN ("titleAr" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_laws_trgm_fr" ON "Law" USING GIN ("titleFr" gin_trgm_ops);

-- 5. Create SearchLog table for analytics
CREATE TABLE IF NOT EXISTS "SearchLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "query" TEXT NOT NULL,
  "resultsCount" INTEGER NOT NULL,
  "language" TEXT,
  "category" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 6. Verify current laws
SELECT "category", COUNT(*)::int as total
FROM "Law"
GROUP BY "category"
ORDER BY "category";

-- ============================================================
-- TEST QUERIES TO RUN AFTER MIGRATION
-- ============================================================

-- Test 1: Arabic search - "صفقات عمومية"
SELECT "titleAr", "titleFr", "referenceNumber", "year", "category"
FROM "Law"
WHERE to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", '')) 
  @@ plainto_tsquery('arabic', 'صفقات عمومية')
ORDER BY ts_rank(to_tsvector('arabic', "titleAr" || ' ' || "contentAr"), 
  plainto_tsquery('arabic', 'صفقات عمومية')) DESC;

-- Test 2: French search - "marchés publics"
SELECT "titleAr", "titleFr", "referenceNumber", "year", "category"
FROM "Law"
WHERE to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", '')) 
  @@ plainto_tsquery('french', 'marchés publics')
ORDER BY ts_rank(to_tsvector('french', "titleFr" || ' ' || "contentFr"), 
  plainto_tsquery('french', 'marchés publics')) DESC;

-- Test 3: Short query fallback with trigram - "08-09"
SELECT "titleAr", "titleFr", "referenceNumber"
FROM "Law"
WHERE similarity("referenceNumber", '08-09') > 0.3
ORDER BY similarity("referenceNumber", '08-09') DESC;

-- Test 4: Arabic discipline - "تأديب الموظف"
SELECT "titleAr", "titleFr", "referenceNumber", "year"
FROM "Law"
WHERE to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", '')) 
  @@ plainto_tsquery('arabic', 'تأديب الموظف');

-- Test 5: Administrative recourse - "recours administratif"
SELECT "titleAr", "titleFr", "referenceNumber", "year"
FROM "Law"
WHERE to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", '')) 
  @@ plainto_tsquery('french', 'recours administratif');

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================
SELECT 
  "category",
  COUNT(*) as total,
  SUM(CASE WHEN "source" = 'joradp.dz' THEN 1 ELSE 0 END) as verified
FROM "Law"
GROUP BY "category"
ORDER BY "category";