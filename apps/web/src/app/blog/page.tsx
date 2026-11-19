import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { ForgeButton } from '@/components/sakuga';

export default function BlogPage() {
  const posts = [
    {
      title: 'Introducing FileForge AI: The Sakuga-Inspired High-Throughput Media Engine',
      slug: 'introducing-fileforge-ai',
      excerpt: 'Why we combined fluid Japanese animation design principles with extreme performance transcoding: zero-trust malware gates, universal format matrices, and multi-threaded worker pools.',
      category: 'Product Launch',
      readTime: '4 min read',
      date: 'November 2026',
      author: 'FileForge Engineering',
      featured: true
    },
    {
      title: 'Under the Hood: How Perceptual Quantization Crushes Video Bitrates by 85%',
      slug: 'perceptual-video-quantization',
      excerpt: 'A deep dive into our dynamic CRF tuning, multi-pass AV1/HEVC encoding, and audio stem normalization that makes 4K videos ready for WhatsApp and email attachments without visible artifacts.',
      category: 'Deep Tech',
      readTime: '7 min read',
      date: 'November 2026',
      author: 'Media Infrastructure Team',
      featured: false
    },
    {
      title: 'The Future of Digital Provenance: C2PA Cryptography & Transparent AI Labels',
      slug: 'c2pa-cryptography-ai-provenance',
      excerpt: 'How we verify cryptographic Content Credentials, inspect EXIF/IPTC metadata trees, and empower artists with legal ownership verification and responsible AI disclosure.',
      category: 'Ethics & Security',
      readTime: '6 min read',
      date: 'November 2026',
      author: 'Security & Compliance Lead',
      featured: false
    },
    {
      title: 'Architecting Real-Time Workspaces with RBAC & Zero-Knowledge Share Gates',
      slug: 'real-time-workspaces-rbac',
      excerpt: 'How we engineered team workspaces, expiring HMAC-signed download links with vector QR codes, and our cross-platform React Native Expo mobile app.',
      category: 'Architecture',
      readTime: '5 min read',
      date: 'November 2026',
      author: 'Core Platform Team',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow Header */}
        <div className="text-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Engineering & Design Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">The FileForge AI Journal</h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            Technical write-ups, compression benchmarks, codec tutorials, and announcements from our engineering studio.
          </p>
        </div>

        {/* Featured Post */}
        {posts[0] && (
          <div className="mt-6 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1c1433] via-[#12121c] to-[#0a0a0f] border border-violet-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-pink-500 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Featured
                </span>
                <span className="text-xs text-violet-400 font-semibold">{posts[0].category}</span>
                <span className="text-xs text-gray-500">• {posts[0].readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 leading-tight">
                {posts[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                {posts[0].excerpt}
              </p>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10 text-xs text-gray-400">
                <span>By {posts[0].author}</span>
                <span>•</span>
                <span>{posts[0].date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Other Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {posts.slice(1).map((post, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#12121c] border border-white/10 shadow-xl flex flex-col justify-between hover:border-violet-500/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-violet-300 font-medium text-[10px]">
                    {post.category}
                  </span>
                  <span className="text-[11px]">{post.readTime}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-4 group-hover:text-pink-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                <span>{post.date}</span>
                <span className="text-violet-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
