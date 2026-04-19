-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    plan TEXT DEFAULT 'FREE'
);

-- Create Law table
CREATE TABLE IF NOT EXISTS "Law" (
    id TEXT PRIMARY KEY,
    "titleAr" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT,
    category TEXT NOT NULL,
    "referenceNumber" TEXT UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    "pdfUrlAr" TEXT,
    "pdfUrlFr" TEXT,
    "isVerified" BOOLEAN DEFAULT false
);

-- Insert Admin
INSERT INTO "User" (id, email, name, profession, plan, password) 
VALUES ('admin1', 'admin@meralaw.dz', 'Prof. MERAMRIA', 'avocat', 'PRO', '$2a$10$8VrN2kyouOJBuyjCu8lsuuNKFROBabFtp2pt7iHh279MdiTMHKF8y')
ON CONFLICT DO NOTHING;

-- Insert Laws
INSERT INTO "Law" (id, "titleAr", "titleFr", "titleEn", "referenceNumber", category, year, "pdfUrlAr", "pdfUrlFr", "isVerified") VALUES 
('1', 'الدستور الجزائري', 'Constitution', 'Constitution', '96-438', 'دستور', 1996, 'https://www.joradp.dz/FTP/jo-arabe/1996/A1996076.pdf', 'https://www.joradp.dz/FTP/jo-francais/1996/F1996076.pdf', true),
('2', 'القانون المدني', 'Code civil', 'Civil Code', '75-58', 'قانون', 1975, 'https://www.joradp.dz/FTP/jo-arabe/1975/A1975078.pdf', 'https://www.joradp.dz/FTP/jo-francais/1975/F1975078.pdf', true),
('3', 'قانون العقوبات', 'Code pénal', 'Penal Code', '66-156', 'قانون', 1966, 'https://www.joradp.dz/FTP/jo-arabe/1966/A1966049.pdf', 'https://www.joradp.dz/FTP/jo-francais/1966/F1966049.pdf', true),
('4', 'قانون الأسرة', 'Code famille', 'Family Code', '84-11', 'قانون', 1984, 'https://www.joradp.dz/FTP/jo-arabe/1984/A1984024.pdf', 'https://www.joradp.dz/FTP/jo-francais/1984/F1984024.pdf', true),
('5', 'قانون العمل', 'Code travail', 'Labor Code', '90-11', 'قانون', 1990, 'https://www.joradp.dz/FTP/jo-arabe/1990/A1990017.pdf', 'https://www.joradp.dz/FTP/jo-francais/1990/F1990017.pdf', true),
('6', 'قانون البلدية', 'Loi commune', 'Municipal Law', '11-10', 'بلدية', 2011, 'https://www.joradp.dz/FTP/jo-arabe/2011/A2011037.pdf', 'https://www.joradp.dz/FTP/jo-francais/2011/F2011037.pdf', true),
('7', 'قانون الولاية', 'Loi wilaya', 'Wilaya Law', '12-07', 'ولاية', 2012, 'https://www.joradp.dz/FTP/jo-arabe/2012/A2012012.pdf', 'https://www.joradp.dz/FTP/jo-francais/2012/F2012012.pdf', true),
('8', 'قانون الصفقات', 'Marchés publics', 'Public Procurement', '15-247', 'صفقات', 2015, 'https://www.joradp.dz/FTP/jo-arabe/2015/A2015050.pdf', 'https://www.joradp.dz/FTP/jo-francais/2015/F2015050.pdf', true),
('9', 'قانون الوظيفة', 'Fonction publique', 'Public Service', '06-03', 'وظيفة', 2006, 'https://www.joradp.dz/FTP/jo-arabe/2006/A2006046.pdf', 'https://www.joradp.dz/FTP/jo-francais/2006/F2006046.pdf', true),
('10', 'قانون الإجراءات', 'Code procédure', 'Civil Procedure', '08-09', 'إجراءات', 2008, 'https://www.joradp.dz/FTP/jo-arabe/2008/A2008021.pdf', 'https://www.joradp.dz/FTP/jo-francais/2008/F2008021.pdf', true)
ON CONFLICT DO NOTHING;

SELECT 'Users: ' || (SELECT COUNT(*) FROM "User") as users, 'Laws: ' || (SELECT COUNT(*) FROM "Law") as laws;