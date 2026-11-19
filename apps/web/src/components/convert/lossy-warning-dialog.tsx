'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  X,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ConversionQueueItem } from '@fileforge/shared';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { useReducedMotion } from '@/lib/hooks';

export interface LossyWarningDialogProps {
  item: ConversionQueueItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LossyWarningDialog: React.FC<LossyWarningDialogProps> = ({
  item,
  onConfirm,
  onCancel
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0"
        />

        {/* Dialog Card */}
        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: 16 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.92, y: 16 }
          }
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-[#14141e] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-950/40 z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Anime Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>

            <div className="min-w-0 pr-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Compatibility Notice
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 leading-tight">
                {item.lossWarningTitle || 'Potential Data & Fidelity Loss'}
              </h3>
            </div>
          </div>

          {/* Conversion Direction Pill */}
          <div className="flex items-center justify-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl p-3 mb-5">
            <span className="font-mono text-sm font-bold text-violet-300 uppercase px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/20">
              .{item.sourceExtension}
            </span>
            <ArrowRight className="w-4 h-4 text-white/40" />
            <span className="font-mono text-sm font-bold text-amber-300 uppercase px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/20">
              .{item.targetExtension}
            </span>
          </div>

          {/* Lost Attributes Bullet List */}
          {item.lostAttributes && item.lostAttributes.length > 0 && (
            <div className="mb-5 space-y-2">
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                Attributes affected during conversion:
              </span>
              <div className="space-y-1.5 mt-1.5 bg-black/30 border border-white/5 rounded-xl p-3">
                {item.lostAttributes.map((attr, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-amber-200/90">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{attr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Box */}
          {item.lossRecommendation && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-6 text-xs text-violet-200">
              <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Alternative recommendation:</strong> {item.lossRecommendation}
              </span>
            </div>
          )}

          {/* Action Button Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <SakugaButton variant="ghost" size="default" onClick={onCancel}>
              <span>Cancel</span>
            </SakugaButton>

            <SakugaButton
              variant="default"
              size="default"
              onClick={onConfirm}
              showSuccessCheck
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-amber-400/40 shadow-amber-500/25"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Proceed with Conversion</span>
            </SakugaButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
