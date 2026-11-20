'use client';

import { ForgeButton, forgeToast } from '@/components/sakuga';
import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CommandPalette } from '@/components/layout/command-palette';
import { AiCopilotCard } from '@/components/editor/ai-copilot-card';
import { ImageEditorModal } from '@/components/editor/image-editor-modal';
import { PdfStudioModal } from '@/components/editor/pdf-studio-modal';
import { MediaEditorModal } from '@/components/editor/media-editor-modal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  UploadCloud,
  File,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Download,
  Trash2,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { formatBytes } from '@fileforge/shared';

interface ProcessedResult {
  id: string;
  originalName: string;
  resultName: string;
  url: string;
  originalSize: number;
  resultSize: number;
  toolType: string;
  timestamp: number;
}

export default function EditorPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);

  // Modal controls
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setActiveFile(e.dataTransfer.files[0]);
      forgeToast.success('File Loaded', `Ready to edit "${e.dataTransfer.files[0].name}"`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setActiveFile(e.target.files[0]);
      forgeToast.success('File Loaded', `Ready to edit "${e.target.files[0].name}"`);
    }
  };

  const handleResultAdded = (result: any, toolType: string) => {
    if (!result || !result.url) return;
    const newResult: ProcessedResult = {
      id: Math.random().toString(36).substring(2, 9),
      originalName: activeFile?.name || 'input-file',
      resultName: result.filename || activeFile?.name || 'processed-file',
      url: result.url,
      originalSize: activeFile?.size || 0,
      resultSize: result.size || 0,
      toolType,
      timestamp: Date.now()
    };
    setProcessedResults((prev) => [newResult, ...prev]);
  };

  const fileExtension = activeFile?.name.split('.').pop()?.toLowerCase() || '';

  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'svg'].includes(fileExtension);
  const isPdf = fileExtension === 'pdf';
  const isMedia = ['mp4', 'mkv', 'mov', 'webm', 'avi', 'mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(fileExtension);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-violet-500/10 border border-violet-500/30 backdrop-blur-md mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs font-medium text-violet-200">
              Creative Studio • Smart Toolkits & AI File Assistant
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            File Editor & AI Studio
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Manipulate images, annotate and merge PDFs, trim media, or ask the AI Assistant in natural language to prepare files for any target.
          </p>
        </motion.div>

        {/* Upload Zone / Active File Stage */}
        {!activeFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-violet-500 bg-violet-950/20 shadow-lg shadow-violet-500/20'
                : 'border-white/10 bg-[#12121c]/80 hover:border-violet-500/40 hover:bg-[#12121c]'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-pink-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-violet-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Select or Drop a File to Edit
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
              Supports images (PNG, JPG, WebP), PDFs, videos (MP4, WebM), audio (MP3, WAV), and office documents.
            </p>
            <ForgeButton variant="secondary" size="sm">
              Browse From Computer
            </ForgeButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#12121c] border border-white/15 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl"
          >
            {/* File Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                  {isImage && <ImageIcon className="w-7 h-7" />}
                  {isPdf && <FileText className="w-7 h-7" />}
                  {isMedia && <Film className="w-7 h-7" />}
                  {!isImage && !isPdf && !isMedia && <File className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
                    {activeFile.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{formatBytes(activeFile.size)}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs uppercase px-2 py-0.5 rounded bg-violet-950/50 text-violet-300 font-semibold border border-violet-800/40">
                      {fileExtension}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ForgeButton variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Change File
                </ForgeButton>
              </div>
            </div>

            {/* Quick Specialized Studio Launchers */}
            <div className="pt-6">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">
                Dedicated Creative Toolkits
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {isImage && (
                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-950/20 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-pink-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Image Studio</div>
                        <div className="text-[11px] text-gray-400">Crop, Rotate, Filters, BG Removal</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
                  </button>
                )}

                {isPdf && (
                  <button
                    onClick={() => setPdfModalOpen(true)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-950/20 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-violet-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">PDF Toolkit</div>
                        <div className="text-[11px] text-gray-400">Rotate, Numbers, Passwords, OCR</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
                  </button>
                )}

                {isMedia && (
                  <button
                    onClick={() => setMediaModalOpen(true)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-950/20 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Film className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Media Studio</div>
                        <div className="text-[11px] text-gray-400">Trim, Mute, Extract Audio, Transcode</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
                  </button>
                )}

                {!isImage && !isPdf && !isMedia && (
                  <div className="sm:col-span-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-violet-400" />
                    <span>Specialized studio modal is available for images, PDFs, video, and audio. You can use the AI Assistant below to plan transformations on this document.</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Copilot Card */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <AiCopilotCard
                file={activeFile}
                onPlanExecuted={(res) => handleResultAdded(res, 'AI Assistant')}
              />
            </div>
          </motion.div>
        )}

        {/* Processed Results / Output History */}
        {processedResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-[#12121c] border border-white/10 rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Processed Assets & Downloads
              </h3>
              <span className="text-xs text-gray-400">
                {processedResults.length} ready
              </span>
            </div>

            <div className="space-y-3">
              {processedResults.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 gap-3"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-violet-950/50 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-white truncate">
                        {item.resultName}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span className="text-violet-300 font-semibold">{item.toolType}</span>
                        <span>•</span>
                        <span>{formatBytes(item.resultSize)}</span>
                        {item.originalSize > item.resultSize && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">
                              -{Math.round(((item.originalSize - item.resultSize) / item.originalSize) * 100)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={item.url}
                    download={item.resultName}
                    className="shrink-0"
                  >
                    <ForgeButton variant="primary" size="sm">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download
                    </ForgeButton>
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Studio Modals */}
      <ImageEditorModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        file={activeFile}
        onSaved={(res) => handleResultAdded(res, 'Image Studio')}
      />

      <PdfStudioModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        file={activeFile}
        onSaved={(res) => handleResultAdded(res, 'PDF Toolkit')}
      />

      <MediaEditorModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        file={activeFile}
        onSaved={(res) => handleResultAdded(res, 'Media Studio')}
      />

      <Footer />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
