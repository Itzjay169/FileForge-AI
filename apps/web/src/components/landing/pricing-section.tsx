'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Shield, Building2, Crown } from 'lucide-react';
import { SakugaButton } from '@/components/ui/sakuga-button';
import { PLANS } from '@fileforge/shared';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { forgeToast } from '@/components/ui/sakuga-toast';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 relative bg-[#09090f] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 inline-block mb-3">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Core Compression is Always Free
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Never pay for everyday optimization. Upgrade only when you need massive batch pipelines, extended archival cloud storage, or dedicated worker priority.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !isAnnual ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                25% OFF
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => {
            const isPopular = plan.isPopular;
            const price = isAnnual
              ? Math.round(plan.priceYearly / 12)
              : plan.priceMonthly;

            return (
              <ScrollReveal key={plan.id} delay={idx * 0.1}>
                <div
                  className={`h-full rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#1c142c] to-[#120d20] border-2 border-violet-500 shadow-2xl shadow-violet-950/60'
                      : 'bg-[#12121c] border border-white/10'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-pink-500/30 flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3 h-3" />
                      Most Popular for Creators
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white font-sans">{plan.name}</h3>
                      {isPopular && <Crown className="w-5 h-5 text-amber-400" />}
                    </div>

                    <p className="text-xs text-gray-400 mb-6 leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-6">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                        ${price}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {plan.priceMonthly === 0 ? 'forever' : '/month'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8 pt-6 border-t border-white/10">
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <SakugaButton
                    variant={isPopular ? 'default' : 'secondary'}
                    size="default"
                    className="w-full"
                    onClick={() => {
                      if (plan.id === 'FREE') {
                        forgeToast.success('Free Studio Active', 'You are ready to upload up to 2 GB right now!');
                      } else {
                        forgeToast.info(
                          `${plan.name} Checkout Initiated`,
                          'Stripe checkout sandbox enabled for Phase 1.'
                        );
                      }
                    }}
                  >
                    <span>{plan.id === 'FREE' ? 'Get Started Free' : 'Upgrade to ' + plan.name}</span>
                  </SakugaButton>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
