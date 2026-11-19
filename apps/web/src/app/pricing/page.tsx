'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  Zap,
  Crown,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coins,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { PLANS } from '@fileforge/shared';
import { ForgeButton } from '@/components/sakuga';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subscribingTier, setSubscribingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (tier === 'FREE') return;
    setSubscribingTier(tier);
    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planTier: tier, paymentProvider: 'STRIPE' })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully subscribed to ${tier}! Welcome aboard.`);
      } else {
        alert(data.error || 'Failed to initialize subscription');
      }
    } catch {
      alert('Subscription network error');
    } finally {
      setSubscribingTier(null);
    }
  };

  const faqs = [
    {
      q: 'Can I switch or cancel my plan at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any moment from your workspace settings. If you cancel, your benefits remain active until the end of your billing cycle.'
    },
    {
      q: 'How does the 24-hour vs 30-day retention work?',
      a: 'Free tier files are permanently expunged 24 hours after completion for maximum privacy. Pro, Studio, and Enterprise files remain encrypted in your dedicated cloud library for 30 to 365 days.'
    },
    {
      q: 'What happens if I exceed my daily conversion limit on Free?',
      a: 'Once you reach the 25 conversions/day free quota, you can either wait for the midnight UTC reset, purchase a pay-as-you-go credit pack, or upgrade to Pro Creative for unlimited daily jobs.'
    },
    {
      q: 'Do you offer custom Enterprise SLAs and VPC deployments?',
      a: 'Yes. Our Enterprise tier includes custom on-premise or private VPC clusters (AWS, Azure, GCP) with zero-data-retention compliance, SOC2 Type II audit reports, and 99.99% uptime guarantees.'
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept all major credit/debit cards (Visa, MasterCard, Amex) via Stripe, as well as UPI, NetBanking, and international cards via Razorpay. Enterprise customers can also pay via wire transfer or ACH.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 selection:bg-pink-500 selection:text-white">
      {/* Glow Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Flexible Creator & Enterprise Plans</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto">
          Scale your media workflow with <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">zero friction</span>.
        </h1>
        <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          From solo artists to global multimedia studios. High-throughput lossless compression, universal conversions, and AI transparency built for scale.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-[#12121c] border border-white/10 shadow-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white animate-pulse">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => {
            const isPopular = plan.id === 'PRO_CREATIVE';
            const isEnterprise = plan.id === 'ENTERPRISE';
            const price = billingCycle === 'yearly' ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between backdrop-blur-xl border ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#18122c] to-[#12121c] border-violet-500/50 shadow-2xl shadow-violet-950/50'
                    : 'bg-[#12121c]/90 border-white/10 shadow-xl'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-[10px] font-extrabold tracking-wider uppercase text-white shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {plan.id === 'FREE' && <Zap className="w-5 h-5 text-gray-400" />}
                      {plan.id === 'PRO_CREATIVE' && <Crown className="w-5 h-5 text-violet-400" />}
                      {plan.id === 'STUDIO_TEAM' && <Building2 className="w-5 h-5 text-pink-400" />}
                      {plan.id === 'ENTERPRISE' && <ShieldCheck className="w-5 h-5 text-amber-400" />}
                      {plan.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-gray-400 min-h-[32px]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">/ month</span>
                  </div>
                  {billingCycle === 'yearly' && plan.priceMonthly > 0 && (
                    <p className="text-[11px] text-pink-400 mt-1 font-medium">
                      Billed ${plan.priceYearly}/year
                    </p>
                  )}

                  <hr className="my-6 border-white/10" />

                  {/* Features */}
                  <ul className="space-y-3 text-xs text-gray-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  {plan.id === 'FREE' ? (
                    <Link href="/studio">
                      <ForgeButton variant="secondary" className="w-full justify-center">
                        Start Free
                      </ForgeButton>
                    </Link>
                  ) : isEnterprise ? (
                    <Link href="/contact">
                      <ForgeButton variant="secondary" className="w-full justify-center">
                        Contact Enterprise
                      </ForgeButton>
                    </Link>
                  ) : (
                    <ForgeButton
                      variant={isPopular ? 'default' : 'secondary'}
                      className="w-full justify-center"
                      disabled={subscribingTier === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {subscribingTier === plan.id ? 'Processing...' : `Upgrade to ${plan.name}`}
                    </ForgeButton>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Credit Pack Add-on Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-950/40 via-[#12121c] to-pink-950/40 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Need Pay-As-You-Go Credits?</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Don&apos;t need a monthly subscription? Purchase credits on demand for high-volume OCR, 4K video transcoding, and batch jobs.
              </p>
            </div>
          </div>
          <Link href="/dashboard">
            <ForgeButton variant="primary" className="whitespace-nowrap">
              <span>View Credit Packs</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </ForgeButton>
          </Link>
        </div>
      </div>

      {/* Pricing FAQs */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-400 mt-2">Everything you need to know about billing, quotas, and subscriptions.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-[#12121c] border border-white/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-violet-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-violet-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-gray-300 leading-relaxed border-t border-white/5 bg-black/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
