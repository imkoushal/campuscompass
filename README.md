# 🎓 CampusCompass — College Discovery Platform

A production-grade college discovery and decision-making platform built with **Next.js 14**, **Prisma**, **Neon PostgreSQL**, and **TailwindCSS v4**.

> **Track B — College Discovery Platform** | Full-Stack Developer Internship Submission

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript) ![Prisma](https://img.shields.io/badge/Prisma-6.0+-2D3748?logo=prisma) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss)

---

## 🚀 Features Implemented (4 of 6)

### 1. 🔍 College Listing + Search
- **Advanced multi-filter support** — Filter by state, institute type (IIT/NIT/IIIT/Private/State), and minimum rating
- **Real-time search** — Debounced search across name, city, and state
- **Sorting** — By rating (high/low), name (A-Z/Z-A), and established year
- **Pagination** — Server-side pagination with 6 colleges per page
- **Campus images** — Real campus photos for each college

### 2. 📄 College Detail Page
- **Overview** — Description, establishment year, affiliation, campus size, B.Tech fees
- **Courses** — Full course listing with degree, duration, fees, seats, and eligibility
- **Placements 2024** — Avg/Highest/Median package, placement %, top recruiters
- **Reviews** — User reviews with star ratings (authenticated)
- **Quick Stats sidebar** — Rating, NIRF rank, QS rank, avg package
- **Save/Bookmark button** — Save colleges to your dashboard
- **SEO optimized** — Dynamic meta tags, Open Graph, JSON-LD structured data

### 3. ⚖️ Compare Colleges
- **Side-by-side comparison** for up to 3 colleges
- **Search and select** colleges from the database
- **Intelligent highlight badges:**
  - 🏷️ `BEST VALUE` — Lowest tuition fees
  - ⭐ `TOP RATED` — Highest rating
  - 📊 `HIGH AVG` — Highest average package
  - 🎯 `TOP PLACED` — Best placement percentage
- **Key courses and location comparison**

### 4. 🔐 Authentication + Saved Items
- **Credentials auth** — Email/password with bcrypt hashing
- **Google OAuth** — One-click social login
- **JWT sessions** — Secure session management
- **Saved colleges dashboard** — Quick stats, remove functionality
- **Quick Compare** — Compare directly from saved colleges
- **Protected routes** — Middleware-based auth enforcement

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS v4 |
| **Database** | PostgreSQL (Neon Serverless) |
| **ORM** | Prisma 6 |
| **Authentication** | NextAuth.js (JWT) |
| **Deployment** | Vercel / Render |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended — free tier)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/campuscompass.git
cd campuscompass

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and auth secrets

# 4. Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# 5. Seed the database with 21 colleges
npx tsx prisma/seed.ts

# 6. Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page (SSR)
│   ├── colleges/
│   │   ├── page.tsx                # College listing (CSR + API)
│   │   └── [slug]/page.tsx         # College detail (SSR + SEO)
│   ├── compare/page.tsx            # Comparison engine (CSR)
│   ├── saved/page.tsx              # User dashboard (CSR + Auth)
│   ├── login/page.tsx              # Authentication
│   ├── register/page.tsx           # Registration
│   ├── not-found.tsx               # Custom 404
│   ├── error.tsx                   # Global error boundary
│   └── api/
│       ├── auth/                   # NextAuth routes
│       ├── colleges/               # College CRUD APIs
│       ├── compare/                # Comparison API
│       └── saved/                  # Saved items API
├── components/
│   ├── layout/                     # Navbar, Footer
│   ├── colleges/                   # SaveButton
│   └── ui/                         # Toast notifications
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   └── auth.ts                     # NextAuth configuration
└── middleware.ts                   # Auth middleware
```

### Design Decisions

- **Server Components** for data-heavy pages (Home, Detail) — maximizes SEO and minimizes client JS
- **Client Components** for interactive pages (Listing, Compare, Saved) — enables real-time filtering
- **API Routes** for all data mutations — clean separation of concerns
- **JSON fields in Prisma** for flexible data (fees, rankings, highlights) — avoids schema rigidity
- **Glassmorphic dark theme** — Premium, modern aesthetic using Material Design 3 color tokens

### Comparison Engine Logic

The comparison engine uses a **highlight badge system** that dynamically identifies the best-performing college in each metric:

1. **BEST VALUE** → College with the lowest B.Tech tuition fees
2. **TOP RATED** → College with the highest student rating
3. **HIGH AVG** → College with the highest average placement package
4. **TOP PLACED** → College with the highest placement percentage

Badges only appear when there's a meaningful difference between compared values.

---

## 🗄️ Database Schema

- **21 Indian colleges** — IITs, NITs, IIITs, Private, State universities
- **126 courses** — B.Tech, M.Tech, MBA across all colleges
- **21 placement records** — 2024 data with avg/highest/median packages
- **User authentication** — Credentials + OAuth accounts

---

## 🎨 UI/UX Highlights

- **Dark glassmorphic design** — Premium feel with `backdrop-blur`, gradient borders
- **Responsive layout** — Mobile-first with breakpoints at md (768px) and lg (1024px)
- **Loading skeletons** — Pulse animations during data fetching
- **Toast notifications** — Success/error/info toasts for user actions
- **Hover micro-animations** — Scale transforms, color transitions on cards
- **Custom 404/500 pages** — Branded error states with navigation
- **Floating card animations** — CSS keyframe animations on the landing page

---

## 📝 API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/colleges` | GET | List colleges with filters, sort, pagination |
| `/api/colleges/[slug]` | GET | Get college by slug with courses & placements |
| `/api/colleges/filters` | GET | Get available filter options (states, types) |
| `/api/compare?ids=id1,id2` | GET | Get comparison data for selected colleges |
| `/api/saved/colleges` | GET | Get user's saved colleges (auth required) |
| `/api/saved/colleges` | POST | Toggle save/unsave a college (auth required) |
| `/api/auth/register` | POST | Register new user with email/password |

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Render
```bash
# Build command
npx prisma generate && npx prisma db push && npm run build

# Start command
npm start
```

---

## 📄 License

This project was built as part of a full-stack developer internship application.
