import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ForgeToaster } from '@/components/ui/sakuga-toast';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SakugaProvider } from '@/components/providers/sakuga-provider';
import { ForgeToastProvider } from '@/components/sakuga/forge-toast';

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
  icons: {
    icon: '/app-icon.jpg',
    apple: '/apple-touch-icon.jpg',
  },
  openGraph: {
    title: 'FileForge AI — Creative File Studio',
    description:
      'Universal compression, conversion, optimization, and content provenance with anime-inspired responsiveness.',
    url: 'https://fileforge.ai',
    siteName: 'FileForge AI',
    images: [
      {
        url: '/app-icon.jpg',
        width: 512,
        height: 512,
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
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('fileforge-theme') || 'dark';
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className={`${sansFont.variable} ${monoFont.variable} font-sans bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen antialiased selection:bg-pink-500/25 selection:text-pink-300`}>
        <SakugaProvider>
          <ForgeToastProvider>
            {children}
            <ForgeToaster />
            <MobileNav />
          </ForgeToastProvider>
        </SakugaProvider>
      </body>
    </html>
  );
}
