-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add new columns to Law table
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "searchVectorAr" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "searchVectorFr" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "tags" TEXT[];

-- Make referenceNumber unique
ALTER TABLE "Law" DROP CONSTRAINT IF EXISTS "Law_referenceNumber_key";
ALTER TABLE "Law" ADD CONSTRAINT "Law_referenceNumber_key" UNIQUE ("referenceNumber");

-- Create function to generate search vectors
CREATE OR REPLACE FUNCTION make_search_vector_ar(text) RETURNS tsvector AS $$
BEGIN
  RETURN to_tsvector('arabic', COALESCE($1, ''));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION make_search_vector_fr(text) RETURNS tsvector AS $$
BEGIN
  RETURN to_tsvector('french', COALESCE($1, ''));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create indexes for full-text search
CREATE INDEX IF NOT EXISTS "idx_laws_search_ar" ON "Law" USING GIN (make_search_vector_ar("titleAr" || ' ' || COALESCE("contentAr", '')));
CREATE INDEX IF NOT EXISTS "idx_laws_search_fr" ON "Law" USING GIN (make_search_vector_fr("titleFr" || ' ' || COALESCE("contentFr", '')));

-- Create trigram indexes for similarity search
CREATE INDEX IF NOT EXISTS "idx_laws_trgm_ar" ON "Law" USING GIN ("titleAr" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_laws_trgm_fr" ON "Law" USING GIN ("titleFr" gin_trgm_ops);

-- Create SearchLog table
CREATE TABLE IF NOT EXISTS "SearchLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "query" TEXT NOT NULL,
  "resultsCount" INTEGER NOT NULL,
  "language" TEXT,
  "category" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes on SearchLog
CREATE INDEX IF NOT EXISTS "idx_searchlog_created" ON "SearchLog" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_searchlog_query" ON "SearchLog" ("query");