'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Globe,
  ShieldCheck,
  Mail,
  MessageSquare,
  Camera,
  SlidersHorizontal,
  type LucideIcon
} from 'lucide-react';
import {
  CompressionPreset,
  COMPRESSION_PRESETS
} from '@fileforge/shared';
import { useUploadStore } from '@/lib/stores/upload-store';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/** Map each preset to a Lucide icon component */
const PRESET_ICONS: Record<CompressionPreset, LucideIcon> = {
  SMART_COMPRESS: Zap,
  WEB_OPTIMIZED: Globe,
  MAXIMUM_QUALITY: ShieldCheck,
  EMAIL_READY: Mail,
  WHATSAPP_READY: MessageSquare,
  INSTAGRAM_READY: Camera,
  CUSTOM: SlidersHorizontal
};

/** Ordered preset keys for display */
const PRESET_ORDER: CompressionPreset[] = [
  'SMART_COMPRESS',
  'WEB_OPTIMIZED',
  'MAXIMUM_QUALITY',
  'EMAIL_READY',
  'WHATSAPP_READY',
  'INSTAGRAM_READY',
  'CUSTOM'
];

export const CompressionPresetsBar: React.FC = () => {
  const activePreset = useUploadStore((s) => s.activePreset);
  const setPreset = useUploadStore((s) => s.setPreset);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-none flex gap-3 pb-2">
        {PRESET_ORDER.map((presetKey) => {
          const def = COMPRESSION_PRESETS[presetKey];
          const Icon = PRESET_ICONS[presetKey];
          const isActive = activePreset === presetKey;

          return (
            <motion.button
              key={presetKey}
              type="button"
              onClick={() => setPreset(presetKey)}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
              className={cn(
                'relative min-w-[140px] p-4 rounded-2xl border flex flex-col items-center gap-2 text-center cursor-pointer transition-all duration-200 shrink-0',
                isActive
                  ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                  : 'bg-card border-border hover:bg-muted/50 hover:border-primary/30'
              )}
            >
              {/* Active indicator underlay with layoutId */}
              {isActive && (
                <motion.div
                  layoutId={prefersReducedMotion ? undefined : 'preset-active-indicator'}
                  className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={cn(
                  'text-sm font-semibold transition-colors whitespace-nowrap',
                  isActive ? 'text-primary font-bold' : 'text-foreground'
                )}
              >
                {def.label}
              </span>

              <span
                className={cn(
                  'text-[11px] leading-tight transition-colors line-clamp-2',
                  isActive ? 'text-primary/80 font-medium' : 'text-muted-foreground'
                )}
              >
                {def.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
