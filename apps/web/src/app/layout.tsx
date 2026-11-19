import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ForgeToaster } from '@/components/ui/sakuga-toast';
import { MobileNav } from '@/components/layout/mobile-nav';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FileForge AI — Next-Generation Creative File Studio',
  description:
    'Compress up to 90%, convert between 200+ formats, optimize media, and verify AI content provenance with Sakuga-inspired responsive feedback. 2 GB free uploads.',
  keywords: [
    'file compression',
    'file converter',
    'video compress',
    'pdf compress',
    'heic to jpg',
    'webp converter',
    'audio bitrate',
    'c2pa authenticity'
  ],
  authors: [{ name: 'FileForge AI Team' }],
  metadataBase: new URL('https://fileforge.ai'),
  openGraph: {
    title: 'FileForge AI — Creative File Studio',
    description:
      'Universal compression, conversion, optimization, and content provenance with anime-inspired responsiveness.',
    url: 'https://fileforge.ai',
    siteName: 'FileForge AI',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'FileForge AI Studio'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileForge AI — Creative File Studio',
    description: 'Compress, optimize, convert, preview, and share 200+ file formats for free.',
    creator: '@fileforgeai'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${sansFont.variable} ${monoFont.variable} font-sans bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen antialiased selection:bg-pink-500/25 selection:text-pink-300`}>
        {children}
        <ForgeToaster />
        <MobileNav />
      </body>
    </html>
  );
}
