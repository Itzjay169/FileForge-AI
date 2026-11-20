'use client';

import { ForgeButton, ForgeInput } from '@/components/sakuga';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FolderOpen,
  Camera,
  Link2,
  X,
  Sparkles
} from 'lucide-react';
import { useConversionStore } from '@/lib/stores/conversion-store';
import { useUploadStore } from '@/lib/stores/upload-store';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const POPULAR_TARGETS = ['pdf', 'webp', 'png', 'jpg', 'mp4', 'mp3', 'csv', 'json', 'zip'];

async function traverseDirectory(entry: FileSystemDirectoryEntry): Promise<File[]> {
  const reader = entry.createReader();
  const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });
  const files: File[] = [];
  for (const e of entries) {
    if (e.isFile) {
      const file = await new Promise<File>((resolve, reject) => {
        (e as FileSystemFileEntry).file(resolve, reject);
      });
      files.push(file);
    } else if (e.isDirectory) {
      files.push(...(await traverseDirectory(e as FileSystemDirectoryEntry)));
    }
  }
  return files;
}

export const ConversionDropzone: React.FC = () => {
  const conversionStore = useConversionStore();
  const prefersReduced = useReducedMotion();

  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Paste listener
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.files;
      if (items && items.length > 0) {
        conversionStore.addFiles(Array.from(items));
      }
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [conversionStore]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOver(false);

      const items = e.dataTransfer.items;
      if (items && items.length > 0) {
        const allFiles: File[] = [];
        const promises: Promise<void>[] = [];

        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry?.();
          if (entry) {
            if (entry.isDirectory) {
              promises.push(
                traverseDirectory(entry as FileSystemDirectoryEntry).then((files) => {
                  allFiles.push(...files);
                })
              );
            } else if (entry.isFile) {
              promises.push(
                new Promise<void>((resolve, reject) => {
                  (entry as FileSystemFileEntry).file((f) => {
                    allFiles.push(f);
                    resolve();
                  }, reject);
                })
              );
            }
          }
        }

        await Promise.all(promises);
        if (allFiles.length > 0) {
          conversionStore.addFiles(allFiles);
          return;
        }
      }

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        conversionStore.addFiles(Array.from(files));
      }
    },
    [conversionStore]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        conversionStore.addFiles(Array.from(files));
      }
      e.target.value = '';
    },
    [conversionStore]
  );

  return (
    <div className="relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15 rounded-3xl p-6 mb-6">
      {/* Animated glow on dragover */}
      <AnimatePresence>
        {isDragOver && !prefersReduced && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.35))',
              filter: 'blur(20px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Target Quick-Pills Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-white/80">
            Convert All Files Into:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TARGETS.map((target) => {
            const isSelected = conversionStore.globalTargetFormat === target;
            return (
              <button
                key={target}
                type="button"
                onClick={() => conversionStore.setGlobalTargetFormat(target)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer',
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30 border border-violet-400'
                    : 'bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                )}
              >
                .{target}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drop area */}
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-10 cursor-pointer transition-colors duration-200 border-2 border-dashed',
          isDragOver
            ? 'border-violet-400/60 bg-violet-500/5'
            : 'border-white/20 hover:border-white/30'
        )}
      >
        <motion.div
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 shadow-lg shadow-violet-500/25"
          whileHover={prefersReduced ? {} : { y: -4, scale: 1.05 }}
        >
          <UploadCloud className="w-7 h-7 text-white" />
        </motion.div>

        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-white">
            Drop any file to convert, or{' '}
            <span className="text-violet-400 underline underline-offset-4">
              browse files
            </span>
          </p>
          <p className="text-xs text-white/40">
            Automated matrix conversion between 100+ document, image, video, spreadsheet & 3D formats
          </p>
        </div>
      </div>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        capture="environment"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Bottom shortcut buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => folderInputRef.current?.click()}
        >
          <FolderOpen className="w-4 h-4 mr-1.5" />
          <span>Upload Folder</span>
        </ForgeButton>

        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="w-4 h-4 mr-1.5" />
          <span>Camera</span>
        </ForgeButton>

        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => setShowUrlModal(true)}
        >
          <Link2 className="w-4 h-4 mr-1.5" />
          <span>Import URL</span>
        </ForgeButton>
      </div>

      {/* URL Import Modal */}
      <AnimatePresence>
        {showUrlModal && (
          <motion.div
            className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10"
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white/80">Import from URL (SSRF Protected)</p>
              <button
                onClick={() => {
                  setShowUrlModal(false);
                  setImportUrl('');
                }}
                className="p-1 rounded-lg text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <ForgeInput
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://example.com/document.docx"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && importUrl.trim()) {
                    useUploadStore.getState().importUrl(importUrl.trim());
                    setShowUrlModal(false);
                  }
                }}
              />
              <ForgeButton
                size="sm"
                onClick={() => {
                  if (importUrl.trim()) {
                    useUploadStore.getState().importUrl(importUrl.trim());
                    setShowUrlModal(false);
                  }
                }}
              >
                Import
              </ForgeButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
