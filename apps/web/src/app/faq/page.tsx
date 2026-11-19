'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the maximum file size I can upload and transcode?',
      a: 'Free users can upload up to 2 GB per single file. Pro Creative plans support up to 10 GB, Studio Team allows up to 50 GB, and Enterprise accounts enjoy custom ceilings of 100 GB+ with dedicated streaming worker buffers.'
    },
    {
      q: 'How many different file formats does FileForge AI support?',
      a: 'FileForge AI natively supports over 100+ formats spanning images (PNG, JPG, WebP, AVIF, TIFF, SVG, RAW), video (MP4, MKV, WebM, MOV, AVI), audio (MP3, WAV, FLAC, AAC, OGG), documents (PDF, DOCX, XLSX, PPTX, EPUB, TXT), archives (ZIP, 7Z, TAR, GZ), and 3D geometry (OBJ, STL, PLY).'
    },
    {
      q: 'Does compression degrade the visual fidelity of my files?',
      a: 'We offer both mathematically Lossless compression (which preserves 100% of the original pixel/bit data while stripping redundant metadata) and Perceptually Lossless smart compression that optimizes quality factor to achieve up to 80-90% byte reduction without human-discernible artifacts.'
    },
    {
      q: 'How does FileForge AI ensure privacy and security for my confidential files?',
      a: 'All uploads are validated using zero-trust binary header inspection, scanned for malware signatures, and encrypted at rest using AES-256 and in transit via TLS 1.3. On the Free tier, files are permanently shredded after 24 hours. We never train generative models on your private media.'
    },
    {
      q: 'Can I remove watermarks from my own media files?',
      a: 'Yes, but solely through our verified legal ownership workflow. To comply with international copyright law, you must electronically certify authorized ownership, submit verifiable documentation, and agree to audit logging. We do not support stripping third-party copyright markers without authorization.'
    },
    {
      q: 'How does the AI Assistant operate and verify user intent?',
      a: 'Our natural language assistant parses conversational commands (e.g., "Compress this video for Discord") and synthesizes an exact preview plan showing parameters, size targets, and output format. Processing never starts until you give explicit user confirmation.'
    },
    {
      q: 'Is there a mobile application available?',
      a: 'Yes! FileForge AI includes an official React Native Expo application for iOS and Android featuring instant camera document scanning, gallery imports, OS share-sheet intake, background upload queues, and biometric lock.'
    },
    {
      q: 'How do team workspaces and permissions work?',
      a: 'Workspaces let teams collaborate on shared asset libraries with strict Role-Based Access Control (RBAC): Owners have complete billing and deletion authority; Admins can invite members and configure integrations; Editors can upload, convert, and manage assets; Viewers have read-only preview access.'
    },
    {
      q: 'Do you offer REST APIs and Webhooks for automated pipelines?',
      a: 'Yes, Studio Team and Enterprise tiers have full access to our programmatic REST APIs, client SDKs (TypeScript, Python), and webhook event emitters for headless CI/CD build pipelines and studio transcoding automation.'
    },
    {
      q: 'What is your refund policy?',
      a: 'We provide a 7-day no-questions-asked refund guarantee on all new monthly and annual subscriptions. Unused pay-as-you-go credit packages are eligible for a full refund within 30 days of purchase.'
    },
    {
      q: 'What are C2PA Content Credentials and how do they benefit me?',
      a: 'C2PA (Coalition for Content Provenance and Authenticity) is an open standard that cryptographically signs image and document history. FileForge AI inspects and displays provenance manifests and lets you attach verifiable AI Disclosure stamps to your exports.'
    },
    {
      q: 'Can I self-host FileForge AI on our private corporate cloud?',
      a: 'Yes. Enterprise plans include turnkey containerized deployment guides and Helm charts for private Kubernetes clusters on AWS, Azure, Google Cloud, or bare-metal servers with zero data ever leaving your intranet.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Header */}
        <div className="text-center py-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base & Answers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Frequently Asked Questions</h1>
          <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
            Clear, transparent answers regarding engine capabilities, security measures, file retention, and subscription policies.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 mt-6">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-[#12121c] border border-white/10 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-3">
                    <span className="text-violet-400 font-mono text-xs">0{i + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-pink-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-gray-300 leading-relaxed border-t border-white/5 bg-black/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-[#12121c] border border-white/10">
          <MessageCircle className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Still have questions?</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Our engineering and support team is ready to answer questions about proprietary codecs or custom studio pipelines.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/contact">
              <ForgeButton variant="primary">Contact Us</ForgeButton>
            </Link>
            <Link href="/help">
              <ForgeButton variant="secondary">Browse Help Center</ForgeButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
