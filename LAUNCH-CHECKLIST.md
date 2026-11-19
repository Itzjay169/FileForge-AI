# FileForge AI — Production Launch Checklist

A comprehensive go/no-go quality assurance gate before opening FileForge AI to public creator traffic.

---

## 1. Security & Infrastructure Hardening
- [ ] **HTTPS / TLS 1.3**: Grade A+ on SSL Labs with HSTS preload enabled.
- [ ] **SSRF Firewall**: Verified blocking of loopback (`127.0.0.1`), metadata IP (`169.254.169.254`), and private subnets (`192.168.0.0/16`, `10.0.0.0/8`, `172.16.0.0/12`).
- [ ] **Anti-Malware & Disguised Executable Defense**: Binary header scanner detects MZ (Windows PE), ELF (Linux), and script tags within SVG vectors.
- [ ] **HMAC Signed URLs**: All file downloads enforce cryptographic timestamped signatures with automatic expiration.
- [ ] **Rate Limiting**: Cloudflare edge rules and API token rate limiting active on upload, conversion, and auth routes.
- [ ] **Environment Secrets**: Zero API keys or private tokens committed to git history. All production secrets managed via secret vault.
- [ ] **SQL & NoSQL Injection Protection**: All queries parameterized through Prisma ORM and Zod request payload validation.

---

## 2. Accessibility (WCAG 2.1 AA)
- [ ] **Color Contrast**: 4.5:1 minimum text contrast ratio verified across all Sakuga dark theme surfaces.
- [ ] **Keyboard Navigation**: Full Tab/Shift-Tab focus traps for modals, dropzones, sliders, and command palette (`Ctrl+K`).
- [ ] **Screen Reader Compatibility**: Accessible ARIA labels on all icon buttons, progress meters, and upload triggers.
- [ ] **Motion Sensitivity**: `prefers-reduced-motion` media queries respected for spring animations and particle glows.

---

## 3. Privacy, Provenance & Legal Compliance
- [ ] **Zero-Retention Shredding**: Automated 24-hour file purging confirmed for all Free tier ephemeral uploads.
- [ ] **Verified Watermark Workflow**: Strict 2-step owner certification required prior to initiating copyright watermark removal.
- [ ] **AI Disclosure Transparency**: Automated translucent badges and provenance manifests attached to AI-assisted exports.
- [ ] **C2PA Manifest Compliance**: Coalition for Content Provenance and Authenticity manifests correctly parsed and displayed.
- [ ] **GDPR / CCPA Readiness**: Right to access, export, and delete personal account history implemented.
- [ ] **Published Legal Policies**: Terms of Service, Privacy Policy, Refund Policy, and Acceptable Use Policy live.

---

## 4. Performance & Core Web Vitals
- [ ] **Lighthouse Performance Score**: > 90 on Desktop and > 80 on Mobile for all marketing and studio routes.
- [ ] **First Contentful Paint (FCP)**: < 1.2s on standard broadband connections.
- [ ] **Cumulative Layout Shift (CLS)**: < 0.05 across interactive pages and sliders.
- [ ] **Next.js Route Optimization**: Static pre-rendering enabled for public documentation, pricing, help, and format pages.
- [ ] **Asset Minification**: Brotli and Gzip compression active on all JavaScript bundles and CSS assets.

---

## 5. SEO, Social & Discovery
- [ ] **Metadata & Open Graph**: Custom title, description, and OG image tags defined across every page.
- [ ] **Dynamic XML Sitemap**: Generated at `/sitemap.xml` with priority and changeFrequency attributes.
- [ ] **Robots Exclusion**: Configured at `/robots.txt` disallowing `/api/` and `/admin/` crawlers.
- [ ] **Structured Data (JSON-LD)**: SoftwareApplication schema injected on homepage and format converter routes.

---

## 6. Billing, Subscriptions & Invoicing
- [ ] **Stripe & Razorpay Production Webhooks**: Webhook endpoint verified with signed secret validation.
- [ ] **Subscription Plan Tiers**: Free, Pro Creative ($12/mo), Studio Team ($39/mo), and Enterprise ($99/mo) active.
- [ ] **Payment Failure Recovery**: `invoice.payment_failed` transitions subscription to `PAST_DUE` with grace period notifications.
- [ ] **Pay-As-You-Go Credits**: Instant credit balance allocation upon successful checkout.
- [ ] **Automated Invoicing & Refunds**: PDF invoices generated with self-serve 7-day refund capability.

---

## 7. Customer Support & Operational Telemetry
- [ ] **Live System Status Page**: Operational health and latency telemetry visible at `/status`.
- [ ] **Help Center & FAQs**: 12+ comprehensive answers and searchable guide categories active at `/faq` and `/help`.
- [ ] **Contact Form Ticketing**: Submissions automatically create assigned tickets in the Admin command center.
- [ ] **Admin Operations Hub**: Real-time user management, job queue inspector, and feature flags active at `/admin/dashboard`.
- [ ] **Error Monitoring**: Sentry / Datadog exceptions alerted to on-call engineering channels.

---

## 8. Mobile App Store Readiness (Expo iOS & Android)
- [ ] **Bundle Identifiers**: Configured as `com.fileforge.app` with production versioning (`v2.1.0`).
- [ ] **Native App Icons**: Provided in 1024x1024 PNG resolution.
- [ ] **Adaptive Splash Screens**: Styled to match Sakuga dark theme background (`#0a0a0f`).
- [ ] **Permission Descriptions**: `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` clearly explaining document scanning and media import intent.
- [ ] **Biometric Authentication**: Local Face ID / Touch ID / Fingerprint lock verified.
- [ ] **Share-Sheet Intent Filters**: Registered for image, video, audio, and PDF system share extensions.

---

## 9. Final Launch Sign-Off
- [ ] Automated Test Suite: 176+ unit and integration tests passing (`npm test`).
- [ ] Zero TypeScript Warnings: `npx tsc --noEmit` exits with code 0.
- [ ] Production Build: `npm run build` generates clean output across all 44+ routes.
- [ ] Executive Sign-off: Engineering, Legal, and Product leads have approved launch.
