# MeraLaw - Deployment Guide

## Quick Deploy to Vercel

```bash
cd lex-dz
npx vercel login
npx vercel --prod
```

## Manual Deploy

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `DATABASE_URL` - Supabase PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel deployment URL
4. Deploy!

## Database Setup

1. Run Prisma migrations:
```bash
npx prisma migrate deploy
```

2. Seed initial laws (optional):
```bash
# Upload laws_seed.json via /api/seed endpoint
```

## Features

- Legal Library with 20+ Algerian laws
- Full-text search (Arabic/French)
- FREE/PRO subscription system
- Baridimob payment (RIP: 00799999001746456591)
- Admin dashboard: /admin
- PWA support

## Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

---

**MeraLaw** © 2026 by Prof. HOUSSEM ABDALLAH MERAMRIA