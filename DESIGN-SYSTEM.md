# FileForge AI — "Creative File Studio" Design System & Motion Specification

> **A Cinematic, Anime-Inspired UI & Physics Architecture**  
> Inspired by the open-source **[Sakuga VFX](https://github.com/finktheartist/sakuga-vfx)** project (MIT Licensed)  
> Aesthetic: Deep Charcoal Studio • Tactile White-Paper Surfaces • Lavender Primary Actions • Pink Impact Accents • Monospaced Technical Telemetry

---

## 1. Design Direction: "Creative File Studio"

FileForge AI is built for designers, videographers, developers, and studios who demand professional-grade precision and responsive tactile feedback. Rather than generic corporate SaaS blues and flat cards, the interface embodies:

1. **A Cinematic Dark Environment**: Deep indigo-charcoal void (`#09090e` / `#12121c`) that maximizes contrast, reduces eye strain, and centers creative focus.
2. **Tactile "Paper" Cards**: Crisp off-white surfaces (`#faf9f7`) with micro-drop shadows that feel physical, tangible, and deliberate.
3. **Lavender / Violet Primary (`#8b5cf6` / `#a78bfa`)**: Inspires focus, intelligence, and creative execution.
4. **Pink Impact Accents (`#ec4899` / `#f43f5e`)**: High-energy flash effects for state completions, primary CTA bursts, and quota savings highlights.
5. **Monospaced Technical Telemetry**: Strict monospaced typography (`JetBrains Mono`) for byte counters, format extensions, frame rates, and hash fingerprints.
6. **Physical Squash & Spring Overshoot**: All interactive controls squash under user pressure and spring back with energetic dampening.

---

## 2. Complete Design Tokens Reference

All design tokens are defined via CSS custom properties in `apps/web/src/app/globals.css` and mapped to Tailwind CSS utilities via `@theme`:

### Color Tokens

| Token | Dark (Default Studio) | Light Mode | Purpose |
|---|---|---|---|
| `--color-bg` | `#09090e` | `#f5f4f0` | Viewport & studio canvas background |
| `--color-surface` | `#12121c` | `#ffffff` | Primary bento panels & modal backdrops |
| `--color-surface-raised` | `#1a1a28` | `#eae8e1` | Elevated drawers, dropdowns, and cards |
| `--color-surface-paper` | `#faf9f7` | `#ffffff` | Tactile paper-like focal cards & CTAs |
| `--color-border` | `rgba(167, 139, 250, 0.12)` | `rgba(139, 92, 246, 0.18)` | Subtle structural divider lines |
| `--color-border-hover` | `rgba(236, 72, 153, 0.35)` | `rgba(236, 72, 153, 0.40)` | Interactive focus & hover rim glow |
| `--color-text` | `#f5f4f0` | `#111116` | High-contrast primary typography |
| `--color-text-muted` | `#9aa1b2` | `#575a68` | Secondary labels & explanatory text |
| `--color-text-inverse` | `#0a0a0f` | `#f5f4f0` | Inverted text on bright buttons/cards |
| `--color-primary` | `#8b5cf6` | `#7c3aed` | Lavender/violet core action triggers |
| `--color-primary-hover` | `#7c3aed` | `#6d28d9` | Hover state for primary actions |
| `--color-accent` | `#ec4899` | `#db2777` | Pink impact accent & savings badges |
| `--color-success` | `#10b981` | `#059669` | Success notifications & 100% bars |
| `--color-warning` | `#f59e0b` | `#d97706` | Lossy conversion & format alerts |
| `--color-danger` | `#ef4444` | `#dc2626` | Destructive actions & malware blocks |
| `--color-glow` | `rgba(139, 92, 246, 0.30)` | `rgba(124, 58, 237, 0.20)` | Soft atmospheric rim glow |

### Radii Tokens

| Token | Value | Applied To |
|---|---|---|
| `--radius-sm` | `8px` | Badges, tooltips, monospaced tags |
| `--radius-md` | `16px` | Sliders, inputs, buttons, dropdowns |
| `--radius-lg` | `24px` | Studio cards, modal containers, hero bento |
| `--radius-pill` | `9999px` | Navbars, category pills, progress tracks |

### Shadow Tokens

| Token | Definition | Usage |
|---|---|---|
| `--shadow-card` | `0 4px 20px -2px rgba(0,0,0,0.6)` | Baseline studio bento cards |
| `--shadow-card-hover` | `0 10px 32px -4px rgba(139,92,246,0.2)` | Interactive card elevation |
| `--shadow-paper` | `0 8px 30px rgba(0,0,0,0.35)` | Physical white paper card pop |
| `--shadow-glow` | `0 0 35px -5px rgba(139,92,246,0.45)` | Active engine & slider glow |
| `--shadow-impact-pink` | `0 0 35px -5px rgba(236,72,153,0.55)` | Action execution burst |

---

## 3. Sakuga Motion & Physics Specification

All transitions and keyframe animations are centralized in `apps/web/src/lib/motion.ts`.

### Physics Spring Curves

```typescript
export const springs = {
  // Physical key-press squash (high stiffness, fast damping)
  squash: { type: 'spring', stiffness: 520, damping: 24, mass: 0.8 },
  // Fast hover & drawer snapping
  snappy: { type: 'spring', stiffness: 420, damping: 26 },
  // Gentle card entrance & ambient floats
  soft: { type: 'spring', stiffness: 260, damping: 20 },
  // Manga-style overshoot impact settle
  overshoot: { type: 'spring', stiffness: 380, damping: 15 }
};
```

### Component Motion Matrix

#### 1. Buttons (`SakugaButton`)
- **Hover**: `-2px` Y-lift with `1.02x` scale and soft lavender rim glow.
- **Press**: Physical squash along Y-axis (`scaleX: 1.05, scaleY: 0.91, y: 2px`).
- **Release**: Springs back with controlled overshoot via `springs.squash`.
- **Milestone Completion**: Single-frame flash burst (`opacity: 0.75 → 0, scale: 0.95 → 1.15`) with drawn emerald checkmark.
- **Destructive Action**: Red warning slash with immediate feedback.

#### 2. Sliders (`SakugaSlider`)
- **Drag Start**: Thumb stretches into a directional teardrop (`scaleX: 1.28, scaleY: 0.82`) following drag velocity.
- **Dynamic Velocity**: Cursor speed computes dynamic angular tilt (`rotate: velocity * 8deg`).
- **Floating Telemetry**: Bubble badge floats above thumb displaying real-time value and unit.
- **Release**: Snaps back to perfect circular resting geometry with an energetic pink sparkle.
- **Real-Time Estimate**: Displays estimated output file size beside slider in real-time.

#### 3. Progress Bars (`SakugaProgress`)
- **Active State**: Kinetic energy shimmer stripe sweeps across leading edge continuously.
- **Stage Badging**: Displays current pipeline stage (`Uploading`, `Validating`, `Processing`, `Optimizing`, `Ready`).
- **Temporal Feedback**: Monospaced elapsed seconds and estimated remaining seconds (`~4s left`).
- **Completion**: White flash impact followed by transition to emerald gradient.

#### 4. Toasts (`SakugaToast`)
- **Entry**: Smear-like slide from screen edge (`scaleX: 1.15, scaleY: 0.88 → scale: 1.0`) settling with `springs.overshoot`.
- **Dismissal**: Rapid scale-down fade (`0.18s easeIn`), non-blocking, accessible to screen readers.

#### 5. Category Tabs (`SakugaTabs`)
- **Selection**: Active pill slides across tab items with LayoutGroup spring physics.
- **Settling**: Small bounce settle at destination with high-contrast text state.

---

## 4. Component Inventory

| Component | Path | Variants / Sizes | Accessibility |
|---|---|---|---|
| `SakugaButton` | `src/components/ui/sakuga-button.tsx` | `default`, `paper`, `secondary`, `accent`, `destructive`, `ghost`, `outline` / `sm`, `default`, `lg`, `icon` | Focus ring, ARIA button, `prefers-reduced-motion` |
| `SakugaSlider` | `src/components/ui/sakuga-slider.tsx` | `default`, `quality`, `size`, `extreme` | `role="slider"`, Arrow keys support, ARIA valuenow/min/max |
| `SakugaProgress` | `src/components/ui/sakuga-progress.tsx` | `default`, `success`, `warning`, `error`, `plasma` / `sm`, `default`, `lg` | `role="progressbar"`, live status label |
| `SakugaTabs` | `src/components/ui/sakuga-tabs.tsx` | Compound Tabs, TabsList, TabsTrigger, TabsContent | `role="tablist"`, `role="tab"`, Arrow key cycling |
| `SakugaToggle` | `src/components/ui/sakuga-toggle.tsx` | `default`, `compact` | `role="switch"`, ARIA checked state |
| `SakugaCheckbox` | `src/components/ui/sakuga-checkbox.tsx` | Standard, with description | Native hidden input + ARIA styling |
| `SakugaInput` | `src/components/ui/sakuga-input.tsx` | `default`, `mono`, `search` | Focus glow ring, floating label support |
| `SakugaToast` | `src/components/ui/sakuga-toast.tsx` | `success`, `error`, `warning`, `info` | Sonner accessible toast polite region |
| `Navbar` | `src/components/layout/navbar.tsx` | Sticky desktop + mobile drawer | Semantic header, keyboard escape |
| `MobileNav` | `src/components/layout/mobile-nav.tsx` | Docked 5-tab mobile thumb bar | 1-tap thumb navigation, safe-area-inset |
| `Footer` | `src/components/layout/footer.tsx` | 5-column Mega Footer | Semantic contentinfo, valid links |
| `HeroSection` | `src/components/landing/hero-section.tsx` | Interactive Showcase Hero | GPU particles disabled in reduced motion |
| `VFXPlayground` | `src/components/landing/vfx-playground.tsx` | Interactive Bento Studio | Real-time slider & progress simulation |

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Layout Behavior |
|---|---|---|
| **Mobile (`< 640px`)** | `100vw` | Single-column bento, persistent bottom `MobileNav`, compact sliders |
| **Tablet (`640px - 1024px`)** | `768px` | 2-column bento grids, full-width dropzones |
| **Desktop (`1024px - 1280px`)** | `1024px` | Sticky desktop navbar, multi-column bento layout |
| **Wide Studio (`> 1280px`)** | `1280px+` | Max container width `max-w-7xl`, side-by-side inspection panels |

---

## 6. Accessibility & WCAG 2.2 AA Compliance

1. **Strict Reduced Motion**:
   When `prefers-reduced-motion: reduce` is detected:
   - All particle floats, energy streaks, and parallax effects are disabled.
   - Squash-and-stretch button animations revert to instantaneous state transitions.
   - Slider teardrop elongation reverts to static circular thumb geometry.
   - Essential visual feedback (color changes, checkmarks, text changes) is strictly preserved.
2. **Color Contrast**:
   - Primary text (`#f5f4f0`) on studio dark (`#09090e`): **18.2:1** (Exceeds AAA).
   - Inverted text (`#09090e`) on white paper card (`#faf9f7`): **18.8:1** (Exceeds AAA).
   - Muted text (`#9aa1b2`) on surface (`#12121c`): **6.4:1** (Exceeds AA).
3. **Keyboard Focus States**:
   - Focus rings use high-contrast pink-to-violet borders (`focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090e]`).
   - Sliders support full keyboard navigation (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`).

---

## 7. Visual QA Checklist

- [x] Studio background reflects dark charcoal-indigo depth (`#09090e`), not flat gray.
- [x] Paper-like tactile cards render with crisp `#faf9f7` surfaces and subtle drop shadows.
- [x] Buttons visibly squash on click and spring back on mouseup.
- [x] Sliders stretch into a teardrop shape during drag and show estimated output sizes.
- [x] Progress bars display kinetic leading-edge energy and stage indicators.
- [x] Hero headline reads: **"Every file. One creative studio."**
- [x] Hero showcases live file transformation card with before/after size reduction.
- [x] Top navigation bar features Command Palette (`⌘K`), theme toggle, and library shortcut.
- [x] Mobile action bar docks cleanly at viewport bottom on mobile devices.
- [x] Mega footer includes all 5 columns: Product, Resources, Trust, Legal, and Company.
- [x] Zero TypeScript errors (`npx tsc --noEmit` exits with 0).
- [x] Next.js Turbopack production build compiles with zero errors.
