import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold mb-2">
            <Shield className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-gray-400 mt-2">Last Updated: November 20, 2026</p>
        </div>

        <div className="mt-8 space-y-8 text-xs text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or utilizing the FileForge AI platform, APIs, web interfaces, mobile applications, or associated cloud transcoding infrastructure (collectively, the &quot;Service&quot;), you confirm that you have read, understood, and agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must immediately discontinue your use of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Service Description & SLA</h2>
            <p>
              FileForge AI provides cloud-based and client-assisted file compression, transcoding, format transformation, image editing, PDF page manipulation, EXIF inspection, content authenticity reporting, and workspace collaboration. While we strive for 99.99% service availability, we do not guarantee uninterrupted execution except where explicitly governed by an Enterprise Service Level Agreement (SLA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. User Accounts & Workspaces</h2>
            <p>
              To access extended quotas and team workspaces, you must register an account. You agree to maintain the security of your credentials and accept sole responsibility for all actions performed under your account. Team Workspace Owners and Admins are responsible for managing member access levels (Editor, Viewer) and revoking unauthorized privileges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. User Content & Intellectual Property</h2>
            <p>
              You retain 100% full ownership of any text, images, video, audio, code, 3D meshes, or documents you submit to the Service (&quot;User Content&quot;). FileForge AI claims no ownership or copyright over your media. By processing files on our infrastructure, you grant FileForge AI solely the transient, worldwide, non-exclusive license strictly necessary to store, transcode, compress, or manipulate your media at your direction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. File Retention & Automated Purging</h2>
            <p>
              Files uploaded under the Free Studio plan are automatically purged and shredded from our cache servers within twenty-four (24) hours of processing. Pro Creative and Studio Team files remain accessible for thirty (30) to ninety (90) days according to your plan configuration. You are solely responsible for downloading and archiving your transformed files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">6. Provenance & Watermark Transparency Compliance</h2>
            <p>
              FileForge AI strictly prohibits the unauthorized removal of third-party copyright markers, digital watermarks, or embedded C2PA provenance credentials for fraudulent, deceptive, or infringing purposes. Our verified watermark removal tools are accessible solely upon electronic certification of legitimate copyright ownership or documented licensing authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">7. Fees, Subscriptions & Cancellations</h2>
            <p>
              Paid subscriptions (Pro Creative, Studio Team, Enterprise) are billed on a recurring monthly or annual basis. You may cancel your subscription at any time via your workspace settings. Cancellation stops future recurring charges, with your benefits remaining active through the current billing term.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, FileForge AI and its officers, directors, and employees shall not be liable for any indirect, incidental, punitive, or consequential damages, or any loss of data, profits, or goodwill arising out of your access to or inability to use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">9. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any legal disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts located in India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">10. Contact Information</h2>
            <p>
              Questions regarding these Terms of Service should be directed to legal@fileforge.ai or via our <Link href="/contact" className="text-pink-400 underline">Contact Center</Link>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
