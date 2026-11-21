'use client';

import { ForgeButton, forgeToast } from '@/components/sakuga';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  X,
  RotateCw,
  Hash,
  Lock,
  FileSearch,
  Minimize2,
  Check
} from 'lucide-react';
import { PdfToolMode, PdfToolOptions } from '@fileforge/shared';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface PdfStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  onSaved?: (result: unknown) => void;
}

const MODES: Array<{ id: PdfToolMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }> = [
  { id: 'compress', label: 'Compress', icon: Minimize2, desc: 'Optimize streams & strip redundant objects' },
  { id: 'rotate', label: 'Rotate', icon: RotateCw, desc: 'Rotate pages 90°, 180°, or 270°' },
  { id: 'page_numbers', label: 'Numbering', icon: Hash, desc: 'Stamp "Page X of Y" footer' },
  { id: 'password', label: 'Protect', icon: Lock, desc: 'Encrypt document with access password' },
  { id: 'ocr', label: 'OCR Text', icon: FileSearch, desc: 'Extract uncompressed text streams' }
];

export const PdfStudioModal: React.FC<PdfStudioModalProps> = ({
  isOpen,
  onClose,
  file,
  onSaved
}) => {
  const prefersReduced = useReducedMotion();
  const [activeMode, setActiveMode] = useState<PdfToolMode>('compress');
  const [rotateDegrees, setRotateDegrees] = useState<90 | 180 | 270>(90);
  const [password, setPassword] = useState('');
  const [pageNumberFormat, setPageNumberFormat] = useState<'PAGE_X' | 'PAGE_X_OF_Y'>('PAGE_X_OF_Y');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResultText, setOcrResultText] = useState<string | null>(null);

  if (!isOpen || !file) return null;

  const handleExecute = async () => {
    setIsProcessing(true);
    setOcrResultText(null);

    try {
      const options: PdfToolOptions = {
        mode: activeMode,
        rotateDegrees: activeMode === 'rotate' ? rotateDegrees : undefined,
        password: activeMode === 'password' ? password : undefined,
        pageNumberFormat: activeMode === 'page_numbers' ? pageNumberFormat : undefined
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const res = await fetch('/api/editor/pdf', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'PDF tool failed');

      if (activeMode === 'ocr' && json.data.extractedText) {
        setOcrResultText(json.data.extractedText);
        forgeToast.success('OCR Transcript Generated');
      } else {
        forgeToast.success('PDF Processed Successfully', json.data.outputName);
        onSaved?.(json.data);
        onClose();
      }
    } catch (err: unknown) {
      forgeToast.error('PDF Operation Failed', (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">PDF Toolkit & Studio</h3>
                <p className="text-xs text-muted-foreground">{file.name}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-5 gap-2 py-4 border-b border-border">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isSelected = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveMode(m.id);
                    setOcrResultText(null);
                  }}
                  className={cn(
                    'p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all',
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500/60 text-primary font-bold'
                      : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Specific Config Area */}
          <div className="py-5 space-y-4 flex-1 overflow-y-auto pr-1">
            {activeMode === 'rotate' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground block uppercase">
                  Rotation Angle
                </label>
                <div className="flex gap-2">
                  {([90, 180, 270] as const).map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotateDegrees(deg)}
                      className={cn(
                        'flex-1 h-11 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-colors',
                        rotateDegrees === deg
                          ? 'bg-violet-600 text-white border-violet-400'
                          : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {deg}° Clockwise
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMode === 'page_numbers' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground block uppercase">
                  Stamp Format
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPageNumberFormat('PAGE_X_OF_Y')}
                    className={cn(
                      'flex-1 h-11 rounded-xl border text-xs font-mono cursor-pointer transition-colors',
                      pageNumberFormat === 'PAGE_X_OF_Y'
                        ? 'bg-violet-600 text-white border-violet-400 font-bold'
                        : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Page 1 of 10
                  </button>

                  <button
                    type="button"
                    onClick={() => setPageNumberFormat('PAGE_X')}
                    className={cn(
                      'flex-1 h-11 rounded-xl border text-xs font-mono cursor-pointer transition-colors',
                      pageNumberFormat === 'PAGE_X'
                        ? 'bg-violet-600 text-white border-violet-400 font-bold'
                        : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Page 1
                  </button>
                </div>
              </div>
            )}

            {activeMode === 'password' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block uppercase">
                  Encryption Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access password to protect document..."
                  className="w-full h-11 px-4 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            )}

            {activeMode === 'compress' && (
              <div className="p-4 bg-muted/40 border border-border rounded-2xl space-y-1">
                <span className="text-xs font-semibold text-foreground">Stream Sanitization</span>
                <p className="text-xs text-muted-foreground">
                  Flattens redundant XML metadata, optimizes content streams, and cleans unreferenced objects.
                </p>
              </div>
            )}

            {activeMode === 'ocr' && (
              <div className="space-y-3">
                <div className="p-4 bg-muted/40 border border-border rounded-2xl">
                  <span className="text-xs font-semibold text-foreground">OCR Text Extraction</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Parses font glyph mappings and uncompressed text streams into clean text.
                  </p>
                </div>

                {ocrResultText && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono text-emerald-500 font-bold">
                      Extracted Transcript Preview:
                    </span>
                    <pre className="p-3 bg-muted/60 border border-border rounded-xl text-xs text-foreground font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
                      {ocrResultText}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <ForgeButton variant="ghost" size="sm" onClick={onClose}>
              <span>Cancel</span>
            </ForgeButton>

            <ForgeButton variant="primary"
              size="sm"
              onClick={handleExecute}
              isLoading={isProcessing}
              disabled={isProcessing || (activeMode === 'password' && !password.trim())}
            >
              <Check className="w-4 h-4 mr-1.5" />
              <span>Apply {MODES.find((m) => m.id === activeMode)?.label}</span>
            </ForgeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
