'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'GENERAL' as 'BUG' | 'BILLING' | 'FEATURE' | 'GENERAL',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedTicket({ id: data.ticketId, message: data.message });
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Header */}
        <div className="text-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
          <h1 className="text-4xl sm:text-5xl font-black text-white">Get in touch with FileForge AI</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            Have a question about high-throughput transcoding, enterprise deployment, or billing inquiries? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#12121c] border border-white/10 shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-violet-400" />
                Support Channels
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">General & Support Email</div>
                    <div className="text-gray-400">support@fileforge.ai</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Enterprise & Custom SLAs</div>
                    <div className="text-gray-400">enterprise@fileforge.ai</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Response Time Commitments</div>
                    <div className="text-gray-400">Pro & Studio: &lt; 4 hours</div>
                    <div className="text-gray-400">Enterprise: &lt; 15 mins (24/7/365)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Security & Vulnerability Reports</div>
                    <div className="text-gray-400">security@fileforge.ai</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-950/30 to-[#12121c] border border-white/10 shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">Need immediate answers?</h4>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Check our Knowledge Base and System Status page for real-time cluster health and answers to common integration questions.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/faq" className="text-xs text-pink-400 hover:underline font-semibold">
                  Browse FAQ →
                </Link>
                <Link href="/status" className="text-xs text-emerald-400 hover:underline font-semibold">
                  System Status →
                </Link>
              </div>
            </div>
          </div>

          {/* Form / Confirmation Area */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-[#12121c] border border-white/10 shadow-2xl">
              {submittedTicket ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Ticket Submitted Successfully</h3>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">{submittedTicket.message}</p>
                  <div className="inline-block px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-violet-300">
                    Reference ID: {submittedTicket.id}
                  </div>
                  <div className="pt-4">
                    <SakugaButton
                      variant="secondary"
                      onClick={() => {
                        setSubmittedTicket(null);
                        setFormData({ name: '', email: '', category: 'GENERAL', subject: '', message: '' });
                      }}
                    >
                      Submit Another Inquiry
                    </SakugaButton>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-bold text-white">Send us a direct message</h3>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Rostova"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="elena@studio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                      >
                        <option value="GENERAL" className="bg-[#12121c]">General Inquiry</option>
                        <option value="BILLING" className="bg-[#12121c]">Billing & Invoices</option>
                        <option value="FEATURE" className="bg-[#12121c]">Enterprise / Feature Request</option>
                        <option value="BUG" className="bg-[#12121c]">Bug Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="Inquiry regarding 4K transcoding SLA"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please provide as much detail as possible..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <SakugaButton variant="default" disabled={loading} className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" />
                      <span>{loading ? 'Submitting...' : 'Send Inquiry'}</span>
                    </SakugaButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
