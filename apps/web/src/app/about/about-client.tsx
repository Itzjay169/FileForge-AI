'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Code,
  Smartphone,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingUp,
  Award,
  Terminal,
  Heart
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ForgeButton } from '@/components/sakuga';
import { AboutCounters } from '@/components/about/about-counters';

export function AboutClient() {
  const skills = [
    'Next.js 16 (Turbopack)',
    'React 19',
    'TypeScript',
    'Node.js & Python',
    'AI Systems & LLMs',
    'Sharp & WebAssembly',
    'FFmpeg Transcoding',
    'C2PA Cryptography',
    'Tailwind CSS',
    'Docker & Cloud Architecture'
  ];

  return (
    <div className="min-h-screen bg-[var(--sk-bg)] text-[var(--sk-text)] selection:bg-pink-500/25 selection:text-pink-300 font-sans">
      <Navbar />

      <main className="pt-32 pb-24 space-y-24">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-[var(--sk-pri)] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FILEFORGE AI PHILOSOPHY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground font-sans max-w-3xl mx-auto leading-tight">
            Built to make file work simpler.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe creators, designers, and engineers shouldn’t battle paywalls, sluggish uploaders, or intrusive adware just to optimize a video, extract a PDF, or convert an image.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/studio">
              <ForgeButton variant="primary" size="lg">
                <Zap className="w-4 h-4 mr-2 text-pink-300" />
                <span>Open Creative Studio</span>
              </ForgeButton>
            </Link>
            <Link href="/convert">
              <ForgeButton variant="secondary" size="lg">
                <span>Explore Universal Convert</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </ForgeButton>
            </Link>
          </div>
        </section>

        {/* The Story & Principles */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:border-violet-500/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/30 text-violet-500 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Free-Forever Commitment</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Core file operations—compression, conversion, and optimization—remain free with generous quotas and no deceptive upsells.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:border-pink-500/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/15 border border-pink-500/30 text-pink-500 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Ephemeral Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Files are strictly processed in isolated, memory-first ephemeral containers. Output assets are automatically destroyed after 24 hours.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:border-emerald-500/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Anime-Inspired Feedback</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every slider, switch, and upload action triggers responsive squash-and-release springs and kinetic bursts, powered by Sakuga VFX.
              </p>
            </div>
          </div>
        </section>

        {/* Animated Metrics & Counters */}
        <AboutCounters />

        {/* What the Product Does */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-[var(--sk-acc)] tracking-wider uppercase">
              CAPABILITIES & WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              What FileForge AI Does
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Smart Multi-Format Compression</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Reduce image, video, audio, archive, and PDF sizes by up to 90% using Sharp, Deflate-9, and AV1 algorithms without visual degradation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Universal Cross-Conversion</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Seamless matrix routing across 200+ format pairs spanning documents, 3D meshes (OBJ/STL), vector graphics, spreadsheets, and media containers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>C2PA Content Provenance & Watermarks</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Analyze AI disclosures, inspect raw EXIF metadata tags, and apply digital forensic watermarks for proof of ownership.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Secure Links & QR Sharing</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Share files with password gates, expiration windows, self-destruct download ceilings, and real-time QR codes.
              </p>
            </div>
          </div>
        </section>

        {/* Creator / Vexora Technology Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-card border-2 border-border p-8 sm:p-12 shadow-xl overflow-hidden space-y-12">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/10 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* Header: Vexora Technology */}
            <div className="relative z-10 space-y-4 border-b border-border pb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-500 text-xs font-mono font-bold">
                <span>🇮🇳</span>
                <span>BASED IN INDIA · MEET THE CREATOR</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                About Vexora Technology
              </h2>
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                Turning Ideas Into Digital Reality
              </h3>

              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-3xl">
                Based in India, Vexora Technology is a technology-driven software development company focused on creating innovative digital products and smart software solutions. We transform ideas into practical, reliable, and user-friendly digital experiences.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                We believe technology should do more than solve problems — it should create opportunities, simplify everyday life, and shape a smarter future.
              </p>
            </div>

            {/* Who We Are & What We Do */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border pb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-pink-500" />
                  <span>Who We Are</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We are a team of technology enthusiasts and developers passionate about building modern digital solutions. From websites and mobile applications to AI-powered software, our focus is on combining creativity, innovation, and technology to deliver meaningful results.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
                    <span className="font-bold text-primary block">Our Mission</span>
                    <span className="text-muted-foreground">To transform creative ideas into useful technology solutions that make businesses smarter and people&apos;s lives easier.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
                    <span className="font-bold text-pink-500 block">Our Vision</span>
                    <span className="text-muted-foreground">To build innovative digital products, deliver meaningful technological experiences, and grow into a trusted name in the software industry.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-500" />
                  <span>What We Do</span>
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/80">
                  <li className="flex items-start gap-2.5">
                    <Code className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                    <span><strong>Web Development:</strong> Modern, responsive, and powerful websites and web applications.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span><strong>Mobile App Development:</strong> User-friendly Android and cross-platform applications.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>AI Solutions:</strong> Intelligent applications and AI-powered software systems.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Custom Software:</strong> Tailored software solutions designed around specific requirements.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span><strong>Digital Products:</strong> Building innovative products that solve real-world problems.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Featured Product: F.R.I.D.A.Y. */}
            <div className="relative z-10 p-6 rounded-2xl bg-muted/40 border border-border space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-pink-500 uppercase tracking-wider">FEATURED PRODUCT</span>
              </div>
              <h3 className="text-xl font-black text-foreground">F.R.I.D.A.Y. – The Trading Desk</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                F.R.I.D.A.Y. is one of our software products, developed under Vexora Technology. It is a voice-driven trading research and paper-trading desktop application designed to help users research markets, plan trades, and review trading decisions.
              </p>
              <p className="text-xs text-muted-foreground/80">
                We aim to develop more innovative products that bring technology closer to everyday needs.
              </p>
            </div>

            {/* Lead Developer Section */}
            <div className="relative z-10 pt-4 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary shadow-xl shadow-violet-500/20 shrink-0">
                  <Image
                    src="/app-icon.jpg"
                    alt="Jaykishan Das (Jay) — Lead Developer"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-foreground">
                    Jaykishan Das (Jay)
                  </h3>
                  <p className="text-sm font-semibold text-pink-500">
                    Lead Software Developer
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    Based in India. Passionate about software development, full-stack technologies, AI-powered applications, and building practical digital solutions.
                  </p>
                </div>
              </div>

              {/* Skill Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  CORE TECHNICAL STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect with Jay Links */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-foreground/80">Connect with Jay:</span>
                  <a
                    href="https://github.com/Itzjay169"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs text-foreground transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>

                  <a
                    href="https://linkedin.com/in/jaykishandas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs text-foreground transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>

                  <a
                    href="https://www.instagram.com/jay_dev._._?obrf=MTh1Z3B0eHo3NHdveQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs text-foreground transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </div>

                <Link href="/contact">
                  <ForgeButton variant="primary" size="sm">
                    <Heart className="w-3.5 h-3.5 mr-1.5 text-pink-300" />
                    <span>Get in Touch</span>
                  </ForgeButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Ready to experience next-generation file workflows?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Try our browser studio with 200+ format converters, EXIF metadata scrubbers, and AI video compressors.
          </p>
          <div className="pt-2">
            <Link href="/studio">
              <ForgeButton variant="primary" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Launch Creative Studio</span>
              </ForgeButton>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
