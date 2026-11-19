# FileForge AI — Universal File Processing Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square&logo=github)](https://github.com/Itzjay169/FileForge-AI)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo-51-white?style=flat-square&logo=expo)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

> An anime-inspired, high-throughput SaaS media processing studio built with the **Sakuga VFX Design System**. Engineered for lossless compression, universal conversions across 100+ formats, interactive raster/PDF manipulation, cryptographic provenance verification, and cross-platform mobile intake.

---

## 🌟 Feature Highlights (Phases 1 — 7)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FILEFORGE AI ECOSYSTEM                          │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Foundations & Sakuga Design    │ 5. AI Provenance & Watermarks      │
│    • Dark anime aesthetic         │    • EXIF & IPTC metadata inspector│
│    • 100+ file format registry    │    • C2PA Content Credentials      │
│    • Spring physics animations    │    • Verified ownership removal    │
├───────────────────────────────────┼────────────────────────────────────┤
│ 2. Smart Upload & Compression     │ 6. Accounts, Workspaces & Mobile   │
│    • Zero-trust SSRF firewall     │    • Multi-seat workspaces (RBAC)  │
│    • Malware magic-byte scanning  │    • Expiring QR code share links  │
│    • Smart target size prediction │    • React Native Expo mobile app  │
├───────────────────────────────────┼────────────────────────────────────┤
│ 3. Universal Conversion Engine    │ 7. Monetization, Admin & Launch    │
│    • Format matrix router         │    • Stripe / Razorpay subs & packs│
│    • Sharp / FFmpeg / LibO pipes  │    • Full Admin Command Center     │
│    • Lossless & lossy diagnostics │    • SEO, legal, status & E2E tests│
├───────────────────────────────────┴────────────────────────────────────┤
│ 4. Creative Studio & AI File Assistant                                 │
│    • Interactive image cropping, filters, and neural background removal│
│    • PDF page reordering, merging, OCR, and compression               │
│    • Conversational assistant with explicit user confirmation gates    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Monorepo Architecture

FileForge AI is structured as a high-performance Turborepo monorepo:

```
FileForge AI/
├── apps/
│   ├── web/                     # Next.js 16 Web Application (App Router, Turbopack)
│   │   ├── src/app/             # 44+ API routes, UI pages, and legal portals
│   │   ├── src/components/      # Sakuga UI components & Framer Motion controls
│   │   └── src/lib/server/      # Core engines (Billing, Admin, Store, Transcoding)
│   └── mobile/                  # React Native Expo Mobile Application (Expo Router)
│       ├── app/                 # Mobile file-based screens (Studio, Convert, Library)
│       └── src/context/         # Auth, Biometric lock, and Background queue providers
├── packages/
│   ├── shared/                  # Universal TypeScript library
│   │   ├── src/types/           # Format, job, billing, admin, account data contracts
│   │   ├── src/schemas/         # Zod runtime validation schemas
│   │   ├── src/tokens/          # SakugaTheme design system tokens
│   │   └── src/client/          # Shared FileForgeClient API SDK
│   ├── file-registry/           # 100+ MIME types, category maps, and matrix routes
│   └── database/                # Relational schema and ledger definitions
├── DEPLOYMENT.md                # Full production deployment manual (Vercel, Docker, R2)
└── LAUNCH-CHECKLIST.md          # Comprehensive launch checklist (WCAG, Security, SEO)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 20+
- npm 10+ or pnpm 9+

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Itzjay169/FileForge-AI.git
cd "FileForge-AI"

# Install all monorepo dependencies
npm install
```

### 3. Run Automated Test Suites
Run the automated test runners across all engine layers:
```bash
# Run Phase 2 through Phase 7 test suites
cd apps/web
npx tsx src/lib/server/__tests__/phase2.test.ts  # Upload, SSRF, & Compression
npx tsx src/lib/server/__tests__/phase3.test.ts  # Universal Conversion Matrix
npx tsx src/lib/server/__tests__/phase4.test.ts  # Editor, PDF Studio & AI Assistant
npx tsx src/lib/server/__tests__/phase5.test.ts  # AI Transparency & Watermarks
npx tsx src/lib/server/__tests__/phase6.test.ts  # Workspaces, Sharing & Library
npx tsx src/lib/server/__tests__/phase7.test.ts  # Billing, Admin & Quotas
```

### 4. Start Development Servers
```bash
# Start Next.js web application
npm run dev --workspace=apps/web

# Start Expo mobile application
npm run dev --workspace=apps/mobile
```

Open [http://localhost:3000](http://localhost:3000) to view the web studio.

---

## 🚀 Key Web Application Routes

| Path | Purpose |
|---|---|
| `/studio` | Core interactive drag-and-drop compression and upload studio |
| `/convert` | Universal format transformation matrix and batch pipeline |
| `/editor` | Image manipulation, PDF Studio, and AI conversational file assistant |
| `/transparency` | EXIF metadata scanner, C2PA provenance inspector, and watermarking |
| `/dashboard` | User asset library, storage meter, folder organizer, and share links |
| `/pricing` | Tier comparison (Free, Pro, Studio Team, Enterprise) and credit packs |
| `/admin/dashboard` | Cluster operations hub, user ban gates, jobs queue, and feature flags |
| `/status` | Real-time global infrastructure health and edge latency monitor |
| `/faq` & `/help` | Comprehensive user documentation and expandable accordion answers |
| `/contact` | Customer support ticket submission with SLA routing |
| `/changelog` | Release timeline and version changelog |
| `/blog` | In-depth engineering, codec, and architecture journal |
| `/legal/*` | Terms of Service, Privacy Policy, Refund Policy, and Acceptable Use |

---

## 🔒 Security & Compliance Principles

1. **SSRF Guard**: Strict rejection of private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`, `169.254.169.254`).
2. **Binary Header Scanner**: Pre-flight inspection flags disguised executables (MZ, ELF) and embedded malicious SVG scripts.
3. **Zero-Retention Ephemeral Storage**: Free uploads shredded after 24 hours.
4. **Verified Copyright Workflow**: Strict 2-step audit trails before initiating watermark removal.
5. **C2PA Credentials**: Active support for cryptographic content authenticity manifests.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

Crafted with high-octane engineering by **[FileForge AI Team](https://github.com/Itzjay169/FileForge-AI)**.
