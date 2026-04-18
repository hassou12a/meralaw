-- Enable UUID extension first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table with UUID
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    plan TEXT DEFAULT 'FREE',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Admin Account
INSERT INTO "User" (email, name, profession, plan, password)
VALUES ('admin@meralaw.dz', 'Prof. HOUSSEM MERAMRIA', 'avocat', 'PRO', '$2a$10$8VrN2kyouOJBuyjCu8lsuuNKFROBabFtp2pt7iHh279MdiTMHKF8y')
ON CONFLICT DO NOTHING;

-- Create Law table
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
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Add 10 Laws
INSERT INTO "Law" ("titleAr", "titleFr", "titleEn", "referenceNumber", "category", "year", "publicationDate", "journalOfficiel", "descriptionAr", "descriptionFr", "descriptionEn", "contentAr", "contentFr", "pdfUrlAr", "pdfUrlFr", "isVerified")
VALUES 
('الدستور الجزائري', 'Constitution algérienne', 'Algerian Constitution', '96-438', 'دستور', 1996, '1996-12-30', 'JORF 76/1996', 'دستور الجزائر', 'Constitution', 'Constitution', 'نص الدستور', 'La Constitution', 'https://www.joradp.dz/FTP/jo-arabe/1996/A1996076.pdf', 'https://www.joradp.dz/FTP/jo-francais/1996/F1996076.pdf', true),
('القانون المدني', 'Code civil', 'Civil Code', '75-58', 'قوانين مرجعية', 1975, '1975-06-20', 'JORF 78/1975', 'القانون المدني', 'Code civil', 'Civil Code', 'نص القانون المدني', 'Le Code civil', 'https://www.joradp.dz/FTP/jo-arabe/1975/A1975078.pdf', 'https://www.joradp.dz/FTP/jo-francais/1975/F1975078.pdf', true),
('قانون العقوبات', 'Code pénal', 'Penal Code', '66-156', 'قوانين مرجعية', 1966, '1966-06-28', 'JORF 49/1966', 'قانون العقوبات', 'Code pénal', 'Penal Code', 'نص القانون الجنائي', 'Le Code pénal', 'https://www.joradp.dz/FTP/jo-arabe/1966/A1966049.pdf', 'https://www.joradp.dz/FTP/jo-francais/1966/F1966049.pdf', true),
('قانون الأسرة', 'Code de la famille', 'Family Code', '84-11', 'قوانين مرجعية', 1984, '1984-06-09', 'JORF 24/1984', 'قانون الأسرة', 'Code de la famille', 'Family Code', 'نص قانون الأسرة', 'Le Code de la famille', 'https://www.joradp.dz/FTP/jo-arabe/1984/A1984024.pdf', 'https://www.joradp.dz/FTP/jo-francais/1984/F1984024.pdf', true),
('قانون العمل', 'Code du travail', 'Labor Code', '90-11', 'قوانين مرجعية', 1990, '1990-02-25', 'JORF 17/1990', 'قانون العمل', 'Code du travail', 'Labor Code', 'نص قانون العمل', 'Le Code du travail', 'https://www.joradp.dz/FTP/jo-arabe/1990/A1990017.pdf', 'https://www.joradp.dz/FTP/jo-francais/1990/F1990017.pdf', true),
('قانون البلدية', 'Loi sur la commune', 'Municipal Law', '11-10', 'إدارة محلية', 2011, '2011-02-21', 'JORF 37/2011', 'قانون البلدية', 'Loi sur la commune', 'Municipal Law', 'نص قانون البلدية', 'Loi sur la commune', 'https://www.joradp.dz/FTP/jo-arabe/2011/A2011037.pdf', 'https://www.joradp.dz/FTP/jo-francais/2011/F2011037.pdf', true),
('قانون الولاية', 'Loi sur la wilaya', 'Wilaya Law', '12-07', 'إدارة محلية', 2012, '2012-01-23', 'JORF 12/2012', 'قانون الولاية', 'Loi sur la wilaya', 'Wilaya Law', 'نص قانون الولاية', 'Loi sur la wilaya', 'https://www.joradp.dz/FTP/jo-arabe/2012/A2012012.pdf', 'https://www.joradp.dz/FTP/jo-francais/2012/F2012012.pdf', true),
('قانون الصفقات العمومية', 'Marchés publics', 'Public Procurement', '15-247', 'صفقات عمومية', 2015, '2015-09-20', 'JORF 50/2015', 'قانون الصفقات', 'Marchés publics', 'Public Procurement', 'نص قانون الصفقات', 'Marchés publics', 'https://www.joradp.dz/FTP/jo-arabe/2015/A2015050.pdf', 'https://www.joradp.dz/FTP/jo-francais/2015/F2015050.pdf', true),
('قانون الوظيف العمومي', 'Fonction publique', 'Public Service', '06-03', 'وظيف عمومي', 2006, '2006-02-15', 'JORF 46/2006', 'قانون الوظيفة', 'Fonction publique', 'Public Service', 'نص قانون الوظيفة', 'Fonction publique', 'https://www.joradp.dz/FTP/jo-arabe/2006/A2006046.pdf', 'https://www.joradp.dz/FTP/jo-francais/2006/F2006046.pdf', true),
('قانون الإجراءات المدنية', 'Code procédure civile', 'Civil Procedure', '08-09', 'إجراءات', 2008, '2008-03-04', 'JORF 21/2008', 'قانون الإجراءات', 'Code procédure civile', 'Civil Procedure', 'نص قانون الإجراءات', 'Code procédure civile', 'https://www.joradp.dz/FTP/jo-arabe/2008/A2008021.pdf', 'https://www.joradp.dz/FTP/jo-francais/2008/F2008021.pdf', true)
ON CONFLICT DO NOTHING;

-- Verify
SELECT 'Users: ' || COUNT(*) FROM "User"
UNION ALL
SELECT 'Laws: ' || COUNT(*) FROM "Law";