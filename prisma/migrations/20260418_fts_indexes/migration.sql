-- Full-Text Search Indexes for Lex-DZ
-- Run this in Supabase SQL Editor or via psql

-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for Arabic search
CREATE INDEX IF NOT EXISTS idx_laws_fts_ar 
ON "Law" USING GIN (
  to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", ''))
);

-- Create GIN index for French search
CREATE INDEX IF NOT EXISTS idx_laws_fts_fr 
ON "Law" USING GIN (
  to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", ''))
);

-- Create trigram indexes for similarity search
CREATE INDEX IF NOT EXISTS idx_laws_trgm_ar ON "Law" USING GIN ("titleAr" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_laws_trgm_fr ON "Law" USING GIN ("titleFr" gin_trgm_ops);

-- Verify indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'Law' 
AND indexname LIKE 'idx_laws_%';

-- Test search queries
-- SELECT "titleAr", "titleFr" FROM "Law" WHERE to_tsvector('arabic', "titleAr") @@ plainto_tsquery('arabic', 'دستور');