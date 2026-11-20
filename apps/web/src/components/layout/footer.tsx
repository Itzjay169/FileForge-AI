'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Cpu,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Mail,
  Bug,
  Users,
  Accessibility,
  Cookie,
  Scale,
  Shield
} from 'lucide-react';
import { ForgeButton, forgeToast } from '@/components/sakuga';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      forgeToast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    forgeToast.success('Subscribed!', 'You will receive monthly file studio updates and release notes.');
  };

  return (
    <footer className="relative bg-[#07070b] border-t-2 border-[var(--sk-line)] pt-16 pb-12 overflow-hidden text-gray-400 font-sans">
      {/* Background Decorative Manga Speed Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-violet-600/15 via-pink-500/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Brand Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10 items-center">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-[var(--sk-pri)] shadow-lg shadow-violet-500/40 group-hover:shadow-pink-500/50 group-hover:scale-105 transition-all">
                <Image
                  src="/app-icon.jpg"
                  alt="FileForge AI Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white uppercase font-sans">FileForge AI</span>
                <span className="block text-[10px] font-mono font-bold tracking-widest text-[var(--sk-acc)]">[CREATIVE STUDIO ENGINE]</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              The high-velocity creative file studio. Compress up to 90%, convert between 200+ formats, and automate asset pipelines with anime-inspired responsiveness.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md lg:ml-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for changelog updates..."
                disabled={subscribed}
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
              <ForgeButton variant="primary" size="sm" type="submit" disabled={subscribed}>
                {subscribed ? (
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Subscribed
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    Stay Updated
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                )}
              </ForgeButton>
            </form>
          </div>
        </div>

        {/* Multi-column Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-white/10 text-xs">
          {/* Column 1: Product */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white tracking-wider uppercase text-[11px] font-mono">Product</span>
            <Link href="/studio" className="hover:text-white transition-colors">Smart Compress</Link>
            <Link href="/convert" className="hover:text-white transition-colors">Universal Convert</Link>
            <Link href="/editor" className="hover:text-white transition-colors">Editor & PDF Studio</Link>
            <Link href="/transparency" className="hover:text-white transition-colors">AI & Watermarks</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Workspace & Library</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white tracking-wider uppercase text-[11px] font-mono">Resources</span>
            <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ & Answers</Link>
            <Link href="/formats" className="hover:text-white transition-colors">Format Guide (100+)</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Engineering Journal</Link>
            <Link href="/changelog" className="hover:text-white transition-colors">Changelog & Releases</Link>
            <Link href="/status" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-mono text-[11px] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </Link>
          </div>

          {/* Column 3: Trust & Compliance */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white tracking-wider uppercase text-[11px] font-mono">Trust & AI</span>
            <Link href="/transparency" className="hover:text-white transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-400" />
              AI Content Disclosure
            </Link>
            <Link href="/transparency" className="hover:text-white transition-colors">C2PA Credentials</Link>
            <Link href="/transparency" className="hover:text-white transition-colors">Metadata & EXIF Inspector</Link>
            <Link href="/legal/acceptable-use" className="hover:text-white transition-colors">Anti-Plagiarism Policy</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">24-Hour File Shredding</Link>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white tracking-wider uppercase text-[11px] font-mono">Legal</span>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy (GDPR)</Link>
            <Link href="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/legal/acceptable-use" className="hover:text-white transition-colors">Acceptable Use Policy</Link>
            <Link href="/legal/dmca" className="hover:text-white transition-colors flex items-center gap-1">
              <Scale className="w-3 h-3 text-violet-400" />
              Copyright & DMCA
            </Link>
            <Link href="/legal/cookies" className="hover:text-white transition-colors flex items-center gap-1">
              <Cookie className="w-3 h-3 text-amber-400" />
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors flex items-center gap-1">
              <Accessibility className="w-3 h-3 text-cyan-400" />
              Accessibility
            </Link>
          </div>

          {/* Column 5: Company */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white tracking-wider uppercase text-[11px] font-mono">Company</span>
            <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1">
              <Users className="w-3 h-3 text-violet-400" />
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3 text-pink-400" />
              Contact Support
            </Link>
            <Link href="/report-bug" className="hover:text-white transition-colors flex items-center gap-1">
              <Bug className="w-3 h-3 text-amber-400" />
              Report a Bug
            </Link>
            <Link href="/security" className="hover:text-white transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Security
            </Link>
            <a
              href="https://github.com/Itzjay169/FileForge-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub Repository <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
          </div>
        </div>

        {/* Security / Compliance Badges Bar */}
        <div className="py-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-400" />
              <span>TLS 1.3 / 256-bit AES</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Malware Binary Guard</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>GDPR / CCPA Compliant</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-pink-400" />
              <span>Isolated Ephemeral Containers</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-gray-500">v2.1.0-production</span>
            <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-gray-300 text-[11px]">
              <Globe className="w-3 h-3 text-violet-400" />
              <span>English (US)</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FileForge AI. Built for creators, studios, and high-throughput media pipelines.</p>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://github.com/Itzjay169/FileForge-AI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="mailto:support@fileforge.ai" className="hover:text-white transition-colors" aria-label="Email support">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
