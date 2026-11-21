'use client';

import { ForgeButton, ForgeInput } from '@/components/sakuga';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FolderOpen, Camera, Link2, X } from 'lucide-react';
import { useUploadStore } from '@/lib/stores/upload-store';
import { useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Directory traversal helper
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Format badge chips
// ---------------------------------------------------------------------------

const FORMAT_BADGES = ['.MP4', '.HEIC', '.PDF', '.DOCX', '.WAV', '.OBJ'] as const;

// ---------------------------------------------------------------------------
// Sakuga glow keyframes
// ---------------------------------------------------------------------------

const glowPulse = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0.6, 0],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const iconBounce = {
  hover: { y: [0, -6, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const StudioDropzone: React.FC = () => {
  const uploadStore = useUploadStore();
  const prefersReduced = useReducedMotion();

  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // ---- Paste listener ----
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.files;
      if (items && items.length > 0) {
        uploadStore.addFiles(Array.from(items));
      }
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [uploadStore]);

  // ---- Drag handlers ----
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
                traverseDirectory(entry as FileSystemDirectoryEntry).then(
                  (files) => {
                    allFiles.push(...files);
                  },
                ),
              );
            } else if (entry.isFile) {
              promises.push(
                new Promise<void>((resolve, reject) => {
                  (entry as FileSystemFileEntry).file((f) => {
                    allFiles.push(f);
                    resolve();
                  }, reject);
                }),
              );
            }
          }
        }

        await Promise.all(promises);

        if (allFiles.length > 0) {
          uploadStore.addFiles(allFiles);
          return;
        }
      }

      // Fallback: flat file list
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadStore.addFiles(Array.from(files));
      }
    },
    [uploadStore],
  );

  // ---- Input change handlers ----
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadStore.addFiles(Array.from(files));
      }
      e.target.value = '';
    },
    [uploadStore],
  );

  const handleUrlImport = useCallback(() => {
    const trimmed = importUrl.trim();
    if (trimmed) {
      uploadStore.importUrl(trimmed);
      setImportUrl('');
      setShowUrlModal(false);
    }
  }, [importUrl, uploadStore]);

  return (
    <div
      className={cn(
        'relative bg-card border border-border shadow-sm rounded-3xl p-6',
      )}
    >
      {/* ---- Animated glow border (dragover) ---- */}
      <AnimatePresence>
        {isDragOver && !prefersReduced && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.35))',
              filter: 'blur(18px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* ---- Drop zone ---- */}
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
          'relative flex flex-col items-center justify-center gap-4',
          'rounded-2xl px-6 py-10 cursor-pointer transition-colors duration-200',
          'border-2 border-dashed',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
        )}
      >
        {/* Upload icon */}
        <motion.div
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-2xl',
            'bg-gradient-to-br from-violet-600 to-pink-500',
            'shadow-lg shadow-violet-500/25',
          )}
          whileHover={prefersReduced ? {} : iconBounce.hover}
        >
          <UploadCloud className="w-7 h-7 text-white" />
        </motion.div>

        {/* Animated glow halo behind icon */}
        {!prefersReduced && (
          <motion.div
            className="absolute top-8 w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/40 to-pink-500/40 blur-2xl pointer-events-none"
            {...glowPulse}
          />
        )}

        {/* Text */}
        <div className="text-center space-y-1.5">
          <p className="text-sm font-medium text-foreground">
            Drop files here or{' '}
            <span className="text-primary font-semibold underline underline-offset-2">
              click to browse
            </span>
          </p>
          <p className="text-xs text-muted-foreground">Up to 2 GB free</p>
        </div>

        {/* Format badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
          {FORMAT_BADGES.map((badge) => (
            <span
              key={badge}
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono',
                'bg-muted text-muted-foreground border border-border',
              )}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* ---- Hidden inputs ---- */}
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

      {/* ---- Action buttons row ---- */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => folderInputRef.current?.click()}
          className="text-muted-foreground hover:text-foreground"
        >
          <FolderOpen className="w-4 h-4 mr-1.5" />
          Browse Folder
        </ForgeButton>

        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
          className="text-muted-foreground hover:text-foreground"
        >
          <Camera className="w-4 h-4 mr-1.5" />
          Camera
        </ForgeButton>

        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard
              .read()
              .then(async (clipboardItems) => {
                const files: File[] = [];
                for (const item of clipboardItems) {
                  for (const type of item.types) {
                    if (type.startsWith('image/') || type.startsWith('video/')) {
                      const blob = await item.getType(type);
                      files.push(
                        new File([blob], `pasted.${type.split('/')[1]}`, {
                          type,
                        }),
                      );
                    }
                  }
                }
                if (files.length > 0) uploadStore.addFiles(files);
              })
              .catch(() => {
                /* clipboard access denied – noop */
              });
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <UploadCloud className="w-4 h-4 mr-1.5" />
          Paste
        </ForgeButton>

        <ForgeButton
          variant="ghost"
          size="sm"
          onClick={() => setShowUrlModal(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Link2 className="w-4 h-4 mr-1.5" />
          URL Import
        </ForgeButton>
      </div>

      {/* ---- URL import modal ---- */}
      <AnimatePresence>
        {showUrlModal && (
          <motion.div
            className={cn(
              'mt-4 p-4 rounded-2xl',
              'bg-card border border-border shadow-md',
            )}
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Import from URL</p>
              <button
                onClick={() => {
                  setShowUrlModal(false);
                  setImportUrl('');
                }}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <ForgeInput
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUrlImport();
                }}
              />
              <ForgeButton
                size="sm"
                onClick={handleUrlImport}
                disabled={!importUrl.trim()}
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
