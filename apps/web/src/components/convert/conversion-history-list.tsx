'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Download,
  RotateCw,
  Trash2,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useConversionStore } from '@/lib/stores/conversion-store';
import { fileRegistry } from '@fileforge/file-registry';
import { ForgeButton } from '@/components/sakuga';
import { formatFileSize, truncate } from '@/lib/utils';

export const ConversionHistoryList: React.FC = () => {
  const history = useConversionStore((s) => s.history);
  const clearHistory = useConversionStore((s) => s.clearHistory);
  const loadHistoryFromStorage = useConversionStore((s) => s.loadHistoryFromStorage);
  const reconvertFromHistory = useConversionStore((s) => s.reconvertFromHistory);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  if (history.length === 0) return null;

  return (
    <div className="mt-12 bg-card border border-border rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Conversion History</h3>
            <p className="text-xs text-muted-foreground">Recent transcode tasks & re-download links</p>
          </div>
        </div>

        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-muted-foreground hover:text-rose-500"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          <span>Clear</span>
        </ForgeButton>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
        {history.map((item) => {
          const sourceFormat = fileRegistry.getFormat(item.sourceExtension);
          const otherTargets = sourceFormat?.conversionTargets
            .filter((t) => t.toLowerCase() !== item.targetExtension.toLowerCase())
            .slice(0, 5) || [];

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1.5 font-mono font-bold uppercase shrink-0">
                  <span className="text-violet-400">.{item.sourceExtension}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/60" />
                  <span className="text-pink-400">.{item.targetExtension}</span>
                </div>

                <div className="min-w-0 truncate">
                  <span className="text-foreground font-medium truncate block max-w-[220px]">
                    {truncate(item.outputName, 28)}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    {formatFileSize(item.outputSizeBytes)} • {item.durationMs}ms
                  </span>
                </div>
              </div>

              {/* Actions & Shortcut */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* Re-download button */}
                {item.downloadUrl && (
                  <a href={item.downloadUrl} download={item.outputName} className="inline-flex">
                    <ForgeButton variant="secondary" size="sm" className="h-8 px-2.5 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      <span>Download</span>
                    </ForgeButton>
                  </a>
                )}

                {/* "Convert to another format" dropdown */}
                {otherTargets.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                      }
                      className="h-8 px-2.5 text-xs inline-flex items-center gap-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer transition-colors"
                    >
                      <RotateCw className="w-3 h-3 text-violet-400" />
                      <span>Convert To</span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </button>

                    <AnimatePresence>
                      {openDropdownId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          className="absolute right-0 top-9 w-40 bg-card border border-border rounded-xl shadow-xl p-1 z-20 flex flex-col gap-0.5"
                        >
                          <span className="text-[10px] font-bold uppercase text-muted-foreground px-2 py-1">
                            Available Targets
                          </span>
                          {otherTargets.map((target) => (
                            <button
                              key={target}
                              type="button"
                              onClick={() => {
                                reconvertFromHistory(item, target);
                                setOpenDropdownId(null);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase text-foreground hover:bg-violet-500/20 transition-colors cursor-pointer"
                            >
                              .{target}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
