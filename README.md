# FileForge AI — Creative File Studio

> **High-Velocity Universal Compression, Conversion, Optimization, and Content Provenance**  
> Inspired by the anime animation mechanics of the open-source [Sakuga VFX](https://github.com/finktheartist/sakuga-vfx) project.

---

## ⚡ Highlights

- **Dark Creative Studio Theme**: Bold obsidian backdrop (`#0a0a0f`), white paper-like cards, electric violet/lavender accents (`#8b5cf6`), and pink highlights (`#ec4899`).
- **Sakuga Anime VFX Controls**: Animated squash-and-stretch buttons, teardrop stretching sliders, charging plasma progress bars, smear-frame toggles, and crescent checkboxes.
- **Universal File Support**: Central file-type registry supporting 12 categories and 100+ extensions (Documents, Spreadsheets, Presentations, Images, Video, Audio, Code, Archives, Executables, Databases, Fonts, 3D/CAD).
- **Interactive Formats Explorer**: Full-page interactive directory to inspect conversions, loss warnings, risk levels, and processor requirements for every file type.
- **VFX Studio Playground**: Live on-page testbed for all Sakuga components and compression sliders.
- **Compliance-Centric AI Transparency**: C2PA provenance scanning and verified-owner watermark removal with immutable audit logging.
- **Generous Free Tier**: Up to 2 GB uploads with 24-hour auto-shredding and zero watermarks added to outputs.
- **Cross-Platform**: Modern Next.js 14+ App Router web application + React Native Expo mobile application.

---

## 📂 Project Structure

```
Fileforge AI/
├── apps/
│   ├── web/                          # Next.js 14+ App Router Web Application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx        # Global Layout, Fonts, SEO Metadata & Toaster
│   │   │   │   ├── page.tsx          # Cinematic Landing Page & VFX Playground
│   │   │   │   ├── globals.css       # Design System Variables & Keyframes
│   │   │   │   ├── formats/page.tsx  # Full Supported Formats Explorer Page
│   │   │   │   └── api/              # REST Route Handlers
│   │   │   │       ├── health/       # Health Status & Telemetry
│   │   │   │       ├── formats/      # Format Registry Querying
│   │   │   │       │   └── [extension]/
│   │   │   │       ├── plans/        # Subscription Plans & Limits
│   │   │   │       ├── stats/        # Aggregated Platform Metrics
│   │   │   │       └── auth/[...nextauth]/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Sakuga VFX Animated Components
│   │   │   │   │   ├── sakuga-button.tsx
│   │   │   │   │   ├── sakuga-slider.tsx
│   │   │   │   │   ├── sakuga-progress.tsx
│   │   │   │   │   ├── sakuga-toggle.tsx
│   │   │   │   │   ├── sakuga-checkbox.tsx
│   │   │   │   │   ├── sakuga-input.tsx
│   │   │   │   │   ├── sakuga-toast.tsx
│   │   │   │   │   ├── sakuga-tooltip.tsx
│   │   │   │   │   └── scroll-reveal.tsx
│   │   │   │   ├── landing/          # Studio Landing Sections
│   │   │   │   │   ├── hero-section.tsx
│   │   │   │   │   ├── vfx-playground.tsx
│   │   │   │   │   ├── features-section.tsx
│   │   │   │   │   ├── formats-preview-section.tsx
│   │   │   │   │   ├── how-it-works-section.tsx
│   │   │   │   │   ├── testimonials-section.tsx
│   │   │   │   │   ├── pricing-section.tsx
│   │   │   │   │   ├── faq-section.tsx
│   │   │   │   │   └── cta-section.tsx
│   │   │   │   ├── formats/          # Format Explorer Component
│   │   │   │   │   └── format-explorer.tsx
│   │   │   │   └── layout/           # Shell Layout Components
│   │   │   │       ├── navbar.tsx
│   │   │   │       ├── footer.tsx
│   │   │   │       └── command-palette.tsx
│   │   │   └── lib/
│   │   │       ├── hooks/            # useReducedMotion, useInView, useBreakpoint
│   │   │       └── utils/            # cn, formatters
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── mobile/                       # React Native Expo Mobile Application
│   │   ├── app/
│   │   │   ├── _layout.tsx           # Expo Router Root Stack
│   │   │   ├── index.tsx             # Mobile Home & File Pickers
│   │   │   ├── formats.tsx           # Mobile Formats Explorer
│   │   │   └── studio.tsx            # Mobile Compression & Tuning Screen
│   │   ├── src/
│   │   │   ├── components/           # Mobile Sakuga Components (Reanimated)
│   │   │   ├── theme/                # Mobile Theme Constants
│   │   │   └── api/client.ts         # Mobile API Client
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── worker/                       # Node.js Processing Worker Service
│       ├── src/
│       │   ├── processors/           # Sharp, FFmpeg, LibreOffice, 7-Zip
│       │   ├── queues/               # BullMQ Redis Queue Setup
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── shared/                       # Shared Types, Zod Schemas & Constants
│   │   ├── src/
│   │   │   ├── types/                # format, job, user, api types
│   │   │   ├── schemas/              # Zod input schemas
│   │   │   ├── constants/            # Plans and limits
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── database/                     # PostgreSQL Database & Prisma ORM
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Models (User, File, Job, Conversion, etc.)
│   │   │   └── seed.ts               # Plans, Demo Users, Sample Assets
│   │   ├── src/client.ts             # Prisma Client Singleton
│   │   └── package.json
│   │
│   └── file-registry/                # Universal File Format Registry
│       ├── src/
│       │   ├── categories.ts         # 12 Category Definitions & Badges
│       │   ├── formats.ts            # 100+ File Definitions with Metadata
│       │   ├── registry.ts           # Search, Validate & Estimate Services
│       │   └── index.ts
│       └── package.json
│
├── docs/
│   ├── API.md                        # REST API Specification
│   ├── ARCHITECTURE.md               # Infrastructure & Pipeline Blueprint
│   └── SAKUGA_DESIGN_SYSTEM.md       # Interaction & Animation Standards
│
├── .env.example                      # Complete Environment Variable Template
├── package.json                      # Workspace Root Package Configuration
└── tsconfig.json                     # Monorepo TypeScript Base Configuration
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9+ (npm workspaces enabled)
- **Git**

### 2. Setup Environment
```bash
# Clone the repository
git clone https://github.com/your-org/fileforge-ai.git
cd "Fileforge AI"

# Copy environment template
cp .env.example .env
```

### 3. Install Dependencies & Build Packages
```bash
# Install all monorepo dependencies
npm install

# Build web application
npm run build:web
```

### 4. Run Development Servers
```bash
# Launch Next.js Web App on http://localhost:3000
npm run dev:web

# Launch Mobile App with Expo
cd apps/mobile
npm start
```

---

## 🗄️ Database Setup (PostgreSQL with Prisma)

```bash
# Push schema to PostgreSQL database
npm run db:push --workspace=packages/database

# Seed subscription plans and initial format data
npm run db:seed --workspace=packages/database
```

---

## 🧪 Phase 1 Verification Checklist

- [x] **Monorepo Structure**: `apps/web`, `apps/mobile`, `apps/worker`, `packages/shared`, `packages/database`, `packages/file-registry`.
- [x] **Zero Build Errors**: `npm run build:web` completes with 0 errors and 0 warnings.
- [x] **Type Safety**: Full TypeScript type check (`tsc --noEmit`) passes with 0 errors.
- [x] **File Registry**: Covers all 12 categories and 100+ extensions with risk levels and conversion rules.
- [x] **Sakuga Components**:
  - [x] `<SakugaButton>`: Squash-and-stretch on click with single-frame impact burst and success check.
  - [x] `<SakugaSlider>`: Dynamic teardrop stretching thumb with velocity lag and floating label.
  - [x] `<SakugaProgress>`: Plasma charging shimmer effect with completion bounce.
  - [x] `<SakugaToggle>`: Smear knob animation with liquid splash track border.
  - [x] `<SakugaCheckbox>`: Animated SVG checkmark path drawing.
  - [x] `<SakugaTabs>`: Smooth sliding pill layout indicator across categories.
  - [x] `<SakugaInput>`: Electric glow border focus and floating label.
  - [x] `<SakugaToast>`: Custom styled notification toasts with burst animations.
- [x] **Accessibility**: Respects `prefers-reduced-motion` to bypass heavy distortions.
- [x] **Interactive Explorer**: Live search, category filtering, conversion targets, and loss warnings at `/formats`.
- [x] **REST API Endpoints**: `/api/health`, `/api/formats`, `/api/formats/[extension]`, `/api/plans`, `/api/stats`, `/api/auth/[...nextauth]`.

---

## 🌐 Production Deployment Guide

### Web (Vercel / Cloudflare Pages)
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: See `.env.example`

### Storage & Workers
- **Database**: Supabase or Neon Serverless PostgreSQL (`DATABASE_URL`, `DIRECT_URL`)
- **Storage**: Cloudflare R2 or AWS S3 (`S3_ENDPOINT`, `S3_BUCKET_NAME`)
- **Queue Worker**: Deploy `apps/worker` to Railway, Render, or Fly.io with Docker (`FFmpeg`, `Sharp`, `LibreOffice`, `Ghostscript`, `p7zip`).

---

## 🗺️ Roadmap & Phase 2 Transition

Now that Phase 1 foundation, design system, file registry, and architecture are complete, **Phase 2** will introduce:
1. Direct file upload pipelines with chunked multipart uploads to Cloudflare R2 / S3.
2. FFmpeg, Sharp, and LibreOffice background worker implementation in `apps/worker`.
3. Real-time WebSocket / SSE job status streaming with live progress bars.
4. Side-by-side interactive before/after visual preview comparison.
5. In-browser client-side WebAssembly compression for images and plain text.
