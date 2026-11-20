'use client';

import { ForgeButton, ForgeInput, forgeToast } from '@/components/sakuga';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  X, Send, ShieldAlert } from 'lucide-react';
export interface AbuseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFileHash?: string;
}

export const AbuseReportModal: React.FC<AbuseReportModalProps> = ({
  isOpen,
  onClose,
  targetFileHash
}) => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState<
    'UNAUTHORIZED_COPYRIGHT_INFRINGEMENT' | 'CIRCUMVENTION_ATTEMPT' | 'DECEPTIVE_PROVENANCE_STRIPPING' | 'OTHER'
  >('UNAUTHORIZED_COPYRIGHT_INFRINGEMENT');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !details || details.length < 15) {
      forgeToast.warning('Incomplete Report', 'Please provide a valid email and describe the incident in detail (min 15 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/compliance/report-abuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterEmail: email,
          targetFileHash: targetFileHash || 'unknown-hash',
          reason,
          details
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      forgeToast.success('Report Received', 'Thank you. Our compliance team will review your report promptly.');
      onClose();
    } catch (err: unknown) {
      forgeToast.error('Report Failed', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-[#12121c] border border-white/20 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">Report Rights Infringement or Abuse</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Your Email</label>
                <ForgeInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="legal@rightsholder.org"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Violation Category</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as 'UNAUTHORIZED_COPYRIGHT_INFRINGEMENT' | 'CIRCUMVENTION_ATTEMPT' | 'DECEPTIVE_PROVENANCE_STRIPPING' | 'OTHER')}
                  className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="UNAUTHORIZED_COPYRIGHT_INFRINGEMENT" className="bg-[#12121c]">
                    Unauthorized Copyright Infringement / Watermark Removal
                  </option>
                  <option value="CIRCUMVENTION_ATTEMPT" className="bg-[#12121c]">
                    Circumvention of Access Control / DRM
                  </option>
                  <option value="DECEPTIVE_PROVENANCE_STRIPPING" className="bg-[#12121c]">
                    Deceptive Stripping of Provenance / C2PA Credentials
                  </option>
                  <option value="OTHER" className="bg-[#12121c]">
                    Other Compliance or Security Concern
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Incident Details</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder="Describe the copyrighted work, URL/hash, and nature of the suspected violation..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <ForgeButton variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </ForgeButton>
                <ForgeButton
                  variant="destructive"
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Report
                </ForgeButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
