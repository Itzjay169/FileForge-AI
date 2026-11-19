'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import ScrollReveal from '@/components/ui/scroll-reveal';

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
}

export interface TestimonialsSectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'aiko-t',
    quote:
      'FileForge compressed my 4K footage from 2GB to 400MB with barely any quality loss. This is insane.',
    author: {
      name: 'Aiko T.',
      role: 'Video Editor',
      initials: 'AT',
      gradient: 'from-violet-500 to-indigo-600',
    },
    rating: 5,
  },
  {
    id: 'marcus-l',
    quote:
      'I converted 200 HEIC photos to WebP in one batch. What used to take me an hour now takes 30 seconds.',
    author: {
      name: 'Marcus L.',
      role: 'Photographer',
      initials: 'ML',
      gradient: 'from-pink-500 to-rose-600',
    },
    rating: 5,
  },
  {
    id: 'priya-s',
    quote:
      'The format explorer alone is worth bookmarking. Finally I know what every file extension does.',
    author: {
      name: 'Priya S.',
      role: 'Developer',
      initials: 'PS',
      gradient: 'from-violet-600 to-pink-500',
    },
    rating: 5,
  },
];

export function TestimonialsSection({
  className,
  id = 'testimonials',
  ...props
}: TestimonialsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      aria-labelledby="testimonials-heading"
      className={cn(
        'relative py-24 overflow-hidden bg-forge-bg text-forge-text',
        className
      )}
      {...props}
    >
      {/* Background ambient lighting accents */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-forge-primary/10 blur-[130px] rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 top-1/4 w-[350px] h-[250px] bg-forge-accent/10 blur-[120px] rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <ScrollReveal direction="up" delay={0.1}>
            <h2
              id="testimonials-heading"
              className="text-3xl font-bold tracking-tight text-forge-text sm:text-4xl lg:text-5xl"
            >
              Loved by <span className="text-gradient-violet">creators worldwide</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-4 text-base sm:text-lg text-forge-text-muted">
              Join thousands of designers, developers, and creators.
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonials Grid (1 column on mobile, 3 columns on desktop) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.id}
              direction="up"
              delay={0.1 + index * 0.15}
              className="h-full"
            >
              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }
                }
                className={cn(
                  'card-glass p-8 flex flex-col justify-between h-full relative group',
                  'transition-colors duration-300 hover:border-forge-border-hover'
                )}
              >
                <div>
                  {/* Rating Stars & Decorative Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="flex items-center gap-1"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <Quote
                      className="h-6 w-6 text-forge-primary/30 group-hover:text-forge-primary/50 transition-colors duration-300"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-forge-text text-base leading-relaxed italic mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-6 border-t border-forge-border">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm ring-1 ring-white/10 text-sm select-none',
                      testimonial.author.gradient
                    )}
                    aria-hidden="true"
                  >
                    {testimonial.author.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-forge-text text-sm truncate">
                      {testimonial.author.name}
                    </div>
                    <div className="text-xs text-forge-text-muted truncate">
                      {testimonial.author.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
