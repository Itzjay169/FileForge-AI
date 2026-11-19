import React from 'react';
import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';

export default function AcceptableUsePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold mb-2">
            <AlertOctagon className="w-4 h-4" />
            <span>Platform Integrity & Rules</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Acceptable Use Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last Updated: November 20, 2026</p>
        </div>

        <div className="mt-8 space-y-8 text-xs text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Purpose & Scope</h2>
            <p>
              This Acceptable Use Policy (&quot;AUP&quot;) governs all access to FileForge AI, our cloud transcoding nodes, client SDKs, REST APIs, and team collaboration workspaces. This policy exists to protect the safety of users, the stability of our distributed computing infrastructure, and compliance with domestic and international digital rights laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Prohibited Content</h2>
            <p>
              You may not upload, transcode, compress, store, or transmit any files containing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><strong>Child Sexual Exploitation & Abuse:</strong> Any material depicting child sexual abuse or exploitation (CSAM/CSAE) will trigger immediate account termination and automated referral to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement.</li>
              <li><strong>Malicious Payloads:</strong> Viruses, trojans, worms, rootkits, ransomware, disguised executable binaries (e.g., MZ/ELF binaries masquerading as images), or SVG files containing executable script injections.</li>
              <li><strong>Infringing Intellectual Property:</strong> Media files that infringe copyright, trademark, trade secret, or other proprietary rights of third parties without documented authorization.</li>
              <li><strong>Illegal or Harmful Materials:</strong> Instructions for manufacturing illicit weapons, explosives, or illegal substances, or non-consensual intimate imagery.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Prohibited Infrastructure Activities</h2>
            <p>
              You agree not to engage in or attempt to execute any of the following activities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Server-Side Request Forgery (SSRF) probing targeting internal RFC 1918 subnets, cloud metadata IPs (e.g., 169.254.169.254), or loopback addresses (127.0.0.1).</li>
              <li>Denial of Service (DoS/DDoS) attacks against our edge gateways or cluster worker daemons.</li>
              <li>Automated scraping, excessive polling, or abusive batch queuing intended to degrade service performance for other creators.</li>
              <li>Attempting to bypass account storage quotas, daily conversion limits, or subscription paywalls.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Enforcement & Moderation</h2>
            <p>
              Violations of this policy may result in immediate warning notices, cancellation of queued jobs, temporary suspension, or permanent account banning without refund. FileForge AI reserves the right to cooperate fully with legal authorities in the investigation of suspected criminal activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. Reporting Abusive Activity</h2>
            <p>
              To report abuse, phishing payloads, or copyright infringement hosted or processed on FileForge AI, please submit an abuse report via our <Link href="/contact" className="text-pink-400 underline">Contact Center</Link> or email abuse@fileforge.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
