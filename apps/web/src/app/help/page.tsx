import React from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  FileArchive,
  RefreshCw,
  Sparkles,
  CreditCard,
  User,
  ArrowRight,
  Shield,
  MessageSquare
} from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';

export default function HelpCenterPage() {
  const categories = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Quickstart tutorials on upload pipelines, keyboard shortcuts, and engine settings.',
      articles: [
        'How FileForge AI handles in-browser instant compression',
        'Navigating the Sakuga workspace and command palette',
        'Configuring default output folders and batch settings'
      ]
    },
    {
      icon: FileArchive,
      title: 'Smart Compression Engine',
      description: 'Lossless vs lossy algorithms, target size optimization, and bitrates.',
      articles: [
        'How target size prediction avoids quality degradation',
        'WebP, AVIF, and JPEG XL next-gen image presets',
        'Optimizing 4K video for WhatsApp, Discord, and Email attachments'
      ]
    },
    {
      icon: RefreshCw,
      title: 'Universal Conversions',
      description: 'Matrix compatibility routing, multi-page documents, and 3D asset conversion.',
      articles: [
        'Converting vector SVG paths to CMYK PDF without rasterization',
        'Lossy conversion warnings and font embedding rules',
        'Converting CAD and 3D mesh files (OBJ, STL, PLY)'
      ]
    },
    {
      icon: Sparkles,
      title: 'AI Studio & Provenance',
      description: 'C2PA credentials, EXIF inspection, and transparent watermark management.',
      articles: [
        'Understanding the Content Authenticity Initiative (C2PA)',
        'Adding AI Disclosure badges to your exported media',
        'Submitting verified ownership claims for copyright watermarks'
      ]
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Plan upgrades, invoice history, payment methods, and credit packs.',
      articles: [
        'How daily conversion quota resets at midnight UTC',
        'Understanding processing minutes vs storage allocation',
        'Requesting pro-rated refunds under our 7-day guarantee'
      ]
    },
    {
      icon: User,
      title: 'Workspaces & Team RBAC',
      description: 'Managing team members, role privileges, and password-protected sharing.',
      articles: [
        'Owner, Admin, Editor, and Viewer permission matrix',
        'Generating self-destructing and max-download share links',
        'Connecting custom webhooks for automated studio notifications'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Header */}
        <div className="text-center py-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          <h1 className="text-4xl sm:text-5xl font-black text-white">How can we assist your workflow?</h1>
          <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
            Explore guides, technical API references, and troubleshooting docs for FileForge AI.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides, format docs, error codes..."
              className="w-full bg-[#12121c] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 shadow-xl"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#12121c] border border-white/10 shadow-xl flex flex-col justify-between hover:border-violet-500/30 transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-pink-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{cat.description}</p>

                  <ul className="mt-5 space-y-2.5">
                    {cat.articles.map((art, aIdx) => (
                      <li key={aIdx} className="text-xs text-gray-300 hover:text-pink-400 flex items-center gap-2 cursor-pointer transition-colors">
                        <ArrowRight className="w-3 h-3 text-violet-400 shrink-0" />
                        <span className="truncate">{art}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#12121c] to-pink-950/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Need tailored enterprise assistance?</h3>
              <p className="text-xs text-gray-400 mt-1">
                Our support team and solutions architects are available 24/7 for custom deployments and SLA inquiries.
              </p>
            </div>
          </div>
          <Link href="/contact">
            <ForgeButton variant="primary">Contact Support</ForgeButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
