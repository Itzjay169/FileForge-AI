'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  Sparkles,
  Download,
  Search
} from 'lucide-react';
import { MetadataInspectionReport } from '@fileforge/shared';
import { ForgeButton } from '@/components/sakuga';
import { formatBytes } from '@fileforge/shared';
import { cn } from '@/lib/utils';

export interface MetadataInspectorCardProps {
  report: MetadataInspectionReport | null;
  isLoading?: boolean;
}

export const MetadataInspectorCard: React.FC<MetadataInspectorCardProps> = ({
  report,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'provenance' | 'exif' | 'ai' | 'rights'>('provenance');

  if (isLoading) {
    return (
      <div className="bg-[#12121c] border border-white/10 rounded-3xl p-8 text-center animate-pulse">
        <Search className="w-8 h-8 text-violet-400 mx-auto mb-3 animate-spin" />
        <h3 className="text-base font-semibold text-white">Inspecting Metadata & Provenance...</h3>
        <p className="text-xs text-gray-400 mt-1">
          Parsing EXIF headers, C2PA manifests, IPTC digital source tags, and watermark patterns.
        </p>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const getRiskBadge = () => {
    switch (report.riskRating) {
      case 'VERIFIED_GENUINE':
        return {
          icon: ShieldCheck,
          label: 'C2PA Authenticity Verified',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
        };
      case 'AI_GENERATED_DISCLOSED':
        return {
          icon: Sparkles,
          label: 'Generative AI Content Disclosed',
          color: 'text-violet-400 border-violet-500/30 bg-violet-950/30'
        };
      case 'POTENTIALLY_TAMPERED':
        return {
          icon: AlertTriangle,
          label: 'Watermark / Rights Marker Detected',
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/30'
        };
      case 'UNPROTECTED_STANDARD':
      default:
        return {
          icon: Info,
          label: 'Standard Asset (No C2PA Manifest)',
          color: 'text-gray-300 border-white/15 bg-white/5'
        };
    }
  };

  const badge = getRiskBadge();
  const BadgeIcon = badge.icon;

  const downloadReportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `authenticity-report-${report.filename}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="bg-[#12121c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Header & Risk Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md',
                badge.color
              )}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {formatBytes(report.sizeBytes)}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white truncate max-w-md">
            {report.filename}
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            {report.authenticityExplanation}
          </p>
        </div>

        <ForgeButton variant="secondary" size="sm" onClick={downloadReportJson}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Report
        </ForgeButton>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 pb-4 border-b border-white/10 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('provenance')}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
            activeTab === 'provenance'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          )}
        >
          C2PA & Provenance
        </button>
        <button
          onClick={() => setActiveTab('exif')}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
            activeTab === 'exif'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          )}
        >
          EXIF & Camera Data
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
            activeTab === 'ai'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          )}
        >
          AI Indicators ({report.aiDisclosure.detectedGenerators.length})
        </button>
        <button
          onClick={() => setActiveTab('rights')}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
            activeTab === 'rights'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          )}
        >
          Rights & Watermarks
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-6">
        {/* Tab 1: C2PA & Provenance */}
        {activeTab === 'provenance' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  C2PA Content Credentials Manifest
                </span>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded',
                    report.c2pa.hasC2paManifest
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400'
                  )}
                >
                  {report.c2pa.hasC2paManifest ? 'MANIFEST DETECTED' : 'NONE DETECTED'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {report.c2pa.hasC2paManifest
                  ? 'Cryptographic assertions, claim generator, and creation history verify this file origin.'
                  : 'No Content Credentials (C2PA) cryptographic manifest was found embedded in this file structure.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block mb-1">SHA-256 Fingerprint:</span>
                <span className="font-mono text-[11px] text-gray-200 break-all">
                  {report.sha256Hash}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block mb-1">Detected MIME Type:</span>
                <span className="font-semibold text-gray-200">{report.mimeType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: EXIF & Camera Data */}
        {activeTab === 'exif' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block">Camera Make:</span>
                <span className="font-semibold text-white mt-1 block">
                  {report.exif.make || 'Not recorded'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block">Camera Model:</span>
                <span className="font-semibold text-white mt-1 block">
                  {report.exif.model || 'Not recorded'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block">Software / Editor:</span>
                <span className="font-semibold text-white mt-1 block">
                  {report.exif.software || report.document.creator || 'None listed'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block">Original Date:</span>
                <span className="font-semibold text-white mt-1 block">
                  {report.exif.dateTimeOriginal || report.document.creationDate || 'Unknown'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block">Canvas Dimensions:</span>
                <span className="font-semibold text-white mt-1 block">
                  {report.rawTags.width && report.rawTags.height
                    ? `${report.rawTags.width} × ${report.rawTags.height} px`
                    : 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <span className="text-gray-400 block">Color Space / Channels:</span>
                <span className="font-semibold text-white mt-1 block">
                  {report.rawTags.space || 'Standard'} ({report.rawTags.channels || 'N/A'} channels)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Indicators */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Generative AI Metadata Signatures
                </span>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded',
                    report.aiDisclosure.isAiGeneratedOrAssisted
                      ? 'bg-violet-950/60 text-violet-300 border border-violet-500/30'
                      : 'bg-gray-800 text-gray-400'
                  )}
                >
                  {report.aiDisclosure.isAiGeneratedOrAssisted ? 'AI INDICATORS PRESENT' : 'NO AI MARKERS'}
                </span>
              </div>

              {report.aiDisclosure.detectedGenerators.length > 0 ? (
                <div className="space-y-2 mt-3">
                  <p className="text-xs text-gray-300">
                    The following generator tools or synthetic media signatures were detected in the file stream:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {report.aiDisclosure.detectedGenerators.map((gen, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-pink-950/30 border border-pink-500/30 text-xs text-pink-300 font-semibold"
                      >
                        {gen}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    Source Tag: <span className="font-mono text-gray-300">{report.aiDisclosure.disclosureSource}</span> • Confidence: {Math.round(report.aiDisclosure.confidence * 100)}%
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  No standard generative AI software tags, IPTC digital source designations, or synthetic voice markers were identified in this file.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Rights & Watermarks */}
        {activeTab === 'rights' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Watermark & Rights Attribution
                </span>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded',
                    report.watermark.detectedVisibleWatermark
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      : 'bg-gray-800 text-gray-400'
                  )}
                >
                  {report.watermark.detectedVisibleWatermark ? 'RIGHTS MARKER DETECTED' : 'NO VISIBLE STAMPS'}
                </span>
              </div>

              {report.watermark.detectedVisibleWatermark ? (
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-amber-200">
                    Identified: <span className="font-semibold">{report.watermark.textDetected}</span> ({report.watermark.patternType})
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Notice: FileForge strictly prohibits the unauthorized removal of third-party watermarks or copyright notices. If you are the authentic copyright owner or licensee, you can submit an ownership verification request in the studio.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  No known commercial stock agency watermarks or security overlay streams were detected.
                </p>
              )}
            </div>

            {/* Document Digital Signatures & Encryption */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-gray-400 block mb-1">Digital Signature:</span>
                <span className="font-semibold text-white">
                  {report.document.hasDigitalSignature ? 'Cryptographically Signed' : 'None detected'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-gray-400 block mb-1">Document Encryption:</span>
                <span className="font-semibold text-white">
                  {report.document.isEncrypted ? 'Password/DRM Protected' : 'Unencrypted'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
