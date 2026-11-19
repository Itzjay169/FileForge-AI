'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Zap,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  Code,
  Shield,
  ShieldCheck,
  Scale,
  CreditCard,
  HelpCircle,
  Wand2,
  X
} from 'lucide-react';
import { useReducedMotion } from '@/lib/hooks';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState('');

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === 'Escape' && isOpen)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  const handleSelect = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#12121c] border border-white/20 rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden z-10"
          >
            <Command
              className="w-full flex flex-col focus:outline-none"
              loop
            >
              {/* Search Bar Input */}
              <div className="flex items-center px-4 border-b border-white/10 gap-3">
                <Search className="w-5 h-5 text-violet-400 shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search file formats, actions, tools..."
                  className="w-full h-14 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none font-sans"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Command List */}
              <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="py-8 text-center text-xs text-gray-400">
                  No actions or file formats found for &quot;{search}&quot;.
                </Command.Empty>

                <Command.Group heading="Studio & Tools" className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider px-2 py-1.5">
                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/transparency'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Content Authenticity & Transparency Studio (C2PA, Watermarks, AI Labeling)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/admin/compliance'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30 font-medium"
                  >
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Compliance & Legal Moderation Admin Queue</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/editor'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30 font-medium"
                  >
                    <Wand2 className="w-4 h-4 text-violet-400" />
                    <span>File Editor & AI Assistant (Images, PDFs, Media, AI Plans)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/convert'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30 font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Universal Converter (100+ Compatible Formats)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/studio'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30 font-medium"
                  >
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>Launch FileForge Studio (Upload, Compress, Convert)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/formats?category=images'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30"
                  >
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>Compress & Convert Images (PNG, JPG, WebP, AVIF, HEIC)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/formats?category=documents'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30"
                  >
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span>Document Processing (PDF, DOCX, EPUB, RTF)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/formats?category=video'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30"
                  >
                    <Film className="w-4 h-4 text-purple-400" />
                    <span>Video Transcoding & Rate Control (MP4, MOV, MKV, WebM)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/formats?category=audio'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30"
                  >
                    <Music className="w-4 h-4 text-cyan-400" />
                    <span>Audio Compression & Stems (MP3, WAV, FLAC, AAC)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/formats?category=cad3d'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-violet-600/30"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>3D Mesh & CAD Models (OBJ, GLB, STL, STEP)</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Navigation" className="text-[11px] font-semibold text-pink-400 uppercase tracking-wider px-2 py-1.5 mt-2">
                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/formats'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-pink-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-pink-600/30"
                  >
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>All Supported Formats Explorer (100+ extensions)</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => router.push('/#pricing'))}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-200 hover:bg-pink-600/20 hover:text-white cursor-pointer transition-colors aria-selected:bg-pink-600/30"
                  >
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span>View Pricing Plans (Free, Pro, Team)</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer Guide */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-black/30 border-t border-white/5 text-[11px] text-gray-400 font-mono">
                <span>Navigate with <kbd className="bg-white/10 px-1 py-0.5 rounded">↑</kbd> <kbd className="bg-white/10 px-1 py-0.5 rounded">↓</kbd></span>
                <span>Select with <kbd className="bg-white/10 px-1 py-0.5 rounded">↵</kbd></span>
                <span>Close with <kbd className="bg-white/10 px-1 py-0.5 rounded">esc</kbd></span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
