# FileForge AI — Master Design System (UI UX Pro Max)

> **LOGIC:** When building or upgrading a specific page, first check `design-system/fileforge-ai/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, strictly follow the rules below.

---

**Project:** FileForge AI  
**System:** UI UX Pro Max + Sakuga VFX  
**Version:** 2.0.0  
**Creative Direction:**
> Design FileForge AI as a cinematic creative file studio: dark violet-charcoal environment, white paper-like cards, lavender primary actions, pink impact accents, precise monospaced file metadata, physical squash-and-release buttons, energetic sliders and progress bars, expressive tabs and toasts, subtle smoke and particle effects, and premium micro-interactions. It must feel like a professional creative tool with anime-inspired energy—not a generic SaaS template. Prioritize clarity, speed, accessibility, mobile usability, and real product utility over decoration.

---

## 1. Global Color Tokens & Sakuga VFX Theme

### Sakuga VFX Master Variables (`:root`)
```css
:root {
  --sk-ink: #f4f1ff;
  --sk-card: #14121f;
  --sk-pri: #a78bfa;
  --sk-acc: #ff5fa2;
  --sk-line: #6d5ae0;
  --sk-bg: #0b0913;
  --sk-surface: #171425;
  --sk-surface-raised: #1e1a2e;
  --sk-border: #322b4d;
  --sk-text: #f6f4ff;
  --sk-text-muted: #a49cc4;
  --sk-success: #4ade80;
  --sk-warning: #fbbf24;
  --sk-danger: #f87171;
  --sk-glow: rgba(167, 139, 250, 0.35);

  /* Functional Mappings */
  --color-bg: var(--sk-bg);
  --color-surface: var(--sk-surface);
  --color-surface-raised: var(--sk-surface-raised);
  --color-primary: var(--sk-pri);
  --color-accent: var(--sk-acc);
  --color-border: var(--sk-border);
  --color-text: var(--sk-text);
  --color-text-muted: var(--sk-text-muted);
}
```

### Light Mode (`html.light`)
```css
html.light {
  --sk-ink: #121021;
  --sk-card: #ffffff;
  --sk-pri: #7c3aed;
  --sk-acc: #e11d48;
  --sk-line: #8b5cf6;
  --sk-bg: #f8f6fc;
  --sk-surface: #f1edf9;
  --sk-surface-raised: #ffffff;
  --sk-border: #dcd6ee;
  --sk-text: #0f0d1b;
  --sk-text-muted: #645e82;
  --sk-success: #16a34a;
  --sk-warning: #d97706;
  --sk-danger: #dc2626;
  --sk-glow: rgba(124, 58, 237, 0.2);
}
```

---

## 2. Typography Scale

- **Display & Headings:** `Plus Jakarta Sans`, sans-serif (Weights: 600, 700, 800)
- **Monospaced Metadata:** `JetBrains Mono`, monospace (Weights: 400, 500, 700)
- **Body:** `Plus Jakarta Sans`, sans-serif (Weights: 400, 500, 600)

| Token | Size | Line Height | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `display-2xl` | 4.5rem (72px) | 1.05 | -0.03em | Hero Section Display Titles |
| `display-xl` | 3.75rem (60px) | 1.1 | -0.025em | Major Section Headlines |
| `title-lg` | 2.25rem (36px) | 1.2 | -0.02em | Page & Modal Headers |
| `title-md` | 1.5rem (24px) | 1.3 | -0.015em | Feature & Card Titles |
| `title-sm` | 1.125rem (18px)| 1.4 | -0.01em | Sub-headers, Drawer Titles |
| `body-base` | 1rem (16px) | 1.5 | normal | Main Body Copy |
| `body-sm` | 0.875rem (14px)| 1.5 | normal | Secondary text, helper labels |
| `mono-code` | 0.8125rem (13px)| 1.4 | 0.02em | File metadata, sizes, hashes, SHA-256 |

---

## 3. Spacing & Elevation Tokens

```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;

/* Border Radii */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-2xl: 32px;
--radius-full: 9999px;

/* Shadows */
--shadow-card: 0 8px 32px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--sk-border);
--shadow-elevated: 0 16px 48px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--sk-border);
--shadow-glow: 0 0 24px var(--sk-glow);
```

---

## 4. Sakuga VFX Component Mapping

| Sakuga Component | Reusable Wrapper | Specific Use Cases |
| :--- | :--- | :--- |
| `<sakuga-button>` | `ForgeButton` | "Start Compressing", "Convert Now", "Optimize", "Upload Files", "Download", "Save Changes", "Create Share Link", "Send Report" |
| `<sakuga-toggle>` | `ForgeToggle` | Remove metadata, Preserve quality, Convert to WebP, Enable OCR, Add watermark, Background processing, Dark/Light mode, Reduced motion |
| `<sakuga-slider>` | `ForgeSlider` | Compression quality, Target size, Resolution scale, Video bitrate, Audio bitrate, Frame rate, Compression strength |
| `<sakuga-checkbox>` | `ForgeCheckbox` | Remove EXIF metadata, Keep original filename, Merge into one PDF, Extract images, Add page numbers, Password protection, Accept terms |
| `<sakuga-radio>` | `ForgeRadioGroup` / `ForgeRadio` | Compression mode (Smart, Balanced, Max Quality, Web Optimized), Output format selection, Resolution presets |
| `<sakuga-input>` | `ForgeInput` | Search, Target file size, Email, Password, File name, Share-link password, Bug report fields, Newsletter |
| `<sakuga-tabs>` | `ForgeTabs` | Categories (Documents, Images, Video, Audio, Archives, 3D, Code), Mode (Compress, Convert, Optimize), Basic/Advanced |
| `<sakuga-progress>` | `ForgeProgress` | Upload, Validation, Malware scan, Compression, Conversion, OCR, Video processing, Download preparation |
| `<sakuga-toast>` | `forgeToast` / `ForgeToaster` | Upload complete, Compression complete, Conversion complete, Download ready, File saved, Share link copied, Errors |
| `<sakuga-tooltip>` | `ForgeTooltip` | File-format explanations, Compression-quality tooltips, EXIF explanation, OCR explanation, Privacy hints |
| `<sakuga-rating>` | `ForgeRating` | Optional feedback after completed job, Help-center article feedback, Bug-report quality feedback (Zero fake reviews) |

---

## 5. Motion & Physics Rules

1. **Spring Easing:**
   - Squash-and-overshoot spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` for entrances and primary interactions.
   - Smooth exit: `cubic-bezier(0.4, 0, 0.2, 1)`.
2. **Timing Durations:**
   - Micro-interactions (hover, press, focus): `120ms` – `200ms`.
   - Card expansion, drawer slide, modals: `250ms` – `350ms`.
   - Scene transitions (wipes, section reveals): `400ms` max.
3. **Hardware Acceleration:**
   - Animate only `transform` and `opacity`. Avoid animating `width`, `height`, `left`, `top`, or `box-shadow` on continuous loops.
4. **`prefers-reduced-motion` Enforcement:**
   - Turn off particle bursts, smoke canvas, parallax, and smear frames.
   - Maintain instant layout changes, functional opacity shifts, and state updates without animation lag.
5. **Canvas Safety:**
   - Sakuga canvas overlay sits at the top z-index with `pointer-events: none`.
   - Never nest animated trigger elements inside ancestors with `overflow: hidden`.

---

## 6. Accessibility & Responsive Standards

- **Touch Targets:** Minimum `44px x 44px` on all mobile interactive elements.
- **Focus Indicators:** High-contrast `2px solid var(--sk-pri)` focus rings with `2px` offset (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- **Contrast Ratios:** Minimum 4.5:1 for normal body text against background; minimum 3:1 for large headers and icons.
- **Breakpoints:**
  - `sm`: `375px` (Mobile compact)
  - `md`: `768px` (Tablet)
  - `lg`: `1024px` (Laptop)
  - `xl`: `1440px` (Wide Desktop)
- **Zero Horizontal Scroll:** `overflow-x: clip` on root; `min-w-0` on flex items, break-words on URLs, responsive grids.

---

## 7. Anti-Patterns to Avoid

- ❌ Generic purple/blue SaaS gradient heroes.
- ❌ Centered three-identical-card layouts.
- ❌ Default Inter font on pure white background.
- ❌ Stock emoji icons (always use Lucide / SVG icons).
- ❌ Cluttering screens with decorative animations that block clicks or delay user tasks.
- ❌ Fake testimonials, fake customer reviews, or fabricated rating statistics.
- ❌ Raw technical error strings in the user interface.
