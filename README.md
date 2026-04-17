# MeraLaw - المنصة القانونية الجزائرية

<div dir="rtl">

## مرحباً بكم في MeraLaw

MeraLaw هي منصة قانونية جزائرية شاملة للمهنيين القانونيين، تتضمن مكتبة قوانين متكاملة، مساعد ذكي مدعوم بالذكاء الاصطناعي، وإدارة الملفات القانونية.

صُنع بدقة بواسطة Prof. HOUSSEM ABDALLAH MERAMRIA

</div>

---

## 🇩🇿 Bienvenue sur MeraLaw

**MeraLaw** est une plateforme juridique algérienne complète pour les professionnels du droit, créée par Prof. HOUSSEM ABDALLAH MERAMRIA.

---

## 🚀 Getting Started | Démarrage | البدء

### Prerequisites | Prérequis | المتطلبات

- Node.js 18+
- npm or yarn
- **Supabase account** (PostgreSQL database)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Copy the connection string from **Settings > Database > Connection String**
4. Get your password from the database settings

### 2. Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/meralaw.git
cd meralaw

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Install & Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema to Supabase
npm run db:push

# Start development server
npm run dev
```

---

## 🔐 Supabase Database Setup

### Connection String Format

```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Find these values in Supabase:
- **Project Ref**: Settings > General > Project Reference ID
- **Password**: Settings > Database > Database password (or set a new one)

### Enable Database Extensions

In Supabase SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | JWT secret (min 32 chars) | ✅ |
| `ANTHROPIC_API_KEY` | Claude API key for AI assistant | ❌ |

---

## 📁 Project Structure

```
meralaw/
├── prisma/
│   ├── schema.prisma      # Database schema (PostgreSQL)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── login/        # Auth pages
│   │   ├── register/
│   │   ├── laws/         # Laws library
│   │   ├── insights/     # Legal Insights
│   │   ├── premium/      # Upgrade to PRO
│   │   ├── admin/        # Admin dashboard
│   │   ├── assistant/    # AI assistant
│   │   ├── cases/        # Case manager
│   │   ├── pricing/      # Pricing page
│   │   ├── dashboard/    # User dashboard
│   │   └── profile/      # User profile
│   ├── components/        # Reusable components
│   ├── context/          # React contexts
│   └── lib/              # Utilities
└── public/               # Static assets
```

---

## 🌍 Languages | Langues | اللغات

- **العربية (AR)** - RTL support
- **Français (FR)**
- **English (EN)**

Switch between languages using the navbar toggle.

---

## 💰 Subscription Plans

### Free (مجاني)
- المكتبة القانونية
- البحث المتقدم
- دستور الجزائر
- القانون المدني

### PRO (499 DZD/月)
- جميع ميزات Free
- المساعد الذكي (AI)
- إدارة الملفات
- تصدير الوثائق
- الملاحظات

---

## 🔒 Security

- Password hashing with bcrypt
- JWT sessions
- Protected API routes
- Role-based access control (Free/PRO)

---

## 📄 License

© 2026 MeraLaw - Created by Prof. HOUSSEM ABDALLAH MERAMRIA

---

<div dir="rtl">

## 🆘 الدعم

للدعم أو الاستفسارات: meralamria@dz

</div>

---

Made with ❤️ in Algeria 🇩🇿 by Prof. HOUSSEM ABDALLAH MERAMRIA
