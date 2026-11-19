'use client';

import { ForgeButton, forgeToast } from '@/components/sakuga';
import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CommandPalette } from '@/components/layout/command-palette';
import { MetadataInspectorCard } from '@/components/compliance/metadata-inspector-card';
import { WatermarkStudioCard } from '@/components/compliance/watermark-studio-card';
import { AbuseReportModal } from '@/components/compliance/abuse-report-modal';
import { MetadataInspectionReport } from '@fileforge/shared';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  AlertTriangle,
  Download,
  Sparkles,
  Lock,
  Stamp,
  HelpCircle,
  AlertOctagon,
  File
} from 'lucide-react';
import { formatBytes } from '@fileforge/shared';

export default function TransparencyPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [abuseModalOpen, setAbuseModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionReport, setInspectionReport] = useState<MetadataInspectionReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runInspection = async (file: File) => {
    setActiveFile(file);
    setIsInspecting(true);
    setInspectionReport(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/compliance/inspect', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect file');
      }

      setInspectionReport(data);
      forgeToast.success('Inspection Complete', `Analyzed provenance and metadata for "${file.name}"`);
    } catch (err: any) {
      forgeToast.error('Inspection Failed', err.message);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      runInspection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      runInspection(e.target.files[0]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#f0eee9] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
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
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs font-medium text-violet-200">
              Provenance & Watermark Transparency • Ethical AI & DMCA Compliance
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Content Authenticity & Transparency Studio
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Inspect EXIF and C2PA credentials, disclose AI-generated provenance, apply author watermarks, or submit verified ownership requests.
          </p>
        </motion.div>

        {/* Upload Zone */}
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
              Drop an Image, PDF, Video, or Document to Inspect
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
              Extracts C2PA provenance manifests, EXIF metadata, AI generator signatures, and rights attribution markers.
            </p>
            <ForgeButton variant="secondary" size="sm">
              Browse From Computer
            </ForgeButton>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active File Stage */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#12121c] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                    {activeFile.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatBytes(activeFile.size)} • {activeFile.type || 'binary'}
                  </div>
                </div>
              </div>

              <ForgeButton variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveFile(null);
                  setInspectionReport(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Change File
              </ForgeButton>
            </div>

            {/* 1. Metadata & Authenticity Inspection Card */}
            <MetadataInspectorCard
              report={inspectionReport}
              isLoading={isInspecting}
            />

            {/* 2. Watermarking, AI Disclosure & Verified Ownership Studio */}
            <WatermarkStudioCard
              file={activeFile}
              fileHash={inspectionReport?.sha256Hash}
              onOperationComplete={() => {
                if (activeFile) runInspection(activeFile);
              }}
            />
          </div>
        )}

        {/* Policy Principles & Abuse Reporting Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#12121c] border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                FileForge Content Authenticity Principles
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                We design tools that empower creators while preventing deceptive practices and copyright infringement.
              </p>
            </div>

            <ForgeButton variant="ghost"
              size="sm"
              onClick={() => setAbuseModalOpen(true)}
              className="text-xs border-red-500/30 text-red-300 hover:bg-red-950/20"
            >
              <AlertOctagon className="w-3.5 h-3.5 mr-1 text-red-400" />
              Report Rights Abuse
            </ForgeButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-gray-400">
            <div>
              <span className="font-semibold text-gray-200 block mb-1">
                1. No Evasion Assistance
              </span>
              FileForge strictly does not offer tools to bypass plagiarism detection, strip copyright attribution deceptively, or crack DRM.
            </div>
            <div>
              <span className="font-semibold text-gray-200 block mb-1">
                2. Transparent Provenance
              </span>
              We support standard C2PA and IPTC digital source designations, allowing creators to proudly disclose their AI workflows.
            </div>
            <div>
              <span className="font-semibold text-gray-200 block mb-1">
                3. Gated Ownership Removal
              </span>
              Watermark reconstruction is strictly restricted to certified copyright holders and licensees with audit logs and legal certification.
            </div>
          </div>
        </div>
      </main>

      <AbuseReportModal
        isOpen={abuseModalOpen}
        onClose={() => setAbuseModalOpen(false)}
        targetFileHash={inspectionReport?.sha256Hash}
      />

      <Footer />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
