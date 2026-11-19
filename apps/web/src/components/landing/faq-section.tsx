'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
      a: 'Yes! FileForge AI includes a React Native Expo application with camera scanner support, mobile share-sheet integration, background uploads, and offline queueing.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#07070b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 inline-block mb-3">
            Knowledge Base
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Clear answers on security, file retention, compliance, and our processing architecture.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <ScrollReveal key={faq.q} delay={idx * 0.05}>
                <div className="bg-[#12121c] border border-white/10 rounded-2xl overflow-hidden transition-colors">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold text-white font-sans">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-violet-400"
                    >
                      <ChevronDown className="w-5 h-5" />
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
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5">
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
