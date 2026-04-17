-- ============================================================
-- COMPLETE DATABASE MIGRATION FOR LEX-DZ
-- Run this in Supabase SQL Editor (all in one)
-- ============================================================

-- ============================================================
-- STEP 1: Add columns
-- ============================================================
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "jorfYear" INTEGER;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "jorfNumber" INTEGER;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "pdfUrlAr" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "pdfUrlFr" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "sourceVerified" BOOLEAN DEFAULT false;

-- ============================================================
-- STEP 2: Enable full-text search
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for Arabic full-text search
CREATE INDEX IF NOT EXISTS "idx_laws_search_ar" 
ON "Law" USING GIN (
  to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", ''))
);

-- GIN indexes for French full-text search
CREATE INDEX IF NOT EXISTS "idx_laws_search_fr" 
ON "Law" USING GIN (
  to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", ''))
);

-- Trigram indexes for similarity
CREATE INDEX IF NOT EXISTS "idx_laws_trgm_ar" ON "Law" USING GIN ("titleAr" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "idx_laws_trgm_fr" ON "Law" USING GIN ("titleFr" gin_trgm_ops);

-- ============================================================
-- STEP 3: Seed 16 real Algerian laws
-- ============================================================
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "year", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified") VALUES
('الدستور الجزائري', 'Constitution algérienne', '96-438', 'دستور', 1996, 1996, 76, 
 'https://www.joradp.dz/FTP/jo-arabe/1996/A1996076.pdf', 
 'https://www.joradp.dz/FTP/jo-francais/1996/F1996076.pdf', true),
('التعديل الدستوري 2020', 'Constitution amendment 2020', '20-01', 'دستور', 2020, 2020, 82,
 'https://www.joradp.dz/FTP/jo-arabe/2020/A2020082.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2020/F2020082.pdf', true),
('قانون الإجراءات المدنية والإدارية', 'Code de procédures civiles et administratives', '08-09', 'إجراءات قضائية إدارية', 2008, 2008, 21,
 'https://www.joradp.dz/FTP/jo-arabe/2008/A2008021.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2008/F2008021.pdf', true),
('القانون الأساسي العام للوظيفة العمومية', 'Statut général de la fonction publique', '06-03', 'وظيف عمومي', 2006, 2006, 46,
 'https://www.joradp.dz/FTP/jo-arabe/2006/A2006046.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2006/F2006046.pdf', true),
('المرسوم التنفيذي المتعلق بممارسة حق الإضراب', 'Décret exécutif relatif au droit de grève', '90-02', 'وظيف عمومي', 1990, 1990, 2,
 'https://www.joradp.dz/FTP/jo-arabe/1990/A1990002.pdf',
 'https://www.joradp.dz/FTP/jo-francais/1990/F1990002.pdf', true),
('قانون البلدية', 'Loi relative à la commune', '11-10', 'إدارة محلية', 2011, 2011, 37,
 'https://www.joradp.dz/FTP/jo-arabe/2011/A2011037.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2011/F2011037.pdf', true),
('قان��ن الولاية', 'Loi relative à la wilaya', '12-07', 'إدارة محلية', 2012, 2012, 12,
 'https://www.joradp.dz/FTP/jo-arabe/2012/A2012012.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2012/F2012012.pdf', true),
('قانون الصفقات العمومية', 'Marchés publics', '15-247', 'صفقات عمومية', 2015, 2015, 50,
 'https://www.joradp.dz/FTP/jo-arabe/2015/A2015050.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2015/F2015050.pdf', true),
('تعديل الصفقات 2023', 'Modification marchés publics 2023', '23-316', 'صفقات عمومية', 2023, 2023, 68,
 'https://www.joradp.dz/FTP/jo-arabe/2023/A2023068.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2023/F2023068.pdf', true),
('تنظيم السجن', 'Organisation pénitentiaire', '05-04', 'تنظيم إداري', 2005, 2005, 12,
 'https://www.joradp.dz/FTP/jo-arabe/2005/A2005012.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2005/F2005012.pdf', true),
('المرسوم التنفيذي تنظيم الإدارة المركزية', 'Organisation administration centrale', '20-140', 'تنظيم إداري', 2020, 2020, 24,
 'https://www.joradp.dz/FTP/jo-arabe/2020/A2020024.pdf',
 'https://www.joradp.dz/FTP/jo-francais/2020/F2020024.pdf', true),
('قانون المالية العامة', 'Lois de finances', '84-17', 'مالية عامة', 1984, 1984, 28,
 'https://www.joradp.dz/FTP/jo-arabe/1984/A1984028.pdf',
 'https://www.joradp.dz/FTP/jo-francais/1984/F1984028.pdf', true),
('القانون المدني', 'Code civil', '75-58', 'قوانين مرجعية', 1975, 1975, 78,
 'https://www.joradp.dz/FTP/jo-arabe/1975/A1975078.pdf',
 'https://www.joradp.dz/FTP/jo-francais/1975/F1975078.pdf', true),
('قانون العقوبات', 'Code pénal', '66-156', 'قوانين مرجعية', 1966, 1966, 49,
 'https://www.joradp.dz/FTP/jo-arabe/1966/A1966049.pdf',
 'https://www.joradp.dz/FTP/jo-francais/1966/F1966049.pdf', true),
('قانون الأسرة', 'Code de la famille', '84-11', 'قوانين مرجعية', 1984, 1984, 24,
 'https://www.joradp.dz/FTP/jo-arabe/1984/A1984024.pdf',
 'https://www.joradp.dz/FTP/jo-francais/1984/F1984024.pdf', true),
('قانون العمل', 'Code du travail', '90-11', 'قوانين مرجعية', 1990, 1990, 17,
 'https://www.joradp.dz/FTP/jo-arabe/1990/A1990017.pdf',
 'https://www.joradp.dz/FTP/jo-francais/1990/F1990017.pdf', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Show seeded laws
SELECT ' Seeded Laws' as info, COUNT(*) as total FROM "Law" WHERE "sourceVerified" = true
UNION ALL
SELECT ' Total Laws', COUNT(*) FROM "Law";

-- Breakdown by category
SELECT "category", COUNT(*)::int as total
FROM "Law"
WHERE "sourceVerified" = true
GROUP BY "category"
ORDER BY "category";