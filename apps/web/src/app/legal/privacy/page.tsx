import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold mb-2">
            <Lock className="w-4 h-4" />
            <span>Privacy & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Effective Date: November 20, 2026</p>
        </div>

        <div className="mt-8 space-y-8 text-xs text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Our Commitment to Your Privacy</h2>
            <p>
              FileForge AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is engineered around strict data minimization and user confidentiality. We do not sell, rent, or trade your personal information or submitted media to data brokers, advertisers, or third parties. We never use your uploaded files to train public artificial intelligence models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Information We Collect</h2>
            <p>
              We collect information necessary to deliver, bill, and protect our file processing infrastructure:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li><strong>Account Credentials:</strong> Email address, hashed password, display name, and avatar URL.</li>
              <li><strong>Billing Data:</strong> Payment details handled directly by certified Level 1 PCI-DSS compliant providers (Stripe, Razorpay). We do not store raw credit card numbers.</li>
              <li><strong>Telemetry & Usage:</strong> Storage byte count, processing duration, job completion status, and error logs.</li>
              <li><strong>Uploaded File Binaries:</strong> Stored transiently in encrypted object storage (AES-256) strictly for transcoding execution.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Zero-Retention Free Tier & Data Purging</h2>
            <p>
              Files uploaded by unregistered or Free Studio users are isolated in ephemeral scratch volumes and irrevocably deleted 24 hours after job completion. On paid tiers, files are stored until you delete them or your configured retention period expires (30 to 365 days).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Security Infrastructure</h2>
            <p>
              All communication with FileForge AI occurs over HTTPS encrypted via TLS 1.3 with HSTS enforcement. Storage at rest is encrypted using AES-256 with rotating KMS keys. Uploaded binaries are sanitized through automated anti-malware and SSRF gateway filters prior to worker dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. GDPR & European Privacy Rights</h2>
            <p>
              Under the General Data Protection Regulation (GDPR), European Economic Area (EEA) residents have the right to request access to personal data, rectification of inaccurate data, deletion (&quot;Right to be Forgotten&quot;), and data portability. To exercise these rights, submit a request via our Contact Center or email dpo@fileforge.ai.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">6. California Consumer Privacy Rights (CCPA)</h2>
            <p>
              Under the California Consumer Privacy Act (CCPA), California residents have the right to know what personal data is collected and request deletion. We do not sell personal information or retain media files beyond declared transcoding timelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">7. Contact the Data Protection Officer</h2>
            <p>
              For privacy inquiries, audit requests, or data deletion petitions, contact our Data Protection Office at privacy@fileforge.ai or visit our <Link href="/contact" className="text-pink-400 underline">Support Desk</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
