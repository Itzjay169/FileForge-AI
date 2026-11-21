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
    <footer className="relative bg-card border-t border-border pt-16 pb-12 overflow-hidden text-muted-foreground font-sans transition-colors duration-200">
      {/* Background Decorative Manga Speed Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-violet-600/10 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Brand Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-border items-center">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-primary shadow-lg shadow-violet-500/20 group-hover:shadow-pink-500/30 group-hover:scale-105 transition-all">
                <Image
                  src="/app-icon.jpg"
                  alt="FileForge AI Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-foreground uppercase font-sans">FileForge AI</span>
                <span className="block text-[10px] font-mono font-bold tracking-widest text-primary">[CREATIVE STUDIO ENGINE]</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
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
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <ForgeButton variant="primary" size="sm" type="submit" disabled={subscribed}>
                {subscribed ? (
                  <span className="flex items-center gap-1.5 text-emerald-500">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-border text-xs">
          {/* Column 1: Product */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground tracking-wider uppercase text-[11px] font-mono">Product</span>
            <Link href="/studio" className="hover:text-foreground transition-colors">Smart Compress</Link>
            <Link href="/convert" className="hover:text-foreground transition-colors">Universal Convert</Link>
            <Link href="/editor" className="hover:text-foreground transition-colors">Editor & PDF Studio</Link>
            <Link href="/transparency" className="hover:text-foreground transition-colors">AI & Watermarks</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Workspace & Library</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing & Plans</Link>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground tracking-wider uppercase text-[11px] font-mono">Resources</span>
            <Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ & Answers</Link>
            <Link href="/formats" className="hover:text-foreground transition-colors">Format Guide (100+)</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Engineering Journal</Link>
            <Link href="/changelog" className="hover:text-foreground transition-colors">Changelog & Releases</Link>
            <Link href="/status" className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1.5 font-mono text-[11px] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </Link>
          </div>

          {/* Column 3: Trust & Compliance */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground tracking-wider uppercase text-[11px] font-mono">Trust & AI</span>
            <Link href="/transparency" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              AI Content Disclosure
            </Link>
            <Link href="/transparency" className="hover:text-foreground transition-colors">C2PA Credentials</Link>
            <Link href="/transparency" className="hover:text-foreground transition-colors">Metadata & EXIF Inspector</Link>
            <Link href="/legal/acceptable-use" className="hover:text-foreground transition-colors">Anti-Plagiarism Policy</Link>
            <Link href="/legal/privacy" className="hover:text-foreground transition-colors">24-Hour File Shredding</Link>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground tracking-wider uppercase text-[11px] font-mono">Legal</span>
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy (GDPR)</Link>
            <Link href="/legal/refund" className="hover:text-foreground transition-colors">Refund Policy</Link>
            <Link href="/legal/acceptable-use" className="hover:text-foreground transition-colors">Acceptable Use Policy</Link>
            <Link href="/legal/dmca" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Scale className="w-3 h-3 text-primary" />
              Copyright & DMCA
            </Link>
            <Link href="/legal/cookies" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Cookie className="w-3 h-3 text-amber-500" />
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Accessibility className="w-3 h-3 text-cyan-500" />
              Accessibility
            </Link>
          </div>

          {/* Column 5: Company */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-foreground tracking-wider uppercase text-[11px] font-mono">Company</span>
            <Link href="/about" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Users className="w-3 h-3 text-primary" />
              About Us
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3 text-pink-500" />
              Contact Support
            </Link>
            <Link href="/report-bug" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Bug className="w-3 h-3 text-amber-500" />
              Report a Bug
            </Link>
            <Link href="/security" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              Security
            </Link>
            <a
              href="https://github.com/Itzjay169/FileForge-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              GitHub Repository <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Security / Compliance Badges Bar */}
        <div className="py-6 border-b border-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>TLS 1.3 / 256-bit AES</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Anti-Malware Binary Guard</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>GDPR / CCPA Compliant</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-pink-500" />
              <span>Isolated Ephemeral Containers</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-muted-foreground">v2.1.0-production</span>
            <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-lg border border-border text-foreground text-[11px]">
              <span className="text-xs">🇮🇳</span>
              <Globe className="w-3 h-3 text-primary" />
              <span>India · English (IN)</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Socials */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FileForge AI. Built for creators, studios, and high-throughput media pipelines.</p>

          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="https://github.com/Itzjay169/FileForge-AI" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="mailto:support@fileforge.ai" className="hover:text-foreground transition-colors" aria-label="Email support">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
