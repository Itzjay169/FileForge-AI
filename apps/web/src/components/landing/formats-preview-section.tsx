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
  ArrowRight
} from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const FormatsPreviewSection: React.FC = () => {
  const categories = [
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      sample: 'PDF, DOCX, EPUB, RTF, ODT, PAGES, DJVU',
      count: '24 formats'
    },
    {
      id: 'images',
      name: 'Images & RAW',
      icon: ImageIcon,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      sample: 'PNG, JPG, WebP, AVIF, HEIC, PSD, SVG, RAW',
      count: '28 formats'
    },
    {
      id: 'video',
      name: 'Video & Motion',
      icon: Film,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      sample: 'MP4, MOV, MKV, WebM, AVI, FLV, M2TS',
      count: '18 formats'
    },
    {
      id: 'audio',
      name: 'Audio & Stems',
      icon: Music,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      sample: 'MP3, WAV, FLAC, AAC, M4A, OGG, OPUS, ALAC',
      count: '16 formats'
    },
    {
      id: 'spreadsheets',
      name: 'Spreadsheets',
      icon: Table2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      sample: 'XLSX, CSV, ODS, TSV, XLSM, XLSB, NUMBERS',
      count: '14 formats'
    },
    {
      id: 'presentations',
      name: 'Presentations',
      icon: Presentation,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      sample: 'PPTX, KEY, ODP, PPSX, POTX, FODP',
      count: '12 formats'
    },
    {
      id: 'code',
      name: 'Code & Structured',
      icon: Code,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      sample: 'HTML, CSS, JS, TS, JSON, YAML, PY, RS, GO',
      count: '32 formats'
    },
    {
      id: 'archives',
      name: 'Archives & Images',
      icon: Archive,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      sample: 'ZIP, 7Z, RAR, TAR.GZ, BZ2, ISO, DMG',
      count: '14 formats'
    },
    {
      id: 'fonts',
      name: 'Typography Fonts',
      icon: Type,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      sample: 'TTF, OTF, WOFF, WOFF2, EOT, FON',
      count: '6 formats'
    },
    {
      id: 'cad3d',
      name: '3D & Engineering',
      icon: Box,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      sample: 'OBJ, STL, GLB, GLTF, FBX, STEP, DWG',
      count: '16 formats'
    },
    {
      id: 'executables',
      name: 'Executables & System',
      icon: Cpu,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      sample: 'EXE, MSI, APK, DEB, RPM, DLL, SO, DYLIB',
      count: '14 formats'
    },
    {
      id: 'databases',
      name: 'Databases & Dumps',
      icon: Database,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      sample: 'SQL, SQLite, DB, ACCDB, DBF, Protobuf',
      count: '10 formats'
    }
  ];

  return (
    <section className="py-24 relative bg-[#09090e] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 inline-block mb-3">
              Universal Ecosystem
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              12 Categories. 100+ Formats.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl">
              From web media and ProRes video to AutoCAD engineering prints and SQLite stores—every format is backed by dedicated, isolated processors.
            </p>
          </div>

          <Link href="/formats">
            <SakugaButton variant="default" size="default">
              <span>Launch Full Formats Explorer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </SakugaButton>
          </Link>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <ScrollReveal key={cat.id} delay={i * 0.04}>
                <Link
                  href={`/formats?category=${cat.id}`}
                  className="block h-full bg-[#12121c] border border-white/10 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/20 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 font-medium">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs font-mono text-gray-400 line-clamp-1">
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
