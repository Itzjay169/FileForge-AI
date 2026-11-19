# FileForge AI — Production Deployment Guide

This guide documents the enterprise deployment architecture, environmental configuration, worker cluster provisioning, and backup strategies for launching FileForge AI into production.

---

## 1. System Architecture Overview

```
                               ┌─────────────────────────┐
                               │     Global Cloudflare    │
                               │   CDN / DDoS / SSL Edge │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │   Next.js 16 Edge / SSR │
                               │     (Vercel / Node)     │
                               └──────┬───────────┬──────┘
                                      │           │
                       API & Workspaces           Dispatched Jobs
                                      ▼           ▼
                      ┌──────────────────┐   ┌───────────────────────────┐
                      │ PostgreSQL (RDS) │   │ Redis / BullMQ Queue Pool │
                      │  Prisma / Ledger │   └─────────────┬─────────────┘
                      └──────────────────┘                 │
                                                           ▼
                      ┌──────────────────┐   ┌───────────────────────────┐
                      │ S3 / Cloudflare  │   │ Dedicated Transcoder Pods │
                      │  R2 Storage Bucket◄──┤ Sharp / FFmpeg / LibO     │
                      └──────────────────┘   └───────────────────────────┘
```

---

## 2. Infrastructure Prerequisites

| Component | Minimum Specification | Recommended Production Provider |
|---|---|---|
| **Web Server (Next.js)** | 2 vCPU, 4GB RAM (or Serverless) | Vercel Enterprise / AWS ECS |
| **Relational Database** | PostgreSQL 16 (Multi-AZ) | AWS Aurora Serverless v2 / Supabase |
| **Job Queue & Cache** | Redis 7.2 (Cluster mode) | Upstash Redis / AWS ElastiCache |
| **Object Storage** | S3-Compatible, CORS & Presigned URLs | Cloudflare R2 / AWS S3 Standard |
| **Worker Cluster** | 8+ vCPU, 16GB RAM, AVX2 Support | Railway / AWS ECS Fargate / Hetzner Bare Metal |
| **SSL & Edge** | TLS 1.3, HSTS Preload | Cloudflare Enterprise |

---

## 3. Environment Variables Reference

Configure these environmental keys in your Vercel project settings and worker containers:

### Web Application (`apps/web/.env.production`)

```ini
# Application URLs
NEXT_PUBLIC_APP_URL=https://fileforge.ai
NEXT_PUBLIC_API_URL=https://fileforge.ai/api

# Authentication & Session Security
NEXTAUTH_URL=https://fileforge.ai
NEXTAUTH_SECRET=super_secret_64_character_hex_key_here
JWT_SECRET=super_secret_jwt_signing_key_here

# Database
DATABASE_URL=postgresql://fileforge_user:password@db.prod.internal:5432/fileforge_prod?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://fileforge_user:password@db.prod.internal:5432/fileforge_prod?sslmode=require

# Redis & Queue Engine
REDIS_URL=rediss://default:token@prod-redis.upstash.io:6379

# Object Storage (S3 / Cloudflare R2)
STORAGE_PROVIDER=r2
S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=fileforge-production-vault
S3_ACCESS_KEY_ID=r2_access_key_id
S3_SECRET_ACCESS_KEY=r2_secret_access_key
S3_PUBLIC_DOMAIN=https://cdn.fileforge.ai
HMAC_SECRET_KEY=secure_hmac_signing_key_for_temporary_download_urls

# Billing & Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=razorpay_secret_key...

# Telemetry & Monitoring
SENTRY_DSN=https://...ingest.sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...ingest.sentry.io/...
```

---

## 4. Step-by-Step Vercel Deployment

1. **Connect GitHub Repository**:
   - Link `https://github.com/Itzjay169/FileForge-AI` in the Vercel dashboard.
2. **Configure Monorepo Settings**:
   - **Root Directory**: Leave blank (monorepo root).
   - **Framework Preset**: Next.js.
   - **Build Command**: `cd apps/web && npm run build`
   - **Output Directory**: `apps/web/.next`
3. **Environment Secrets**:
   - Paste the production environment variables from Section 3.
4. **Deploy**:
   - Trigger deployment. All 44+ static and dynamic routes will compile automatically.

---

## 5. Standalone Transcoding Worker Cluster Provisioning

For continuous high-volume batch workloads, run transcoding worker daemons on dedicated nodes equipped with native binaries:

```dockerfile
# Production Worker Dockerfile
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libreoffice-nogui \
    ghostscript \
    poppler-utils \
    pandoc \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

RUN npm ci --workspace=packages/shared --workspace=apps/worker

CMD ["node", "apps/worker/dist/index.js"]
```

---

## 6. Database Migrations & Backup Strategy

1. **Automated Migrations**:
   Run database schema migrations before traffic cutover:
   ```bash
   npx prisma migrate deploy
   ```
2. **Point-In-Time Recovery (PITR)**:
   - Enable Continuous WAL archiving on PostgreSQL with 30-day retention.
   - Schedule daily physical database snapshots at 03:00 UTC.
3. **Storage Bucket Lifecycle Policy**:
   - Configure S3/R2 lifecycle rules to automatically abort uncompleted multipart uploads after 24 hours.
   - Tag Free-tier temporary upload prefixes (`temp/*`) for automatic deletion after 24 hours.

---

## 7. Security Hardening Checklist

- [x] **HSTS Preload**: Set `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- [x] **Content Security Policy (CSP)**: Disallow unsafe inline scripts, restrict object-src.
- [x] **Anti-SSRF Protection**: Private IP subnet blocking (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, 169.254.169.254).
- [x] **Malware & Executable Quarantine**: Binary magic number byte scanning rejects disguised executable headers.
- [x] **HMAC Temporary Download URLs**: Expiring download signatures prevent unauthorized URL harvesting.
