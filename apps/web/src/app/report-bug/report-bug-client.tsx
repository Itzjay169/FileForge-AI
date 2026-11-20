'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bug,
  Send,
  CheckCircle2,
  Shield,
  Laptop
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  ForgeButton,
  ForgeInput,
  ForgeCheckbox,
  ForgeRadioGroup,
  ForgeRating,
  forgeToast
} from '@/components/sakuga';

const BUG_TYPES = [
  { value: 'Visual issue', label: 'Visual issue', description: 'Layout shifts, color glitches, overlapping text' },
  { value: 'Broken button', label: 'Broken button', description: 'Unresponsive clicks, dead links, failed actions' },
  { value: 'Upload issue', label: 'Upload issue', description: 'Files failing to load or dropzone freezing' },
  { value: 'Compression issue', label: 'Compression issue', description: 'Unexpected artifacting or size reduction failure' },
  { value: 'Conversion issue', label: 'Conversion issue', description: 'Format error, corrupt output, missing layers' },
  { value: 'Mobile issue', label: 'Mobile issue', description: 'Horizontal scroll, tap targets, modal clipping' },
  { value: 'Performance issue', label: 'Performance issue', description: 'Laggy animation, browser stutter, long freeze' },
  { value: 'Other', label: 'Other', description: 'Feature suggestions or unexpected edge cases' }
];

export function ReportBugClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tool, setTool] = useState('/studio');
  const [bugType, setBugType] = useState('Visual issue');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [browserInfo] = useState(() => {
    if (typeof window === 'undefined') return '';
    const ua = navigator.userAgent;
    const screenInfo = `${window.screen.width}x${window.screen.height} (dpr: ${window.devicePixelRatio})`;
    return `${ua} [Screen: ${screenInfo}]`;
  });
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email address so we can reply.';
    }
    if (!tool.trim()) {
      errs.tool = 'Please specify where this issue happened.';
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Please describe what went wrong (minimum 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      forgeToast.error('Validation Error', 'Please check the highlighted fields before sending.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/report-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          tool: tool.trim(),
          bugType,
          description: description.trim(),
          stepsToReproduce: stepsToReproduce.trim() || undefined,
          expectedResult: expectedResult.trim() || undefined,
          actualResult: actualResult.trim() || undefined,
          browserInfo,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          consent,
          website_hp: honeypot
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit bug report');

      setSubmittedReportId(data.reportId || 'BUG-PROCESSED');
      forgeToast.success(
        'Bug Report Sent!',
        'Your bug report was sent successfully. Thank you for helping improve FileForge AI.'
      );
    } catch (err: unknown) {
      forgeToast.error(
        'Submission Failed',
        (err as Error).message || "We couldn't send your report. Please try again or email us directly at support@fileforge.ai."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] selection:bg-pink-500/25 selection:text-pink-300 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-mono font-bold">
            <Bug className="w-3.5 h-3.5" />
            <span>DIRECT ISSUE DESK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
            Report a Bug
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Found a visual glitch, unclickable button, or compression anomaly? Tell us what went wrong and our engineers will investigate immediately.
          </p>
        </div>

        {submittedReportId ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Report Successfully Dispatched</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Your bug report was sent successfully. Thank you for helping improve FileForge AI.
              </p>
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[var(--sk-pri)]">
                Reference ID: {submittedReportId}
              </div>
            </div>

            {/* Optional Feedback Rating */}
            <div className="pt-6 border-t border-white/10 max-w-sm mx-auto">
              <ForgeRating
                label="How easy was this reporting experience?"
                value={feedbackRating}
                onChange={setFeedbackRating}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/studio">
                <ForgeButton variant="primary" size="md">
                  <span>Return to Studio</span>
                </ForgeButton>
              </Link>
              <ForgeButton
                variant="secondary"
                size="md"
                onClick={() => {
                  setSubmittedReportId(null);
                  setDescription('');
                  setStepsToReproduce('');
                  setExpectedResult('');
                  setActualResult('');
                }}
              >
                <span>Submit Another Report</span>
              </ForgeButton>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] shadow-2xl space-y-8"
          >
            {/* Honeypot hidden input */}
            <input
              type="text"
              name="website_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* User Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <ForgeInput
                  label="Your Name (Optional)"
                  placeholder="e.g. Alex Creator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <ForgeInput
                  label="Your Email Address *"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  error={errors.email}
                  helperText="We will send you confirmation and updates on this fix."
                />
              </div>
            </div>

            {/* Tool / Location */}
            <div>
              <ForgeInput
                label="Page or Tool Where the Bug Occurred *"
                placeholder="e.g. /studio, Universal Convert, Batch Queue, or Share Modal"
                value={tool}
                onChange={(e) => {
                  setTool(e.target.value);
                  if (errors.tool) setErrors((prev) => ({ ...prev, tool: '' }));
                }}
                error={errors.tool}
                leadingIcon={<Laptop className="w-4 h-4 text-violet-400" />}
              />
            </div>

            {/* Bug Category */}
            <div>
              <label className="text-sm font-bold text-[var(--sk-text)] block mb-3">
                Issue Category *
              </label>
              <ForgeRadioGroup
                name="bugType"
                value={bugType}
                onChange={setBugType}
                options={BUG_TYPES}
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--sk-text)] block">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                placeholder="Please describe what happened in detail. What file format were you using? What did you click?"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--sk-card)] border border-[var(--sk-border)] text-sm text-[var(--sk-text)] placeholder-gray-500 focus:outline-none focus:border-[var(--sk-pri)] focus:ring-1 focus:ring-[var(--sk-pri)] transition-all resize-y"
              />
              {errors.description && (
                <p className="text-xs text-rose-400 font-semibold">{errors.description}</p>
              )}
            </div>

            {/* Steps to Reproduce */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--sk-text)] block">
                Steps to Reproduce (Optional)
              </label>
              <textarea
                rows={3}
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                placeholder="1. Drag a 50MB PDF into Studio&#10;2. Select Extreme compression&#10;3. Click Start Compressing"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--sk-card)] border border-[var(--sk-border)] text-sm text-[var(--sk-text)] placeholder-gray-500 focus:outline-none focus:border-[var(--sk-pri)] focus:ring-1 focus:ring-[var(--sk-pri)] transition-all resize-y font-mono text-xs"
              />
            </div>

            {/* Expected vs Actual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Expected Result (Optional)
                </label>
                <input
                  type="text"
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  placeholder="e.g. File downloads as .zip bundle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--sk-card)] border border-[var(--sk-border)] text-xs text-[var(--sk-text)] focus:outline-none focus:border-[var(--sk-pri)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Actual Result (Optional)
                </label>
                <input
                  type="text"
                  value={actualResult}
                  onChange={(e) => setActualResult(e.target.value)}
                  placeholder="e.g. Button stayed in loading state"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--sk-card)] border border-[var(--sk-border)] text-xs text-[var(--sk-text)] focus:outline-none focus:border-[var(--sk-pri)]"
                />
              </div>
            </div>

            {/* Auto-detected Diagnostics note */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-gray-400">
              <Laptop className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-300">Diagnostic telemetry attached: </span>
                <span className="font-mono text-[11px] text-gray-400 break-all">{browserInfo || 'Detecting user agent...'}</span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div>
              <ForgeCheckbox
                label="I consent to the FileForge AI engineering team contacting me at this email address to follow up on this report."
                checked={consent}
                onChange={setConsent}
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span>Protected with rate limiting & anti-bot honeypot</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/" className="w-full sm:w-auto">
                  <ForgeButton variant="ghost" size="md" className="w-full justify-center">
                    Cancel
                  </ForgeButton>
                </Link>

                <ForgeButton
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto justify-center min-w-[160px]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Send Report</span>
                </ForgeButton>
              </div>
            </div>
          </form>
        )}

        {/* Fallback Email Contact */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Prefer direct email? You can also contact us directly at{' '}
          <a
            href="mailto:support@fileforge.ai"
            className="text-[var(--sk-pri)] hover:underline font-semibold"
            aria-label="Email FileForge AI Support at support@fileforge.ai"
          >
            support@fileforge.ai
          </a>
          .
        </div>
      </main>

      <Footer />
    </div>
  );
}
