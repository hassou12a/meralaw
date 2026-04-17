import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface Article {
  number: string;
  title: string;
  content_ar: string;
  content_fr: string;
}

interface LawSeed {
  id: number;
  title_ar: string;
  title_fr: string;
  reference_number: string;
  law_type: string;
  year: number;
  jorf_issue_number: number;
  date_published: string;
  date_amended?: string;
  amendment_reference?: string;
  full_text_ar: string;
  full_text_fr: string;
  category: string;
  articles: Article[];
}

interface SeedData {
  laws: LawSeed[];
}

function buildSearchContent(law: LawSeed): string {
  const articlesText = law.articles
    .map((a) => `${a.title} ${a.content_ar} ${a.content_fr}`)
    .join(' ');
  return `${law.title_ar} ${law.title_fr} ${law.reference_number} ${articlesText}`;
}

async function seedLaws() {
  console.log('🌱 Starting seed...');

  const seedFile = path.join(__dirname, '../scripts/data/laws_seed.json');
  const data: SeedData = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));

  console.log(`📚 Found ${data.laws.length} laws to seed`);

  let created = 0;
  let updated = 0;

  for (const law of data.laws) {
    try {
      const searchContent = buildSearchContent(law);
      
      const lawData = {
        titleAr: law.title_ar,
        titleFr: law.title_fr,
        titleEn: law.title_fr,
        referenceNumber: law.reference_number,
        category: law.category,
        year: law.year,
        publicationDate: law.date_published,
        journalOfficiel: `JORF ${law.jorf_issue_number}/${law.year}`,
        descriptionAr: `${law.title_ar} - ${law.law_type}`,
        descriptionFr: `${law.title_fr} - ${law.law_type}`,
        descriptionEn: `${law.title_fr} - ${law.law_type}`,
        contentAr: law.full_text_ar || searchContent,
        contentFr: law.full_text_fr || searchContent,
        isPremium: false,
        isVerified: true,
        source: 'joradp.dz',
        tags: [law.category, law.law_type],
      };

      const existing = await prisma.law.findUnique({
        where: { referenceNumber: law.reference_number },
      });

      if (existing) {
        await prisma.law.update({
          where: { referenceNumber: law.reference_number },
          data: lawData,
        });
        updated++;
        console.log(`  🔄 Updated: ${law.reference_number}`);
      } else {
        await prisma.law.create({
          data: lawData,
        });
        created++;
        console.log(`  ✅ Created: ${law.reference_number}`);
      }
    } catch (error) {
      console.error(`  ❌ Error with ${law.reference_number}:`, error);
    }
  }

  console.log(`\n📊 Seed complete: ${created} created, ${updated} updated`);

  const total = await prisma.law.count();
  console.log(`📈 Total laws in database: ${total}`);

  return { created, updated, total };
}

async function main() {
  try {
    await seedLaws();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();