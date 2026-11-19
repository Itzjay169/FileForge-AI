import React from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold mb-2">
            <RefreshCcw className="w-4 h-4" />
            <span>Customer Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund Policy</h1>
          <p className="text-xs text-gray-400 mt-2">Last Updated: November 20, 2026</p>
        </div>

        <div className="mt-8 space-y-8 text-xs text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">1. 7-Day Money-Back Guarantee for Subscriptions</h2>
            <p>
              We want you to be completely satisfied with FileForge AI. If you subscribe to any paid plan (Pro Creative or Studio Team) and determine within seven (7) days of your initial purchase that the Service does not meet your studio requirements, you are entitled to a full 100% refund of your initial subscription fee.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">2. Pay-As-You-Go Credit Pack Refunds</h2>
            <p>
              One-time credit packages purchased for high-volume batch processing, OCR, or 4K video transcoding are eligible for a full refund within thirty (30) days of purchase, provided that less than 10% of the purchased credits have been consumed. Partially consumed credit packages may be granted a pro-rated refund at our discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">3. Annual Plan Pro-Rated Cancellations</h2>
            <p>
              For annual billing commitments canceled after the initial 7-day period, refunds are calculated pro-rata based on the standard non-discounted monthly rate for the active months used, minus payment processor transaction fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">4. Non-Refundable Items & Circumstances</h2>
            <p>
              Refunds will not be granted under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>Accounts terminated due to confirmed violations of our Acceptable Use Policy (e.g., malware distribution, phishing, child exploitation material, or unauthorized copyright infringement).</li>
              <li>Subscriptions where more than 1,000 files or 100 GB of transcoding throughput have been processed during the billing cycle.</li>
              <li>Enterprise custom engineering contracts with bespoke VPC infrastructure deployment and SLA clauses.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white">5. How to Submit a Refund Request</h2>
            <p>
              To request a refund, submit an inquiry via our <Link href="/contact" className="text-pink-400 underline">Contact Center</Link> selecting the &quot;Billing & Invoices&quot; category, or email billing@fileforge.ai with your registered email and Invoice ID. Refunds are processed within 5-10 business days directly to your original payment method.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
