'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CommandPalette } from '@/components/layout/command-palette';
import { HeroSection } from '@/components/landing/hero-section';
import { VFXPlayground } from '@/components/landing/vfx-playground';
import { FeaturesSection } from '@/components/landing/features-section';
import { FormatsPreviewSection } from '@/components/landing/formats-preview-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#f0eee9] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      {/* Global Navigation */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Main Sections */}
      <main>
        <HeroSection />
        <VFXPlayground />
        <FeaturesSection />
        <FormatsPreviewSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      {/* Global Detailed Footer */}
      <Footer />

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
