'use client';

import { ForgeButton, ForgeInput, ForgeSlider, forgeToast, ForgeToggle } from '@/components/sakuga';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stamp,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Sliders,
  Check,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import {
  WatermarkApplyOptions,
  AiDisclosureOptions,
  OwnershipReasonCode,
  WatermarkPosition,
  AiDisclosureTier
} from '@fileforge/shared';
export interface WatermarkStudioCardProps {
  file: File | null;
  fileHash?: string;
  onOperationComplete?: (result: any) => void;
}

export const WatermarkStudioCard: React.FC<WatermarkStudioCardProps> = ({
  file,
  fileHash,
  onOperationComplete
}) => {
  const [activeTab, setActiveTab] = useState<'watermark' | 'ai_disclosure' | 'verified_removal'>('watermark');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tab 1: Watermarking state
  const [watermarkText, setWatermarkText] = useState('FILEFORGE AI • VERIFIED');
  const [watermarkPos, setWatermarkPos] = useState<WatermarkPosition>('center');
  const [watermarkOpacity, setWatermarkOpacity] = useState(45);
  const [watermarkRotation, setWatermarkRotation] = useState(-25);

  // Tab 2: AI Content Disclosure state
  const [disclosureTier, setDisclosureTier] = useState<AiDisclosureTier>('FULLY_AI_GENERATED');
  const [generatorName, setGeneratorName] = useState('Midjourney v6');
  const [embedVisibleBadge, setEmbedVisibleBadge] = useState(true);
  const [embedXmpMetadata, setEmbedXmpMetadata] = useState(true);

  // Tab 3: Verified Ownership Removal state
  const [reasonCode, setReasonCode] = useState<OwnershipReasonCode>('ORIGINAL_CREATOR_LOST_SOURCE');
  const [proofDescription, setProofDescription] = useState('');
  const [proofDocUrl, setProofDocUrl] = useState('');
  const [legalDeclarationSigned, setLegalDeclarationSigned] = useState(false);
  const [declarationSignerName, setDeclarationSignerName] = useState('');
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // 1. Handle Apply Watermark
  const handleApplyWatermark = async () => {
    if (!file) {
      forgeToast.warning('Select a File', 'Please select a file to watermark.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'options',
        JSON.stringify({
          type: 'text',
          text: watermarkText,
          position: watermarkPos,
          opacity: watermarkOpacity / 100,
          rotation: watermarkRotation
        })
      );

      const res = await fetch('/api/compliance/watermark', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply watermark');
      }

      forgeToast.success('Watermark Applied', `Saved as "${data.filename}"`);
      if (onOperationComplete) onOperationComplete(data);
    } catch (err: any) {
      forgeToast.error('Watermark Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Handle AI Disclosure Embedding
  const handleEmbedAiDisclosure = async () => {
    if (!file) {
      forgeToast.warning('Select a File', 'Please select a file to disclose AI provenance.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'options',
        JSON.stringify({
          tier: disclosureTier,
          generatorName,
          embedVisibleBadge,
          embedXmpIptcMetadata: embedXmpMetadata
        })
      );

      const res = await fetch('/api/compliance/ai-disclosure', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to embed AI disclosure');
      }

      forgeToast.success('AI Disclosure Embedded', `Saved as "${data.filename}"`);
      if (onOperationComplete) onOperationComplete(data);
    } catch (err: any) {
      forgeToast.error('Disclosure Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Handle Submit Verified Ownership Removal Request
  const handleSubmitOwnershipRequest = async () => {
    if (!file) {
      forgeToast.warning('Select a File', 'Please select a file first.');
      return;
    }
    if (!legalDeclarationSigned) {
      forgeToast.error('Legal Certification Required', 'You must certify ownership under penalty of perjury.');
      return;
    }
    if (!declarationSignerName.trim()) {
      forgeToast.error('Name Required', 'Please enter your legal signature name.');
      return;
    }
    if (proofDescription.length < 20) {
      forgeToast.error('Proof Description', 'Please provide at least 20 characters describing your ownership evidence.');
      return;
    }

    setIsProcessing(true);
    try {
      // Upload file temporarily to get storageKey
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      const upRes = await fetch('/api/upload', { method: 'POST', body: uploadForm });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error || 'Failed to stage file');

      const bodyPayload = {
        fileHash: fileHash || upData.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        fileName: file.name,
        fileSizeBytes: file.size,
        storageKey: upData.storageKey,
        userEmail: 'creator@fileforge.studio',
        reasonCode,
        ownershipProofDescription: proofDescription,
        proofDocumentUrl: proofDocUrl || undefined,
        legalDeclarationSigned: true,
        declarationSignerName,
        creditCost: 10
      };

      const res = await fetch('/api/compliance/ownership/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ownership request');
      }

      setSubmittedRequestId(data.request.id);
      forgeToast.success('Verification Request Queued', 'Request submitted for compliance review.');
    } catch (err: any) {
      forgeToast.error('Verification Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#12121c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Tab Selector */}
      <div className="flex items-center gap-2 pb-6 border-b border-white/10 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('watermark')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'watermark'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Stamp className="w-4 h-4" />
          Apply Watermark
        </button>
        <button
          onClick={() => setActiveTab('ai_disclosure')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'ai_disclosure'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Content Disclosure
        </button>
        <button
          onClick={() => setActiveTab('verified_removal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'verified_removal'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          Verified Owner Removal
        </button>
      </div>

      {/* Tab 1: Apply Watermark */}
      {activeTab === 'watermark' && (
        <div className="pt-6 space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Watermark Text
            </label>
            <ForgeInput
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL • DO NOT SHARE"
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Placement Position
              </label>
              <select
                value={watermarkPos}
                onChange={(e) => setWatermarkPos(e.target.value as WatermarkPosition)}
                className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="center" className="bg-[#12121c]">Center (Diagonal Angle)</option>
                <option value="bottom_right" className="bg-[#12121c]">Bottom-Right Corner</option>
                <option value="bottom_left" className="bg-[#12121c]">Bottom-Left Corner</option>
                <option value="top_right" className="bg-[#12121c]">Top-Right Corner</option>
                <option value="top_left" className="bg-[#12121c]">Top-Left Corner</option>
                <option value="tiled" className="bg-[#12121c]">Tiled Full Pattern Grid</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Opacity: {watermarkOpacity}%
              </label>
              <ForgeSlider
                value={watermarkOpacity}
                min={5}
                max={100}
                onChange={setWatermarkOpacity}
              />
            </div>
          </div>

          <div className="pt-2">
            <ForgeButton variant="primary"
              isLoading={isProcessing}
              onClick={handleApplyWatermark}
              className="w-full sm:w-auto"
            >
              <Stamp className="w-4 h-4 mr-2" />
              Embed Visible Watermark
            </ForgeButton>
          </div>
        </div>
      )}

      {/* Tab 2: AI Content Disclosure */}
      {activeTab === 'ai_disclosure' && (
        <div className="pt-6 space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Creator Disclosure Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'FULLY_AI_GENERATED', label: 'Fully AI-Generated', desc: '100% synthetic media' },
                { id: 'AI_ASSISTED', label: 'AI-Assisted Co-Creation', desc: 'Human direction with AI' },
                { id: 'HUMAN_WITH_AI_ENHANCEMENT', label: 'Human with AI Polish', desc: 'Upscaling or color grade' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setDisclosureTier(tier.id as AiDisclosureTier)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    disclosureTier === tier.id
                      ? 'border-pink-500 bg-pink-950/30 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">{tier.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Model or Tool Name
            </label>
            <ForgeInput
              value={generatorName}
              onChange={(e) => setGeneratorName(e.target.value)}
              placeholder="e.g. Midjourney v6, Stable Diffusion XL, ChatGPT"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs font-medium text-white block">Embed Visible Corner Badge</span>
                <span className="text-[11px] text-gray-400">Adds discreet translucent &quot;✨ [AI-DISCLOSED]&quot; tag</span>
              </div>
              <ForgeToggle checked={embedVisibleBadge} onChange={setEmbedVisibleBadge} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs font-medium text-white block">Embed IPTC / XMP Provenance Metadata</span>
                <span className="text-[11px] text-gray-400">Writes standard DigitalSourceType metadata tags</span>
              </div>
              <ForgeToggle checked={embedXmpMetadata} onChange={setEmbedXmpMetadata} />
            </div>
          </div>

          <div className="pt-2">
            <ForgeButton
              variant="accent"
              isLoading={isProcessing}
              onClick={handleEmbedAiDisclosure}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Embed AI Content Label
            </ForgeButton>
          </div>
        </div>
      )}

      {/* Tab 3: Verified Ownership Watermark Removal Workflow */}
      {activeTab === 'verified_removal' && (
        <div className="pt-6 space-y-6">
          {/* Strict Compliance Warning Banner */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-200">
              <span className="font-bold text-white block mb-0.5">
                Strict DMCA & Anti-Circumvention Policy
              </span>
              FileForge strictly prohibits the unauthorized removal of third-party watermarks or copyright notices. This workflow is legally gated exclusively for authentic copyright holders, photographers recovering lost un-watermarked exports, or authorized agencies.
            </div>
          </div>

          {submittedRequestId ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Ownership Request Queued</h4>
              <p className="text-xs text-gray-300 mt-1 max-w-md mx-auto">
                Request ID: <span className="font-mono text-emerald-300">{submittedRequestId}</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Our compliance officers verify ownership evidence within 2-4 business hours. Once approved, the asset will unlock for reconstructed export in your account.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Authorized Ownership Reason Code
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value as OwnershipReasonCode)}
                  className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="ORIGINAL_CREATOR_LOST_SOURCE" className="bg-[#12121c]">
                    Original Creator (Lost Source / RAW File Available)
                  </option>
                  <option value="LICENSED_STOCK_PURCHASED" className="bg-[#12121c]">
                    Licensed Stock Purchased (Replacing Proof Stamp with License)
                  </option>
                  <option value="CLIENT_AUTHORIZED_EDITORIAL" className="bg-[#12121c]">
                    Client-Authorized Editorial Agency Work
                  </option>
                  <option value="COMPANY_BRAND_REFRESH" className="bg-[#12121c]">
                    Corporate Trademark / Brand Asset Refresh
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Evidence Description (Min 20 characters)
                </label>
                <textarea
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail your ownership: e.g. 'I am the registered copyright owner. Original RAW camera files and invoice available upon audit.'"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Supporting Documentation URL (Optional)
                </label>
                <ForgeInput
                  value={proofDocUrl}
                  onChange={(e) => setProofDocUrl(e.target.value)}
                  placeholder="https://... (Invoice, copyright certificate, or agency agreement)"
                />
              </div>

              {/* Legal Acknowledgment Checkbox */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legalDeclarationSigned}
                    onChange={(e) => setLegalDeclarationSigned(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-xs text-gray-300 leading-relaxed">
                    <strong className="text-white">Legal Certification:</strong> I declare under penalty of perjury under the laws of the applicable jurisdiction that I am the authorized copyright holder or legal licensee of this media. I certify that this request does not infringe third-party rights or attempt to deceive provenance verifiers.
                  </span>
                </label>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                    Signer Full Legal Name (Electronic Signature)
                  </label>
                  <ForgeInput
                    value={declarationSignerName}
                    onChange={(e) => setDeclarationSignerName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <ForgeButton variant="primary"
                  isLoading={isProcessing}
                  onClick={handleSubmitOwnershipRequest}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 border-amber-500/30"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Submit Verified Ownership Request (10 Credits)
                </ForgeButton>
                <span className="text-[11px] text-gray-500">
                  Audit trail logged with IP & cryptographic signature.
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
