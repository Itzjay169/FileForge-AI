import type { Metadata } from 'next';
import { AboutClient } from './about-client';

export const metadata: Metadata = {
  title: 'About FileForge AI — Mission, Studio & Vexora Technology',
  description:
    'Learn about FileForge AI, our free-forever commitment to creator workflows, and the team at Vexora Technology led by Jaykishan Das.',
  openGraph: {
    title: 'About FileForge AI — Built to Make File Work Simpler',
    description:
      'Universal compression, conversion, optimization, and content provenance. Built by Vexora Technology.',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
