'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { forgeToast } from '@/components/ui/sakuga-toast';
import {
  OwnershipVerificationRequest,
  AbuseReport,
  WatermarkAuditRecord
} from '@fileforge/shared';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Scale
} from 'lucide-react';
import { formatBytes } from '@fileforge/shared';

export default function AdminCompliancePage() {
  const [requests, setRequests] = useState<OwnershipVerificationRequest[]>([]);
  const [abuseReports, setAbuseReports] = useState<AbuseReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<WatermarkAuditRecord[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'abuse' | 'audit'>('requests');
  const [selectedReq, setSelectedReq] = useState<OwnershipVerificationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/compliance');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load compliance data');

      setRequests(data.requests || []);
      setAbuseReports(data.abuseReports || []);
      setAuditLogs(data.auditLogs || []);
      setStats(data.stats || {});
    } catch (err: unknown) {
      forgeToast.error('Fetch Error', (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/admin/compliance');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load compliance data');
        if (!ignore) {
          setRequests(data.requests || []);
          setAbuseReports(data.abuseReports || []);
          setAuditLogs(data.auditLogs || []);
          setStats(data.stats || {});
        }
      } catch (err: unknown) {
        forgeToast.error('Fetch Error', (err as Error).message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleReviewAction = async (action: 'APPROVE' | 'REJECT' | 'FLAG') => {
    if (!selectedReq) return;
    if (!adminNotes.trim()) {
      forgeToast.warning('Notes Required', 'Please enter admin review rationale notes.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/admin/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedReq.id,
          action,
          adminNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      forgeToast.success('Review Recorded', `Request ${selectedReq.id} marked as ${data.request.status}`);
      setSelectedReq(null);
      setAdminNotes('');
      fetchData();
    } catch (err: unknown) {
      forgeToast.error('Review Error', (err as Error).message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5 text-violet-400" />
              Compliance & Legal Moderation Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trust, Safety & Rights Review Queue
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Review verified ownership watermark removal petitions, abuse reports, and immutable provenance audit trails.
            </p>
          </div>

          <SakugaButton variant="secondary" size="sm" onClick={fetchData} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh Queue
          </SakugaButton>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10">
            <span className="text-xs text-gray-400 block">Pending Review</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 block">
              {stats.pendingCount ?? 0}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10">
            <span className="text-xs text-gray-400 block">Approved Owners</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 block">
              {stats.approvedCount ?? 0}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10">
            <span className="text-xs text-gray-400 block">Rejected / Flagged</span>
            <span className="text-xl sm:text-2xl font-bold text-red-400 mt-1 block">
              {(stats.rejectedCount ?? 0) + (stats.flaggedCount ?? 0)}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#12121c] border border-white/10">
            <span className="text-xs text-gray-400 block">Abuse Reports</span>
            <span className="text-xl sm:text-2xl font-bold text-pink-400 mt-1 block">
              {stats.abuseReportsCount ?? 0}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'requests'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Ownership Petitions ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('abuse')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'abuse'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Abuse & Infringement Reports ({abuseReports.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Provenance Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Tab 1: Ownership Petitions Queue */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#12121c] border border-white/10 text-center text-xs text-gray-400">
                No ownership verification petitions currently in the queue.
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-[#12121c] border border-white/10 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          req.status === 'PENDING_REVIEW'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                            : req.status === 'APPROVED'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : 'bg-red-950/60 text-red-300 border-red-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate max-w-sm">
                        {req.fileName}
                      </h4>
                      <span className="text-xs text-gray-400">
                        ({formatBytes(req.fileSizeBytes)})
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 font-mono">
                      User: <span className="text-gray-200">{req.userEmail}</span> • IP: {req.ipAddress}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
                    <div>
                      <span className="text-gray-400 block mb-0.5">Reason Code:</span>
                      <span className="font-semibold text-violet-300">{req.reasonCode}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Legal Signer:</span>
                      <span className="font-semibold text-white">
                        {req.declarationSignerName} (Cert under penalty of perjury)
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block mb-0.5">Proof Description:</span>
                      <span className="text-gray-200">{req.ownershipProofDescription}</span>
                    </div>
                    {req.proofDocumentUrl && (
                      <div className="sm:col-span-2 flex items-center gap-1.5 text-violet-400">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <a
                          href={req.proofDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-xs"
                        >
                          View Uploaded Documentation
                        </a>
                      </div>
                    )}
                  </div>

                  {req.adminNotes && (
                    <div className="text-xs text-gray-300 bg-violet-950/30 p-2.5 rounded-lg border border-violet-500/20">
                      <strong>Admin Notes:</strong> {req.adminNotes}
                    </div>
                  )}

                  {req.status === 'PENDING_REVIEW' && (
                    <div className="pt-2 flex items-center gap-2">
                      <SakugaButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedReq(req)}
                      >
                        Review & Adjudicate
                      </SakugaButton>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Abuse Reports */}
        {activeTab === 'abuse' && (
          <div className="space-y-4">
            {abuseReports.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#12121c] border border-white/10 text-center text-xs text-gray-400">
                No abuse reports on file.
              </div>
            ) : (
              abuseReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-2xl bg-[#12121c] border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-400">{report.reason}</span>
                    <span className="text-gray-400">{new Date(report.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    Reporter: <span className="font-semibold text-white">{report.reporterEmail}</span>
                  </div>
                  <div>
                    Target File Hash: <span className="font-mono text-gray-300">{report.targetFileHash}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                    {report.details}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Provenance Audit Trail */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#12121c] border border-white/10 text-center text-xs text-gray-400">
                No audit records logged yet.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#12121c] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-violet-400 font-mono">{log.action}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-300 mt-1">
                      File Hash: <span className="font-mono text-[11px] text-gray-400">{log.fileHash.substring(0, 16)}...</span>
                      {log.legalSignature && (
                        <span> • Signed by: <strong className="text-white">{log.legalSignature}</strong></span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-[11px]">
                    IP: {log.ipAddress || 'internal'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Adjudication Modal */}
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setSelectedReq(null)}
            />
            <div className="relative w-full max-w-lg bg-[#12121c] border border-white/20 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-2">
                Adjudicate Ownership Petition
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Petitioner: <strong className="text-white">{selectedReq.userEmail}</strong> for file &quot;{selectedReq.fileName}&quot;.
              </p>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Compliance Decision Notes (Required)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Record rationale: e.g. 'Verified trademark registration matching registrant domain. Approved for editorial reconstruction.'"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <SakugaButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedReq(null)}
                >
                  Cancel
                </SakugaButton>
                <SakugaButton
                  variant="destructive"
                  size="sm"
                  isLoading={isSubmittingReview}
                  onClick={() => handleReviewAction('REJECT')}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject
                </SakugaButton>
                <SakugaButton
                  variant="default"
                  size="sm"
                  isLoading={isSubmittingReview}
                  onClick={() => handleReviewAction('APPROVE')}
                  className="bg-emerald-600 hover:bg-emerald-700 border-emerald-500/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Approve Ownership
                </SakugaButton>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
