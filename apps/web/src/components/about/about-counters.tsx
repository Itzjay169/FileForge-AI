'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Zap, HardDrive, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme, useReducedMotion } from '@/lib/hooks';

interface CounterItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const STATS: CounterItem[] = [
  {
    id: 'formats',
    target: 200,
    suffix: '+',
    label: 'Universal Formats',
    description: 'Images, video, audio, PDFs, 3D meshes & archives',
    icon: Layers,
    accentColor: 'text-violet-500'
  },
  {
    id: 'compression',
    target: 90,
    suffix: '%',
    label: 'Max Compression',
    description: 'Lossless & neural optimization with zero artifacting',
    icon: Zap,
    accentColor: 'text-pink-500'
  },
  {
    id: 'upload',
    target: 2,
    suffix: ' GB',
    label: 'Free Upload Ceiling',
    description: 'Generous limits for creators without forced subscriptions',
    icon: HardDrive,
    accentColor: 'text-emerald-500'
  },
  {
    id: 'retention',
    target: 24,
    suffix: 'h',
    label: 'Auto-Purge Privacy',
    description: 'Memory-first ephemeral containers automatically wiped',
    icon: ShieldCheck,
    accentColor: 'text-cyan-500'
  },
  {
    id: 'free',
    target: 100,
    suffix: '%',
    label: 'Free & Transparent',
    description: 'No deceptive watermarks, trackers, or hidden paywalls',
    icon: Sparkles,
    accentColor: 'text-amber-500'
  }
];

function AnimatedCounterValue({
  target,
  suffix,
  isInView,
  prefersReduced
}: {
  target: number;
  suffix: string;
  isInView: boolean;
  prefersReduced: boolean;
}) {
  const [current, setCurrent] = useState(prefersReduced ? target : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1400; // ms
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(ease * target);
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, prefersReduced]);

  const displayValue = prefersReduced ? target : current;

  return (
    <span className="font-mono font-black text-3xl sm:text-4xl text-primary tracking-tight">
      {displayValue}
      {suffix}
    </span>
  );
}

export function AboutCounters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const { isDark, theme } = useTheme();
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={containerRef}
      aria-label="FileForge AI Studio Metrics"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      data-theme-active={theme}
    >
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase">
          PROVEN RELIABILITY & METRICS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Engineered for Speed, Scale & Ephemeral Trust
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isDark
                  ? 'bg-card border-border hover:border-violet-500/40 shadow-lg shadow-black/20'
                  : 'bg-card border-border hover:border-violet-500/50 shadow-md shadow-violet-500/5'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isDark
                        ? 'bg-violet-500/10 border-violet-500/25 text-violet-400'
                        : 'bg-violet-500/10 border-violet-500/25 text-violet-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isDark
                        ? 'bg-white/5 text-muted-foreground'
                        : 'bg-violet-100/60 text-muted-foreground'
                    }`}
                  >
                    VERIFIED
                  </span>
                </div>

                <div>
                  <AnimatedCounterValue
                    target={stat.target}
                    suffix={stat.suffix}
                    isInView={isInView}
                    prefersReduced={prefersReduced}
                  />
                  <h3 className="text-sm font-bold text-foreground mt-1 tracking-tight">
                    {stat.label}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
