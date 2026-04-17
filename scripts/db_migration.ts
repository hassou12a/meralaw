import { prisma } from '../src/lib/db';

async function main() {
  console.log('Running database migration...');

  console.log('1. Enabling pg_trgm extension...');
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

  console.log('2. Adding search columns to Law table...');
  await prisma.$executeRaw`
    ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false
  `.catch(() => {});

  await prisma.$executeRaw`
    ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "source" TEXT
  `.catch(() => {});

  await prisma.$executeRaw`
    ALTER TABLE "Law" ADD COLUMN IF NOT EXISTS "tags" TEXT[]
  `.catch(() => {});

  console.log('3. Creating GIN indexes for full-text search...');
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "idx_laws_search_ar"
    ON "Law" USING GIN (to_tsvector('arabic', COALESCE("titleAr", '') || ' ' || COALESCE("contentAr", '')))
  `.catch(() => {});

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "idx_laws_search_fr"
    ON "Law" USING GIN (to_tsvector('french', COALESCE("titleFr", '') || ' ' || COALESCE("contentFr", '')))
  `.catch(() => {});

  console.log('4. Creating trigram indexes for similarity search...');
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "idx_laws_trgm_ar"
    ON "Law" USING GIN ("titleAr" gin_trgm_ops)
  `.catch(() => {});

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "idx_laws_trgm_fr"
    ON "Law" USING GIN ("titleFr" gin_trgm_ops)
  `.catch(() => {});

  console.log('5. Creating SearchLog table...');
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "SearchLog" (
      "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "query" TEXT NOT NULL,
      "resultsCount" INTEGER NOT NULL,
      "language" TEXT,
      "category" TEXT,
      "userId" TEXT,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `.catch(() => {});

  console.log('6. Verifying laws in database...');
  const lawCount = await prisma.law.count();
  console.log(`   Total laws: ${lawCount}`);

  const categories = await prisma.$queryRaw<{ category: string; count: bigint }[]>`
    SELECT "category", COUNT(*)::bigint as count
    FROM "Law"
    GROUP BY "category"
    ORDER BY "category"
  `;

  console.log('\n   Laws by category:');
  for (const row of categories) {
    console.log(`   - ${row.category}: ${row.count}`);
  }

  console.log('\n✅ Migration complete!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });