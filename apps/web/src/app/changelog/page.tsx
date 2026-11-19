'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Tag, Calendar, ArrowRight, GitCommit } from 'lucide-react';
import { ChangelogEntry } from '@fileforge/shared';
import { ForgeButton } from '@/components/sakuga';

export default function ChangelogPage() {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/changelog')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setChangelogs(data.changelog);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Header */}
        <div className="text-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Evolution & Release Notes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Changelog & Updates</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            Explore the latest features, performance enhancements, and security upgrades shipped to FileForge AI.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-white/10 ml-4 sm:ml-8 mt-10 space-y-12">
          {changelogs.map((entry, index) => {
            const isFeature = entry.type === 'FEATURE';
            const isImprovement = entry.type === 'IMPROVEMENT';
            return (
              <div key={entry.id || index} className="relative pl-6 sm:pl-10">
                {/* Dot */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-[#0a0a0f] ${
                    isFeature ? 'bg-pink-500 shadow-pink-500/50 shadow-md' : isImprovement ? 'bg-violet-400' : 'bg-emerald-400'
                  }`}
                />

                <div className="p-6 sm:p-7 rounded-3xl bg-[#12121c] border border-white/10 shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-violet-300">
                        {entry.version}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isFeature
                            ? 'bg-pink-950/70 text-pink-400 border border-pink-500/30'
                            : isImprovement
                            ? 'bg-violet-950/70 text-violet-300 border border-violet-500/30'
                            : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{entry.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscribe banner */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#12121c] to-pink-950/40 border border-white/10">
          <GitCommit className="w-8 h-8 text-violet-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Stay in sync with our fast release cycle</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            We deploy multiple performance and codec upgrades every week. Follow our journey on GitHub or join our Discord.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="https://github.com/Itzjay169/FileForge-AI" target="_blank" rel="noopener noreferrer">
              <ForgeButton variant="primary">View GitHub Repository</ForgeButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
