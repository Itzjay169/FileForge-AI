'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { SakugaInput } from '@/components/ui/sakuga-input';
import { forgeToast } from '@/components/ui/sakuga-toast';
import { ShareLink, formatBytes } from '@fileforge/shared';
import {
  Download,
  Lock,
  KeyRound,
  File,
  ShieldCheck,
  Clock,
  AlertTriangle,
  QrCode,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicSharePage() {
  const params = useParams();
  const code = params.code as string;

  const [linkInfo, setLinkInfo] = useState<ShareLink | null>(null);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const fetchLink = async (pwd?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/share/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to access share link');
      }

      setLinkInfo(data.link);
      setIsPasswordRequired(data.isPasswordRequired);
      setIsAuthorized(data.isAuthorized);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchLink();
    }
  }, [code]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    fetchLink(password);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/share/${code}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Download authorization failed');

      // Trigger browser file download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      forgeToast.success('Download Initiated', `Downloading "${data.fileName}"`);
    } catch (err: any) {
      forgeToast.error('Download Error', err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#f0eee9] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 pt-36 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#12121c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top Energy Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-violet-500" />

          {/* Loading State */}
          {isLoading ? (
            <div className="py-12 text-center animate-pulse">
              <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-3 animate-spin" />
              <h3 className="text-sm font-semibold text-white">Decrypting Secure Share Link...</h3>
            </div>
          ) : error ? (
            /* Error State */
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Unable to Access File</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                {error}
              </p>
              <div className="pt-2">
                <a href="/">
                  <SakugaButton variant="secondary" size="sm">
                    Back to FileForge
                  </SakugaButton>
                </a>
              </div>
            </div>
          ) : isPasswordRequired && !isAuthorized ? (
            /* Password Protected Gate */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-400 mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Password Protected Transfer</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  The sender protected &quot;{linkInfo?.fileName}&quot; with an access password.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Enter Access Password
                  </label>
                  <SakugaInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    autoFocus
                  />
                </div>

                <SakugaButton variant="default" className="w-full">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Unlock Asset
                </SakugaButton>
              </form>
            </div>
          ) : (
            /* Authorized / Download Ready State */
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified End-to-End Delivery
              </div>

              <div className="w-20 h-20 rounded-3xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-400 shadow-lg shadow-violet-950/50">
                <File className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white truncate max-w-md mx-auto">
                  {linkInfo?.fileName}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-gray-400">
                  <span className="font-semibold text-gray-200">{formatBytes(linkInfo?.fileSizeBytes || 0)}</span>
                  <span>•</span>
                  <span className="uppercase text-violet-300 font-bold">{linkInfo?.format}</span>
                </div>
              </div>

              {/* Expiry & Download metadata */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div>
                  <span className="text-gray-500 block text-[10px]">Expires:</span>
                  <span className="font-semibold">
                    {linkInfo?.expiresAt ? new Date(linkInfo.expiresAt).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Remaining Downloads:</span>
                  <span className="font-semibold">
                    {linkInfo?.maxDownloads ? Math.max(0, linkInfo.maxDownloads - linkInfo.downloadCount) : 'Unlimited'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <SakugaButton
                  variant="default"
                  size="lg"
                  isLoading={isDownloading}
                  onClick={handleDownload}
                  className="w-full text-base"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download File
                </SakugaButton>

                {linkInfo?.qrCodeSvg && (
                  <button
                    onClick={() => setShowQr(!showQr)}
                    className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 pt-2 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    {showQr ? 'Hide Mobile QR' : 'Show Mobile QR Code'}
                  </button>
                )}
              </div>

              {/* QR Code Container */}
              <AnimatePresence>
                {showQr && linkInfo?.qrCodeSvg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 flex flex-col items-center"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: linkInfo.qrCodeSvg }}
                      className="p-2 rounded-2xl bg-[#12121c] border border-white/10"
                    />
                    <span className="text-[11px] text-gray-500 mt-2">
                      Scan to transfer directly to mobile device
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
