'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { fileRegistry } from '@fileforge/file-registry';
import { conversionMatrix } from '@/lib/server/conversion-matrix';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface FormatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceExtension: string;
  currentTarget: string;
  onSelectTarget: (targetExt: string) => void;
}

export const FormatSelectorModal: React.FC<FormatSelectorModalProps> = ({
  isOpen,
  onClose,
  sourceExtension,
  currentTarget,
  onSelectTarget
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState('');

  const cleanSource = sourceExtension.toLowerCase().replace(/^\./, '');
  const sourceFormat = useMemo(() => fileRegistry.getFormat(cleanSource), [cleanSource]);

  // Compute available targets with route details
  const availableTargets = useMemo(() => {
    if (!sourceFormat) return [];
    return sourceFormat.conversionTargets.map((targetExt) => {
      const def = fileRegistry.getFormat(targetExt);
      const route = conversionMatrix.getRoute(cleanSource, targetExt);
      return {
        extension: targetExt.toLowerCase(),
        name: def?.name || targetExt.toUpperCase(),
        category: def?.category || 'other',
        isLossy: route.isLossy,
        warning: route.warningTitle
      };
    });
  }, [cleanSource, sourceFormat]);

  const filteredTargets = useMemo(() => {
    if (!search.trim()) return availableTargets;
    const q = search.toLowerCase().trim().replace(/^\./, '');
    return availableTargets.filter(
      (t) =>
        t.extension.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [availableTargets, search]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.94, y: 14 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.94, y: 14 }
          }
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md uppercase">
                  Convert .{cleanSource}
                </span>
                <span className="text-xs text-muted-foreground">Select Output Format</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-1">
                Choose Target Format
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mt-4 mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search target format (.pdf, .webp, .mp4)..."
              className="w-full h-11 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          {/* Format grid */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-2 scrollbar-thin">
            {filteredTargets.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No compatible formats found for &quot;{search}&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredTargets.map((target) => {
                  const isSelected = currentTarget.toLowerCase() === target.extension;
                  return (
                    <button
                      key={target.extension}
                      type="button"
                      onClick={() => {
                        onSelectTarget(target.extension);
                        onClose();
                      }}
                      className={cn(
                        'flex flex-col items-start p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 relative group',
                        isSelected
                          ? 'bg-violet-600/20 border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.25)]'
                          : 'bg-muted/40 border-border hover:bg-muted hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-sm font-bold text-foreground uppercase">
                          .{target.extension}
                        </span>
                        {target.isLossy ? (
                          <span
                            title={target.warning || 'Lossy Conversion'}
                            className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Lossy
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            <FileCheck className="w-2.5 h-2.5" />
                            Lossless
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground truncate w-full mt-1">
                        {target.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
