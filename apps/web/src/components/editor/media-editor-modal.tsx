'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Music,
  X,
  Volume2,
  VolumeX,
  Scissors,
  Image as ImageIcon,
  Check,
  Download,
  Sparkles
} from 'lucide-react';
import { VideoEditOptions, AudioEditOptions } from '@fileforge/shared';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { SakugaSlider } from '@/components/ui/sakuga-slider';
import { SakugaToggle } from '@/components/ui/sakuga-toggle';
import { forgeToast } from '@/components/ui/sakuga-toast';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export interface MediaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  onSaved?: (result: any) => void;
}

export const MediaEditorModal: React.FC<MediaEditorModalProps> = ({
  isOpen,
  onClose,
  file,
  onSaved
}) => {
  const prefersReduced = useReducedMotion();
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(60);
  const [mute, setMute] = useState(false);
  const [extractAudio, setExtractAudio] = useState(false);
  const [resolution, setResolution] = useState<'original' | '1080p' | '720p' | '480p'>('original');
  const [normalizeAudio, setNormalizeAudio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !file) return null;

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isVideo = ['mp4', 'mov', 'mkv', 'webm', 'avi'].includes(ext);
  const isAudio = ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'].includes(ext);

  const handleExecute = async () => {
    setIsProcessing(true);
    try {
      const options = isVideo
        ? ({
            trimStartSec: trimStart > 0 ? trimStart : undefined,
            trimEndSec: trimEnd < 60 ? trimEnd : undefined,
            mute,
            extractAudio,
            audioTargetFormat: 'mp3',
            resolution: resolution !== 'original' ? resolution : undefined
          } as VideoEditOptions)
        : ({
            trimStartSec: trimStart > 0 ? trimStart : undefined,
            trimEndSec: trimEnd < 60 ? trimEnd : undefined,
            normalize: normalizeAudio,
            targetFormat: 'mp3'
          } as AudioEditOptions);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('mediaType', isVideo ? 'video' : 'audio');
      formData.append('options', JSON.stringify(options));

      const res = await fetch('/api/editor/media', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Media processing failed');

      forgeToast.success('Media Edited Successfully', json.data.outputName);
      onSaved?.(json.data);
      onClose();
    } catch (err: any) {
      forgeToast.error('Media Tool Failed', err.message);
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
          className="relative w-full max-w-xl bg-[#12121a] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                {isVideo ? <Film className="w-5 h-5" /> : <Music className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isVideo ? 'Video Editor Studio' : 'Audio Processing Tool'}
                </h3>
                <p className="text-xs text-white/40">{file.name}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Config Controls */}
          <div className="py-5 space-y-5 flex-1 overflow-y-auto pr-1">
            {/* Timeline Trimming */}
            <div className="space-y-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-purple-400" />
                  Timeline Trimming (Seconds)
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {trimStart}s → {trimEnd}s ({trimEnd - trimStart}s duration)
                </span>
              </div>

              <div className="space-y-2">
                <SakugaSlider
                  label="Start Offset"
                  min={0}
                  max={Math.max(0, trimEnd - 1)}
                  step={1}
                  value={trimStart}
                  onChange={(val) => setTrimStart(val)}
                  unit="s"
                />

                <SakugaSlider
                  label="End Timestamp"
                  min={trimStart + 1}
                  max={300}
                  step={1}
                  value={trimEnd}
                  onChange={(val) => setTrimEnd(val)}
                  unit="s"
                />
              </div>
            </div>

            {/* Video-Specific Controls */}
            {isVideo && (
              <>
                <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-white block">Mute Audio Track</span>
                    <span className="text-[11px] text-white/40">Removes sound track completely</span>
                  </div>
                  <SakugaToggle checked={mute} onChange={(val) => setMute(val)} size="sm" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-pink-300 block">Extract Audio Soundtrack</span>
                    <span className="text-[11px] text-white/40">Exports audio track as MP3</span>
                  </div>
                  <SakugaToggle
                    checked={extractAudio}
                    onChange={(val) => setExtractAudio(val)}
                    size="sm"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white/70 block uppercase">
                    Target Resolution
                  </span>
                  <div className="flex gap-2">
                    {(['original', '1080p', '720p', '480p'] as const).map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setResolution(res)}
                        className={cn(
                          'flex-1 h-10 rounded-xl border text-xs font-mono cursor-pointer transition-colors',
                          resolution === res
                            ? 'bg-purple-600 text-white border-purple-400 font-bold'
                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                        )}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Audio-Specific Controls */}
            {isAudio && (
              <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-white block">Normalize Volume</span>
                  <span className="text-[11px] text-white/40">Adjusts peak amplitude to standard -0.5 dB</span>
                </div>
                <SakugaToggle
                  checked={normalizeAudio}
                  onChange={(val) => setNormalizeAudio(val)}
                  size="sm"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <SakugaButton variant="ghost" size="sm" onClick={onClose}>
              <span>Cancel</span>
            </SakugaButton>

            <SakugaButton
              variant="default"
              size="sm"
              onClick={handleExecute}
              isLoading={isProcessing}
              disabled={isProcessing}
              showSuccessCheck
            >
              <Check className="w-4 h-4 mr-1.5" />
              <span>Apply Changes</span>
            </SakugaButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
