-- ============================================================
-- UPSERT REAL ALGERIAN LAWS WITH JORADP PDF LINKS
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add columns if they don't exist
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "jorfYear" INTEGER;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "jorfNumber" INTEGER;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "pdfUrlAr" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "pdfUrlFr" TEXT;
ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "sourceVerified" BOOLEAN DEFAULT false;

-- Function to build JORADP PDF URL
CREATE OR REPLACE FUNCTION build_joradp_url(year INTEGER, jorf_num INTEGER, lang TEXT)
RETURNS TEXT AS $$
DECLARE
  padded TEXT;
  prefix TEXT;
  folder TEXT;
BEGIN
  padded := LPAD(jorf_num::TEXT, 3, '0');
  prefix := CASE WHEN lang = 'ar' THEN 'A' ELSE 'F' END;
  folder := CASE WHEN lang = 'ar' THEN 'jo-arabe' ELSE 'jo-francais' END;
  RETURN 'https://www.joradp.dz/FTP/' || folder || '/' || year || '/' || prefix || year || padded || '.pdf';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- UPSERT LAWS (16 laws)
-- ============================================================

-- 1. Constitution (96-438) + Amendment (20-01)
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'الدستور الجزائري',
  'Constitution algérienne',
  '96-438',
  'دستور',
  1996,
  76,
  build_joradp_url(1996, 76, 'ar'),
  build_joradp_url(1996, 76, 'fr'),
  true,
  1996,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 2. Constitutional Amendment 2020
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'التعديل الدستوري 2020',
  'Constitution amendment 2020',
  '20-01',
  'دستور',
  2020,
  82,
  build_joradp_url(2020, 82, 'ar'),
  build_joradp_url(2020, 82, 'fr'),
  true,
  2020,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 3. Civil Procedure Law 08-09
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون الإجراءات المدنية والإدارية',
  'Code de procédures civiles et administratives',
  '08-09',
  'إجراءات قضائية إدارية',
  2008,
  21,
  build_joradp_url(2008, 21, 'ar'),
  build_joradp_url(2008, 21, 'fr'),
  true,
  2008,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 4. Civil Service Law 06-03
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'القانون الأساسي العام للوظيفة العمومية',
  'Statut général de la fonction publique',
  '06-03',
  'وظيف عمومي',
  2006,
  46,
  build_joradp_url(2006, 46, 'ar'),
  build_joradp_url(2006, 46, 'fr'),
  true,
  2006,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 5. Strike Right Decree 90-02
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'المرسوم التنفيذي المتعلق بممارسة حق الإضراب في الوظيف العمومي',
  'Décret exécutif relatif au droit de grève',
  '90-02',
  'وظيف عمومي',
  1990,
  2,
  build_joradp_url(1990, 2, 'ar'),
  build_joradp_url(1990, 2, 'fr'),
  true,
  1990,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 6. Commune Law 11-10
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون البلدية',
  'Loi relative à la commune',
  '11-10',
  'إدارة محلية',
  2011,
  37,
  build_joradp_url(2011, 37, 'ar'),
  build_joradp_url(2011, 37, 'fr'),
  true,
  2011,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 7. Wilaya Law 12-07
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون الولاية',
  'Loi relative à la wilaya',
  '12-07',
  'إدارة محلية',
  2012,
  12,
  build_joradp_url(2012, 12, 'ar'),
  build_joradp_url(2012, 12, 'fr'),
  true,
  2012,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 8. Public Procurement Law 15-247
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون الصفقات العمومية وتفويضات المرفق العام',
  'Marchés publics et délégations de service public',
  '15-247',
  'صفقات عمومية',
  2015,
  50,
  build_joradp_url(2015, 50, 'ar'),
  build_joradp_url(2015, 50, 'fr'),
  true,
  2015,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 9. Procurement Amendment 23-316
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'تعديل قانون الصفقات العمومية 2023',
  'Modification des marchés publics 2023',
  '23-316',
  'صفقات عمومية',
  2023,
  68,
  build_joradp_url(2023, 68, 'ar'),
  build_joradp_url(2023, 68, 'fr'),
  true,
  2023,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 10. Prison Organization Law 05-04
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون تنظيم السجن وإعادة الإدماج الاجتماعي للمحبوسين',
  'Loi relative à l''organisation pénitentiaire',
  '05-04',
  'تنظيم إداري',
  2005,
  12,
  build_joradp_url(2005, 12, 'ar'),
  build_joradp_url(2005, 12, 'fr'),
  true,
  2005,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 11. Central Administration Decree 20-140
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'المرسوم التنفيذي المتعلق بتنظيم الإدارة المركزية',
  'Décret exécutif relatif à l''organisation de l''administration centrale',
  '20-140',
  'تنظيم إداري',
  2020,
  24,
  build_joradp_url(2020, 24, 'ar'),
  build_joradp_url(2020, 24, 'fr'),
  true,
  2020,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 12. Finance Law 84-17
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون المالية العامة',
  'Loi relative aux lois de finances',
  '84-17',
  'مالية عامة',
  1984,
  28,
  build_joradp_url(1984, 28, 'ar'),
  build_joradp_url(1984, 28, 'fr'),
  true,
  1984,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 13. Civil Code 75-58
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'القانون المدني',
  'Code civil',
  '75-58',
  'قوانين مرجعية',
  1975,
  78,
  build_joradp_url(1975, 78, 'ar'),
  build_joradp_url(1975, 78, 'fr'),
  true,
  1975,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 14. Penal Code 66-156
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون العقوبات',
  'Code pénal',
  '66-156',
  'قوانين مرجعية',
  1966,
  49,
  build_joradp_url(1966, 49, 'ar'),
  build_joradp_url(1966, 49, 'fr'),
  true,
  1966,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 15. Family Code 84-11
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون الأسرة',
  'Code de la famille',
  '84-11',
  'قوانين مرجعية',
  1984,
  24,
  build_joradp_url(1984, 24, 'ar'),
  build_joradp_url(1984, 24, 'fr'),
  true,
  1984,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- 16. Labor Code 90-11
INSERT INTO "Law" ("titleAr", "titleFr", "referenceNumber", "category", "jorfYear", "jorfNumber", "pdfUrlAr", "pdfUrlFr", "sourceVerified", "year", "isVerified")
VALUES (
  'قانون العمل',
  'Code du travail',
  '90-11',
  'قوانين مرجعية',
  1990,
  17,
  build_joradp_url(1990, 17, 'ar'),
  build_joradp_url(1990, 17, 'fr'),
  true,
  1990,
  true
)
ON CONFLICT ("referenceNumber") DO UPDATE SET
  "titleAr" = EXCLUDED."titleAr",
  "titleFr" = EXCLUDED."titleFr",
  "jorfYear" = EXCLUDED."jorfYear",
  "jorfNumber" = EXCLUDED."jorfNumber",
  "pdfUrlAr" = EXCLUDED."pdfUrlAr",
  "pdfUrlFr" = EXCLUDED."pdfUrlFr",
  "sourceVerified" = EXCLUDED."sourceVerified",
  "year" = EXCLUDED."year",
  "isVerified" = EXCLUDED."isVerified";

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================
SELECT 
  "referenceNumber",
  "titleAr",
  "jorfYear",
  "jorfNumber",
  "pdfUrlAr",
  "pdfUrlFr",
  "sourceVerified"
FROM "Law"
WHERE "sourceVerified" = true
ORDER BY "jorfYear", "jorfNumber";