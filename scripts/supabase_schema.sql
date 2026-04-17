-- MERAMRIA LEGAL SAAS - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor

-- Drop existing tables (if any)
DROP TABLE IF EXISTS "SearchLog" CASCADE;
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "ChatMessage" CASCADE;
DROP TABLE IF EXISTS "CaseNote" CASCADE;
DROP TABLE IF EXISTS "CaseLaw" CASCADE;
DROP TABLE IF EXISTS "Case" CASCADE;
DROP TABLE IF EXISTS "Law" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- USER TABLE
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    plan TEXT DEFAULT 'FREE',
    "subscriptionStartDate" TIMESTAMP,
    "subscriptionEndDate" TIMESTAMP,
    "isPaymentPending" BOOLEAN DEFAULT false,
    "paymentReceiptUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- LAW TABLE
CREATE TABLE IF NOT EXISTS "Law" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "titleAr" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT,
    category TEXT NOT NULL,
    "referenceNumber" TEXT UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    "publicationDate" TEXT,
    "journalOfficiel" TEXT,
    "descriptionAr" TEXT,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "contentAr" TEXT,
    "contentFr" TEXT,
    "isPremium" BOOLEAN DEFAULT false,
    "isVerified" BOOLEAN DEFAULT false,
    source TEXT,
    "pdfUrlAr" TEXT,
    "pdfUrlFr" TEXT,
    "jorfYear" INTEGER,
    "jorfNumber" INTEGER,
    tags TEXT[],
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS "idx_laws_search_ar" ON "Law" USING GIN (to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", '')));
CREATE INDEX IF NOT EXISTS "idx_laws_search_fr" ON "Law" USING GIN (to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", '')));

-- CASE TABLE
CREATE TABLE IF NOT EXISTS "Case" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    archived BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- CASE_LAW TABLE
CREATE TABLE IF NOT EXISTS "CaseLaw" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "caseId" UUID NOT NULL REFERENCES "Case"(id) ON DELETE CASCADE,
    "lawId" UUID NOT NULL REFERENCES "Law"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("caseId", "lawId")
);

-- CASE_NOTE TABLE
CREATE TABLE IF NOT EXISTS "CaseNote" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "caseId" UUID NOT NULL REFERENCES "Case"(id) ON DELETE CASCADE,
    content TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- CHAT_MESSAGE TABLE
CREATE TABLE IF NOT EXISTS "ChatMessage" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "caseId" UUID REFERENCES "Case"(id) ON DELETE SET NULL,
    role TEXT NOT NULL,
    content TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- SUBSCRIPTION TABLE
CREATE TABLE IF NOT EXISTS "Subscription" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'inactive',
    "startDate" TIMESTAMP,
    "endDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- SEARCH_LOG TABLE
CREATE TABLE IF NOT EXISTS "SearchLog" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT NOT NULL,
    "resultsCount" INTEGER,
    language TEXT,
    category TEXT,
    "userId" UUID,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- SEED 20 ALGERIAN LAWS
INSERT INTO "Law" ("titleAr", "titleFr", "titleEn", "category", "referenceNumber", "year", "publicationDate", "journalOfficiel", "descriptionAr", "descriptionFr", "descriptionEn", "contentAr", "contentFr", "isPremium", "isVerified", "source", "pdfUrlAr", "pdfUrlFr", "jorfYear", "jorfNumber", tags)
VALUES 
('الدستور الجزائري', 'Constitution algérienne', 'Algerian Constitution', 'دستور', '96-438', 1996, '30-12-1996', 'الجريدة الرسمية', 'دستور الجزائر国家级基本法', 'La Constitution de la République algérienne démocratie et populaire', 'Constitution of the Algerian Republic', 'نص الدستور الجزائري المعتمد عام 1996', 'La Constitution de la République algérienne démocratique et populaire', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1996/A1996076.pdf', 'https://www.joradp.dz/FTP/jo-francais/1996/F1996076.pdf', 1996, 76, ARRAY['دستور', 'أساسية', 'جزائر']),
('قانون الإجراءات المدنية', 'Code de procédure civile', 'Civil Procedure Code', 'إجراءات قضائية', '08-09', 2008, '04-03-2008', 'الجريدة الرسمية', 'قانون الإجراءات المدنية والإدارية', 'Code de procédures civiles et administratives', 'Civil and Administrative Procedure Code', 'أحكام الإجراءات المدنية والإدارية', 'Les règles de procédure civile et administrative', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2008/A2008021.pdf', 'https://www.joradp.dz/FTP/jo-francais/2008/F2008021.pdf', 2008, 21, ARRAY['إجراءات', 'مدني', 'إداري']),
('القانون الأساسي للوظيفة العمومية', 'Statut général de la fonction publique', 'Public Function Statute', 'وظيف عمومي', '06-03', 2006, '15-02-2006', 'الجريدة الرسمية', 'التنظيم القانوني للوظيفة العمومية', 'Statut général de la fonction publique', 'General Statute of Public Service', 'أحكام الوظيفة العمومية في الجزائر', 'Le statut général de la fonction publique', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2006/A2006046.pdf', 'https://www.joradp.dz/FTP/jo-francais/2006/F2006046.pdf', 2006, 46, ARRAY['وظيفة', 'عمومي', 'إداري']),
('قانون البلدية', 'Loi relative à la commune', 'Municipal Law', 'إدارة محلية', '11-10', 2011, '21-02-2011', 'الجريدة الرسمية', 'تنظيم البلديات', 'Loi relative à la commune et la wilaya', 'Law on Municipalities', 'أحكام التنظيم البلدي في الجزائر', 'Lorganisation et la gestion des communes', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2011/A2011037.pdf', 'https://www.joradp.dz/FTP/jo-francais/2011/F2011037.pdf', 2011, 37, ARRAY['بلدية', 'محلي', 'تنظيم']),
('قانون الولاية', 'Loi relative à la wilaya', 'Wilaya Law', 'إدارة محلية', '12-07', 2012, '23-01-2012', 'الجريدة الرسمية', 'تنظيم الولايات', 'Loi relative à la wilaya', 'Law on Wilayas', 'أحكام التنظيم الولائي', 'Lorganisation administrative des wilayas', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2012/A2012012.pdf', 'https://www.joradp.dz/FTP/jo-francais/2012/F2012012.pdf', 2012, 12, ARRAY['ولاية', 'محلي', 'تنظيم']),
('قانون الصفقات العمومية', 'Loi sur les marchés publics', 'Public Procurement Law', 'صفقات عمومية', '15-247', 2015, '20-09-2015', 'الجريدة الرسمية', 'تنظيم الصفقات العمومية', 'Loi sur les marchés publics', 'Public Procurement Law', 'أحكام الصفقات العمومية والمشتريات', 'Les règles des marchés publics', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2015/A2015050.pdf', 'https://www.joradp.dz/FTP/jo-francais/2015/F2015050.pdf', 2015, 50, ARRAY['صفقات', 'عمومي', 'مقاولات']),
('قانون تنظيم السجون', 'Organisation pénitentiaire', 'Prison Organization', 'تنظيم إداري', '05-04', 2005, '23-01-2005', 'الجريدة الرسمية', 'تنظيم المؤسسات الإصلاحية', 'Organisation pénitentiaire', 'Prison Organization', 'أحكام تنظيم السجون والمؤسسات الإصلاحية', 'Lorganisation des établissements pénitentiaires', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2005/A2005012.pdf', 'https://www.joradp.dz/FTP/jo-francais/2005/F2005012.pdf', 2005, 12, ARRAY['سجن', 'تنظيم', 'إصلاح']),
('القانون المدني', 'Code civil', 'Civil Code', 'قوانين مرجعية', '75-58', 1975, '20-06-1975', 'الجريدة الرسمية', 'القانون المدني الجزائري', 'Code civil algérien', 'Algerian Civil Code', 'أحكام القانون المدني', 'Le Code civil régissant les obligations', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1975/A1975078.pdf', 'https://www.joradp.dz/FTP/jo-francais/1975/F1975078.pdf', 1975, 78, ARRAY['مدني', 'التزامات', 'عقود']),
('قانون العقوبات', 'Code pénal', 'Penal Code', 'قوانين مرجعية', '66-156', 1966, '28-06-1966', 'الجريدة الرسمية', 'قانون العقوبات الجزائري', 'Code pénal algérien', 'Algerian Penal Code', 'أحكام القانون الجنائي', 'Le Code pénal définissant les infractions', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1966/A1966049.pdf', 'https://www.joradp.dz/FTP/jo-francais/1966/F1966049.pdf', 1966, 49, ARRAY['عقوبات', 'جريمة', 'جنائي']),
('قانون الأسرة', 'Code de la famille', 'Family Code', 'قوانين مرجعية', '84-11', 1984, '09-06-1984', 'الجريدة الرسمية', 'قانون الأسرة الجزائري', 'Code de la famille algérien', 'Algerian Family Code', 'أحكام قانون الأسرة والممير', 'Le Code de la famille (Moudawana)', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1984/A1984024.pdf', 'https://www.joradp.dz/FTP/jo-francais/1984/F1984024.pdf', 1984, 24, ARRAY['أسرة', 'زواج', 'طلاق']),
('قانون العمل', 'Code du travail', 'Labor Code', 'قوانين مرجعية', '90-11', 1990, '25-02-1990', 'الجريدة الرسمية', 'قانون العمل الجزائري', 'Code du travail algérien', 'Algerian Labor Code', 'أحكام قانون العمل والعمال', 'Le Code du travail régulation emploi', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1990/A1990017.pdf', 'https://www.joradp.dz/FTP/jo-francais/1990/F1990017.pdf', 1990, 17, ARRAY['عمل', 'صاحب عمل', 'عامل']),
('قانون الإجراءات الجزائية', 'Code de procédure pénale', 'Criminal Procedure Code', 'إجراءات قضائية', '95-11', 1995, '25-02-1995', 'الجريدة الرسمية', 'قانون الإجراءات الجزائية', 'Code de procédure pénale', 'Criminal Procedure Code', 'أحكام الإجراءات الجزائية', 'La procédure pénale', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1995/A1995016.pdf', 'https://www.joradp.dz/FTP/jo-francais/1995/F1995016.pdf', 1995, 16, ARRAY['جزائي', 'إجراءات', 'محاكمة']),
('قانون التجارة', 'Code de commerce', 'Commercial Code', 'قوانين مرجعية', '75-59', 1975, '30-06-1975', 'الجريدة الرسمية', 'قانون التجارة الجزائري', 'Code de commerce algérien', 'Algerian Commercial Code', 'أحكام القانون التجاري', 'Le Code de commerce', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1975/A1975061.pdf', 'https://www.joradp.dz/FTP/jo-francais/1975/F1975061.pdf', 1975, 61, ARRAY['تجارة', 'شركة', 'تجاري']),
('قانون الضرائب المباشرة', 'Loi sur les impôts directs', 'Direct Taxation Law', 'مالية', '84-20', 1984, '24-02-1984', 'الجريدة الرسمية', 'الضرائب المباشرة', 'Loi sur les impôts directs taxes', 'Direct Taxation Law', 'أحكام الضرائب المباشرة', 'Les règles de imposition directe', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1984/A1984016.pdf', 'https://www.joradp.dz/FTP/jo-francais/1984/F1984016.pdf', 1984, 16, ARRAY['ضريبة', 'جباية', 'دافع']),
('قانون النقد والقرض', 'Loi sur la monnaie et le crédit', 'Money and Credit Law', 'مالية', '90-10', 1990, '23-04-1990', 'الجريدة الرسمية', 'تنظيم النقد والقرض', 'Loi sur la monnaie et le crédit', 'Money and Credit Law', 'أحكام القانون النقدي والائتماني', 'La régulation du système financier', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1990/A1990030.pdf', 'https://www.joradp.dz/FTP/jo-francais/1990/F1990030.pdf', 1990, 30, ARRAY['نقد', 'قرض', 'بنك']),
('قانون حماية المستهلك', 'Loi sur la protection du consommateur', 'Consumer Protection Law', 'حماية', '89-02', 1989, '23-01-1989', 'الجريدة الرسمية', 'حماية المستهلك', 'Loi sur la protection du consommateur', 'Consumer Protection Law', 'أحكام حماية المستهلك', 'La protection des consommateurs', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1989/A1989008.pdf', 'https://www.joradp.dz/FTP/jo-francais/1989/F1989008.pdf', 1989, 8, ARRAY['مستهلك', 'حماية', 'تنافس']),
('قانون البيئة', 'Loi sur lenvironnement', 'Environment Law', 'تنظيم إداري', '03-03', 2003, '03-03-2003', 'الجريدة الرسمية', 'حماية البيئة', 'Loi sur la protection de lenvironnement', 'Environment Protection Law', 'أحكام حماية البيئة', 'La protection de lenvironnement', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/2003/A2003012.pdf', 'https://www.joradp.dz/FTP/jo-francais/2003/F2003012.pdf', 2003, 12, ARRAY['بيئة', 'حماية', 'تنظيم']),
('قانون التأمينات', 'Loi sur les assurances', 'Insurance Law', 'مالية', '95-07', 1995, '25-01-1995', 'الجريدة الرسمية', 'قانون التأمينات', 'Loi sur les assurances', 'Insurance Law', 'أحكام قانون التأمينات', 'La régulation des assurances', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1995/A1995006.pdf', 'https://www.joradp.dz/FTP/jo-francais/1995/F1995006.pdf', 1995, 6, ARRAY['تأمين', 'خطر', 'شركة']),
('قانون الجمارك', 'Code des douanes', 'Customs Code', 'مالية', '79-02', 1979, '01-01-1979', 'الجريدة الرسمية', 'قانون الجمارك', 'Code des douanes algérien', 'Algerian Customs Code', 'أحكام قانون الجمارك', 'Le Code des douanes', false, true, 'JORADP', 'https://www.joradp.dz/FTP/jo-arabe/1979/A1979002.pdf', 'https://www.joradp.dz/FTP/jo-francais/1979/F1979002.pdf', 1979, 2, ARRAY['جمارك', 'استيراد', 'تصدير'])
ON CONFLICT DO NOTHING;

-- Verify
SELECT 'Total Laws: ' || COUNT(*) as total FROM "Law";