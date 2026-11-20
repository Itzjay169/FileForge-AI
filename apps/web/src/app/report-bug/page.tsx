import type { Metadata } from 'next';
import { ReportBugClient } from './report-bug-client';

export const metadata: Metadata = {
  title: 'Report a Bug — FileForge AI',
  description:
    'Submit a detailed bug report or issue to the FileForge AI development team. Help us improve our free creative file studio toolkit.',
  openGraph: {
    title: 'Report a Bug — FileForge AI',
    description:
      'Found a bug or broken button? Submit direct diagnostic feedback to our engineering team.',
  },
};

export default function ReportBugPage() {
  return <ReportBugClient />;
}
