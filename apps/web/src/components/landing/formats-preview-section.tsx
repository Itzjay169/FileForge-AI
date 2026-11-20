'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Table2,
  Presentation,
  Code,
  Archive,
  Type,
  Box,
  Cpu,
  Database,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const FormatsPreviewSection: React.FC = () => {
  const categories = [
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
      color: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
      sample: 'PDF, DOCX, EPUB, RTF, ODT, PAGES, DJVU',
      count: '24 formats'
    },
    {
      id: 'images',
      name: 'Images & RAW',
      icon: ImageIcon,
      color: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
      sample: 'PNG, JPG, WebP, AVIF, HEIC, PSD, SVG, RAW',
      count: '28 formats'
    },
    {
      id: 'video',
      name: 'Video & Motion',
      icon: Film,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      sample: 'MP4, MOV, MKV, WebM, AVI, FLV, M2TS',
      count: '18 formats'
    },
    {
      id: 'audio',
      name: 'Audio & Stems',
      icon: Music,
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      sample: 'MP3, WAV, FLAC, AAC, M4A, OGG, OPUS, ALAC',
      count: '16 formats'
    },
    {
      id: 'spreadsheets',
      name: 'Spreadsheets',
      icon: Table2,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      sample: 'XLSX, CSV, ODS, TSV, XLSM, XLSB, NUMBERS',
      count: '14 formats'
    },
    {
      id: 'presentations',
      name: 'Presentations',
      icon: Presentation,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      sample: 'PPTX, KEY, ODP, PPSX, POTX, FODP',
      count: '12 formats'
    },
    {
      id: 'code',
      name: 'Code & Data',
      icon: Code,
      color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      sample: 'HTML, CSS, JS, TS, JSON, YAML, PY, RS, GO',
      count: '32 formats'
    },
    {
      id: 'archives',
      name: 'Solid Containers',
      icon: Archive,
      color: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
      sample: 'ZIP, 7Z, RAR, TAR.GZ, BZ2, ISO, DMG',
      count: '14 formats'
    },
    {
      id: 'fonts',
      name: 'Typography Fonts',
      icon: Type,
      color: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      sample: 'TTF, OTF, WOFF, WOFF2, EOT, FON',
      count: '6 formats'
    },
    {
      id: 'cad3d',
      name: '3D & Engineering',
      icon: Box,
      color: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
      sample: 'OBJ, STL, GLB, GLTF, FBX, STEP, DWG',
      count: '16 formats'
    },
    {
      id: 'executables',
      name: 'Binary Containers',
      icon: Cpu,
      color: 'text-red-400 bg-red-500/15 border-red-500/30',
      sample: 'EXE, MSI, APK, DEB, RPM, DLL, SO, DYLIB',
      count: '14 formats'
    },
    {
      id: 'databases',
      name: 'Databases & Schemas',
      icon: Database,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      sample: 'SQL, SQLite, DB, ACCDB, DBF, Protobuf',
      count: '10 formats'
    }
  ];

  return (
    <section className="py-24 relative bg-[var(--sk-bg)] border-b-2 border-[var(--sk-line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Strip with Manga Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b-2 border-[var(--sk-border)] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-3 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>[ACT 04 // CODEC ENCYCLOPEDIA]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
              12 Categories. 200+ Formats.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--sk-text-muted)] max-w-xl font-medium">
              From web media and ProRes master reels to AutoCAD engineering prints and SQLite stores—every format is handled by dedicated isolated processing workers.
            </p>
          </div>

          <Link href="/formats">
            <ForgeButton variant="primary" size="md" className="shadow-[4px_5px_0_rgba(255,95,162,0.4)]">
              <span>Launch Formats Explorer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </ForgeButton>
          </Link>
        </div>

        {/* 12 Categories Grid with Ink Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <ScrollReveal key={cat.id} delay={i * 0.03}>
                <Link
                  href={`/formats?category=${cat.id}`}
                  className="block h-full bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-2xl p-5 transition-all duration-200 hover:border-[var(--sk-acc)] hover:shadow-[4px_6px_0_rgba(255,95,162,0.35)] hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--sk-acc)] font-bold">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white uppercase font-sans mb-1 group-hover:text-pink-300 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs font-mono text-[var(--sk-text-muted)] truncate">
                    {cat.sample}
                  </p>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
