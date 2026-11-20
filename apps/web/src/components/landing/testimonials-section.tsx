'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ForgeRating, forgeToast } from '@/components/sakuga';

export interface TestimonialItem {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    initials: string;
    gradient: string;
  };
  rating: number;
  highlight: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'aiko-t',
    quote:
      'FileForge compressed my 4K ProRes master reel from 2.1 GB to 380 MB with zero visible quantization banding. The AV1 transcode pipeline is exceptionally fast.',
    author: {
      name: 'Aiko T.',
      role: 'Animation Director & Motion Artist',
      initials: 'AT',
      gradient: 'from-violet-500 to-indigo-600',
    },
    rating: 5,
    highlight: '-82% SIZE ON 4K PRORES'
  },
  {
    id: 'marcus-l',
    quote:
      'Batch converted 240 RAW and HEIC studio photos to WebP in a single job. What used to take an hour in desktop tools executed in 28 seconds client-side.',
    author: {
      name: 'Marcus L.',
      role: 'Commercial Photographer',
      initials: 'ML',
      gradient: 'from-pink-500 to-rose-600',
    },
    rating: 5,
    highlight: '240 ASSETS IN 28s'
  },
  {
    id: 'priya-s',
    quote:
      'The format explorer and C2PA provenance checker make this an indispensable asset in our design system pipeline. Pure kinetic precision without generic SaaS bloat.',
    author: {
      name: 'Priya S.',
      role: 'Principal Front-End Architect',
      initials: 'PS',
      gradient: 'from-violet-600 to-pink-500',
    },
    rating: 5,
    highlight: 'C2PA AUDIT READY'
  },
];

export function TestimonialsSection() {
    const [userRating, setUserRating] = useState(5);
  const [rated, setRated] = useState(false);

  const handleRatingChange = (val: number) => {
    setUserRating(val);
    setRated(true);
    forgeToast.success('Studio Rating Logged', `Thank you for rating FileForge ${val} / 5 stars!`);
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative py-24 bg-[var(--sk-bg)] border-b-2 border-[var(--sk-line)] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Manga Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-2 border-[var(--sk-border)] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-3 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>[ACT 06 // CREATOR DISPATCHES]</span>
            </div>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans"
            >
              Verified Studio Telemetry
            </h2>
          </div>
          <p className="text-sm text-[var(--sk-text-muted)] max-w-md font-medium">
            Read field reports from creators, animators, and engineers utilizing FileForge daily.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.id}
              delay={0.1 + index * 0.12}
              className="h-full"
            >
              <div
                className="bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-3xl p-7 flex flex-col justify-between h-full relative group shadow-[6px_8px_0_rgba(109,90,224,0.35)] hover:border-[var(--sk-acc)] hover:shadow-[6px_8px_0_rgba(255,95,162,0.4)] transition-all"
              >
                <div>
                  {/* Top Bar: Highlight Pill & Stars */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[var(--sk-acc)]/20 text-[var(--sk-acc)] border border-[var(--sk-acc)]/40">
                      {testimonial.highlight}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <blockquote className="text-[var(--sk-text)] text-sm leading-relaxed mb-6 font-medium">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-5 border-t-2 border-[var(--sk-border)]">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-mono font-black text-white text-xs border border-white/20 shadow-sm',
                      testimonial.author.gradient
                    )}
                  >
                    {testimonial.author.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-sm truncate uppercase font-sans">
                      {testimonial.author.name}
                    </div>
                    <div className="text-xs text-[var(--sk-text-muted)] truncate font-mono">
                      {testimonial.author.role}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Live Studio Feedback Station Featuring Real Sakuga Rating */}
        <div className="p-8 rounded-3xl bg-[var(--sk-card)] border-2 border-[var(--sk-line)] shadow-[6px_8px_0_rgba(109,90,224,0.4)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black text-white uppercase font-sans flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[var(--sk-acc)]" />
              Rate Your Studio Experience
            </h3>
            <p className="text-xs text-[var(--sk-text-muted)] font-mono max-w-lg">
              Interact with the official Sakuga VFX star rating component below. Rate our speed, compression fidelity, and UI responsiveness.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <ForgeRating
              label="Interactive Rating"
              value={userRating}
              onChange={handleRatingChange}
              className="bg-black/40 border-2 border-[var(--sk-border)]"
            />
            {rated && (
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Rating Synced!
              </span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default TestimonialsSection;
