# FileForge AI — Sakuga Design System Guide

The FileForge AI design system is inspired by the open-source **Sakuga VFX** project (`finktheartist/sakuga-vfx`), bringing anime-style key animation principles into modern web and mobile controls.

---

## 1. Visual Identity & Palette

FileForge AI departs from generic SaaS templates with a **Futuristic Creative Studio** theme:

- **Deep Studio Base**: `#0a0a0f` (Rich obsidian black)
- **Elevated Surfaces**: `#12121a`
- **Paper Cards**: `#faf9f7` (High-contrast clean card face with dark text)
- **Primary Energy (Violet)**: `#8b5cf6` (Electric lavender / violet accents)
- **Secondary Impact (Pink)**: `#ec4899` (High-chroma magenta highlights)
- **Success Beam**: `#10b981` (Emerald completion burst)
- **Warning Flare**: `#f59e0b` (Amber hazard warning)

---

## 2. Animation Mechanics & Physics

### A. The Sakuga Button (`<SakugaButton>`)
- **At Rest**: Minimalist pill or rounded-xl button with subtle glowing border.
- **On Press (`whileTap`)**: Squash-and-stretch mechanic (`scaleX: 1.08`, `scaleY: 0.88`, spring stiffness: 500, damping: 15).
- **On Release**: Spring overshoot bounce with a single-frame white impact flash (`opacity 0.75 -> 0` in 200ms).
- **On Success**: Dynamic checkmark draws in with a bounce (`✓ Done!`).

### B. The Teardrop Slider (`<SakugaSlider>`)
- **Resting Thumb**: 20px circle with violet glow ring.
- **On Drag**: Thumb stretches horizontally in the direction of cursor velocity (`scaleX: 1.25 + |v| * 0.15`), accompanied by a floating pill tag displaying the current percentage or megabytes.
- **On Release**: Snaps back to spherical form with spring damping.

### C. The Plasma Progress Bar (`<SakugaProgress>`)
- **Track**: Inner-shadowed recessed track.
- **Active State**: High-energy gradient with traveling shimmer stripes simulating power charging.
- **100% Complete**: Flash pulse with transition to emerald green.

### D. The Smear Toggle Switch (`<SakugaToggle>`)
- **Flip Motion**: Inspired by 43-frame smeared animation. The toggle knob stretches into an ellipse (`scaleX: 1.35`, `scaleY: 0.75`) as it traverses the track, slamming into the opposite boundary with an elastic settle.

### E. The Crescent Checkbox (`<SakugaCheckbox>`)
- **Check Motion**: SVG path length animates from 0 to 1 with spring tension, accompanied by an expanding outer impact ripple.

### F. Animated Tabs (`<SakugaTabs>`)
- **Sliding Pill Indicator**: Active tab indicator smoothly glides between tab items using Framer Motion's shared `layoutId` layout physics.

---

## 3. Accessibility & `prefers-reduced-motion`

All Sakuga components evaluate `useReducedMotion()`. When a user requests reduced motion:
- Stretch distortions (`scaleX`, `scaleY`) are bypassed.
- Floating particles and infinite shimmers are disabled.
- Impact frames are omitted.
- Functional states (color changes, opacity transitions, accessible focus outlines) remain snappy and accessible.
