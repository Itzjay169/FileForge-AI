import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Cpu, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ForgeButton } from '@/components/sakuga';

export const metadata: Metadata = {
  title: 'Security Architecture — FileForge AI',
  description: 'In-depth overview of FileForge AI security: TLS 1.3 encryption, ephemeral containers, SSRF guards, and automated 24-hour file shredding.',
};

export default function SecurityPage() {
  const pillars = [
    {
      icon: Lock,
      title: 'End-to-End Encryption in Transit',
      desc: 'All payloads and transfers enforce TLS 1.3 cipher suites. File downloads use HMAC-SHA256 time-limited signed URLs that self-destruct upon expiration.'
    },
    {
      icon: Cpu,
      title: 'Ephemeral Isolated Sandboxes',
      desc: 'Processing runs inside ephemeral containers with strict CPU/memory ceilings. Files never persist to permanent databases and are never used to train AI models.'
    },
    {
      icon: Server,
      title: 'SSRF & Malware Defense Gates',
      desc: 'Incoming URLs are strictly scrubbed against private RFC 1918 subnets and cloud metadata endpoints (169.254.169.254). Buffers are scanned against binary execution signatures.'
    },
    {
      icon: CheckCircle2,
      title: 'Automated 24-Hour File Shredding',
      desc: 'Our storage lifecycle scheduler permanently zeroes and unlinks temporary output assets 24 hours after completion.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] font-sans">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>INFRASTRUCTURE DEFENSE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Security Architecture</h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Engineered from day one for zero-trust privacy, ephemeral computation, and rigorous threat containment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-8 rounded-3xl bg-[var(--sk-surface)] border border-[var(--sk-border)] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">{p.title}</h2>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[var(--sk-surface)] to-pink-950/30 border border-[var(--sk-border)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Responsible Disclosure Program</h3>
            <p className="text-xs text-gray-400">Found a vulnerability? Report it directly to our lead developer for prioritized remediation.</p>
          </div>
          <Link href="/report-bug">
            <ForgeButton variant="primary" size="md">
              <span>Submit Security Report</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </ForgeButton>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
