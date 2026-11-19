'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Download,
  RotateCw,
  Trash2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { useConversionStore } from '@/lib/stores/conversion-store';
import { fileRegistry } from '@fileforge/file-registry';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { formatFileSize, formatDuration, cn, truncate } from '@/lib/utils';

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
    <div className="mt-12 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Conversion History</h3>
            <p className="text-xs text-white/40">Recent transcode tasks & re-download links</p>
          </div>
        </div>

        <SakugaButton
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-white/40 hover:text-rose-400"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          <span>Clear</span>
        </SakugaButton>
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1.5 font-mono font-bold uppercase shrink-0">
                  <span className="text-violet-400">.{item.sourceExtension}</span>
                  <ArrowRight className="w-3 h-3 text-white/30" />
                  <span className="text-pink-400">.{item.targetExtension}</span>
                </div>

                <div className="min-w-0 truncate">
                  <span className="text-white font-medium truncate block max-w-[220px]">
                    {truncate(item.outputName, 28)}
                  </span>
                  <span className="text-white/40 text-[11px]">
                    {formatFileSize(item.outputSizeBytes)} • {item.durationMs}ms
                  </span>
                </div>
              </div>

              {/* Actions & Shortcut */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* Re-download button */}
                {item.downloadUrl && (
                  <a href={item.downloadUrl} download={item.outputName} className="inline-flex">
                    <SakugaButton variant="secondary" size="sm" className="h-8 px-2.5 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      <span>Download</span>
                    </SakugaButton>
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
                      className="h-8 px-2.5 text-xs inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 cursor-pointer transition-colors"
                    >
                      <RotateCw className="w-3 h-3 text-violet-400" />
                      <span>Convert To</span>
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    </button>

                    <AnimatePresence>
                      {openDropdownId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          className="absolute right-0 top-9 w-40 bg-[#161622] border border-white/15 rounded-xl shadow-xl p-1 z-20 flex flex-col gap-0.5"
                        >
                          <span className="text-[10px] font-bold uppercase text-white/30 px-2 py-1">
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
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase text-gray-200 hover:bg-violet-600/30 hover:text-white transition-colors cursor-pointer"
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
