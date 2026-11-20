'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, FileQuestion } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How can FileForge AI offer 2 GB free uploads without aggressive ads or watermarks?',
      a: 'We leverage efficient client-side WebAssembly compression where possible (such as in-browser WebP/JPEG quantization) and highly optimized headless worker clusters (Sharp, FFmpeg, Ghostscript) that run with minimal overhead. We only charge for high-concurrency batch queues, ultra-large enterprise files, and extended storage retention.'
    },
    {
      q: 'Does FileForge AI remove watermarks to help evade plagiarism or copyright?',
      a: 'Absolutely not. Our AI Content & Watermark Transparency module is strictly built for compliance, intellectual property protection, and provenance. We detect and preserve C2PA metadata, EXIF histories, and digital credentials. Watermark removal is only accessible to verified content owners with legal attestations and immutable audit logging.'
    },
    {
      q: 'What happens to my uploaded files after processing?',
      a: 'Files are processed in isolated ephemeral containers with strictly scoped filesystem boundaries. For free tier sessions, all temporary files and outputs are automatically and permanently shredded after 24 hours. Pro users can configure retention up to 30 days.'
    },
    {
      q: 'How does the Smart Compression engine work?',
      a: 'Smart Compress evaluates the entropy and structure of your file. For raster images, it dynamically adjusts chroma subsampling and SSIM thresholds. For videos, it applies multi-pass CRF rate control with tuned audio psychoacoustics. For PDFs, it linearizes object tables and subsets embedded fonts.'
    },
    {
      q: 'What happens if a requested conversion is lossy or incompatible?',
      a: 'We never promise impossible conversions or silently ruin your files. If you convert a PSD to PNG, we clearly notify you that vector layers and smart objects will be flattened. If you convert a macro-enabled DOCM to DOCX, we warn you that VBA scripts will be stripped before you initiate the job.'
    },
    {
      q: 'Can I compress and convert files offline in my browser?',
      a: 'Yes! Small images (PNG, JPG, WebP) and plain text documents can be compressed entirely client-side without leaving your device. Your data never touches our servers for these lightweight offline tasks.'
    },
    {
      q: 'Is there a REST API for automated backend processing?',
      a: 'Yes. Studio Team subscribers receive API keys and webhook capabilities to integrate FileForge directly into their video rendering, e-commerce image pipelines, or automated document ingest workflows.'
    },
    {
      q: 'Are mobile applications available?',
      a: 'Yes! FileForge AI includes a companion mobile application with camera scanner support, mobile share-sheet integration, background uploads, and offline queueing.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[var(--sk-bg)] border-b-2 border-[var(--sk-line)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Manga Tag */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-3 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>[ACT 08 // ARCHIVE CODEX & FAQ]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--sk-text-muted)] font-medium">
            Clear technical answers on security, file retention, compliance, and our isolated processing architecture.
          </p>
        </div>

        {/* Accordion List with Ink Borders */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <ScrollReveal key={faq.q} delay={idx * 0.04}>
                <div className="bg-[var(--sk-card)] border-2 border-[var(--sk-line)] rounded-2xl overflow-hidden shadow-[4px_6px_0_rgba(109,90,224,0.3)] transition-all">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none hover:bg-[var(--sk-surface-raised)] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-sans uppercase">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[var(--sk-acc)] shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[var(--sk-text-muted)] leading-relaxed border-t-2 border-[var(--sk-border)] font-medium">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
