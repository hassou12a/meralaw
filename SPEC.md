# LexDZ - Algerian Legal Reference Platform

## 1. Project Overview

**Project Name**: LexDZ (Lexique Dzayer)
**Type**: Full-stack web application
**Target Users**: Algerian legal professionals (judges, bailiffs, notaries, lawyers, legal researchers, law students)
**Core Functionality**: Comprehensive legal reference platform with laws library, AI-powered legal assistant, and case management

## 2. Technology Stack & Choices

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Cairo (Arabic), Inter (Latin)

### Backend
- **Framework**: Next.js API Routes
- **Database**: Supabase (PostgreSQL) via Prisma ORM
- **Authentication**: NextAuth.js with credentials provider

### AI Integration
- **Provider**: Anthropic Claude API
- **Model**: claude-sonnet-4-20250514
- **Use Case**: Legal assistant for case analysis and law recommendations

### State Management
- **Client State**: React hooks + Context API
- **Server State**: React Query patterns with fetch
- **Persistence**: localStorage for preferences, DB for user data

## 3. Feature List

### Authentication & User Management
- [x] User registration with profession selection
- [x] User login with email/password
- [x] Password reset flow
- [x] User profile management
- [x] Subscription status tracking

### Free Tier Features
- [x] Laws library with 11 categories
- [x] Full-text search with filters
- [x] Law detail viewer
- [x] Latest updates section
- [x] Dark mode toggle

### Premium Tier Features
- [x] AI legal assistant chat
- [x] Case management system
- [x] Export to PDF
- [x] Save legal notes
- [x] Priority support badge

### Internationalization
- [x] Arabic (RTL) - default
- [x] French
- [x] English
- [x] Language switcher in navbar
- [x] localStorage persistence

## 4. UI/UX Design Direction

### Visual Style
- Professional, authoritative, clean design
- Inspired by legal document aesthetics
- Minimal clutter, maximum readability

### Color Scheme
- **Primary**: Deep Navy (#0D1B4B)
- **Accent**: Gold (#C9A84C)
- **Background**: White (#FFFFFF) / Dark (#0F172A)
- **Text**: Dark (#1E293B) / Light (#F8FAFC)

### Layout Approach
- Responsive mobile-first design
- Sidebar navigation on desktop
- Hamburger menu on mobile
- Card-based content presentation
- Consistent spacing and typography

### Typography
- Arabic: Cairo (Google Fonts)
- Latin: Inter (Google Fonts)
- Proper RTL/LTR handling

## 5. Database Schema

### Users
- id, email, password, name, profession, tier, createdAt

### Laws
- id, titleAr, titleFr, titleEn, category, referenceNumber, year
- publicationDate, journalOfficiel, descriptionAr, descriptionFr
- descriptionEn, contentAr, contentFr, isPremium, createdAt

### Cases
- id, userId, name, description, archived, createdAt

### CaseLaws
- id, caseId, lawId

### CaseNotes
- id, caseId, content, createdAt

### ChatMessages
- id, userId, caseId, role, content, createdAt

### Subscriptions
- id, userId, status, startDate, endDate

## 6. API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password

### Laws
- GET /api/laws
- GET /api/laws/:id
- GET /api/laws/search

### Cases
- GET /api/cases
- POST /api/cases
- PUT /api/cases/:id
- DELETE /api/cases/:id

### AI Assistant
- POST /api/assistant

### Subscription
- GET /api/subscription
- POST /api/subscription

## 7. Pages

1. `/` - Landing page
2. `/login` - Login page
3. `/register` - Registration page
4. `/forgot-password` - Password reset
5. `/laws` - Laws library
6. `/laws/:id` - Law detail
7. `/search` - Search results
8. `/assistant` - AI assistant
9. `/cases` - Case manager
10. `/pricing` - Pricing page
11. `/profile` - User profile
12. `/dashboard` - User dashboard
