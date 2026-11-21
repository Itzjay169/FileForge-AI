'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Crown, Tag } from 'lucide-react';
import { PLANS } from '@fileforge/shared';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ForgeButton, ForgeToggle, forgeToast } from '@/components/sakuga';

const INR_PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  FREE: { monthly: 0, yearly: 0 },
  PRO_CREATIVE: { monthly: 999, yearly: 849 * 12 },
  STUDIO_TEAM: { monthly: 2999, yearly: 2499 * 12 },
  ENTERPRISE: { monthly: 7999, yearly: 6499 * 12 }
};

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 relative bg-[var(--sk-bg)] border-b-2 border-[var(--sk-line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Manga Tag */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--sk-line)] bg-[var(--sk-surface)] text-xs font-mono font-black text-[var(--sk-acc)] mb-3 shadow-[3px_3px_0_rgba(109,90,224,0.4)]">
            <Tag className="w-3.5 h-3.5" />
            <span>[ACT 07 // STUDIO ACCESS TIERS]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight uppercase font-sans">
            Core Processing is Always Free
          </h2>
          
          <p className="mt-4 text-sm sm:text-base text-muted-foreground font-medium">
            Never pay for everyday optimization. Upgrade only when you need massive multi-threaded batch queues, team workspaces, or dedicated GPU priority.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono font-bold text-emerald-500">
            <span>🇮🇳 Indian Rupee (INR ₹) · Built & Localized for India & Global Creators</span>
          </div>

          {/* Billing Switcher with Real Sakuga VFX Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-3 rounded-2xl bg-card border-2 border-border shadow-[4px_6px_0_rgba(109,90,224,0.35)]">
            <span className={`text-xs font-mono font-bold ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <ForgeToggle
              checked={isAnnual}
              onChange={setIsAnnual}
            />
            <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-500 border border-pink-500/40 text-[10px] font-black">
                SAVE 25%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => {
            const isPopular = plan.isPopular;
            const inrData = INR_PLAN_PRICES[plan.id] || { monthly: plan.priceMonthly * 85, yearly: plan.priceYearly * 85 };
            const price = isAnnual
              ? Math.round(inrData.yearly / 12)
              : inrData.monthly;

            return (
              <ScrollReveal key={plan.id} delay={idx * 0.1}>
                <div
                  className={`h-full rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative border-2 ${
                    isPopular
                      ? 'bg-card border-primary shadow-[8px_10px_0_rgba(255,95,162,0.45)] scale-[1.02] lg:-translate-y-2'
                      : 'bg-card border-border shadow-[6px_8px_0_rgba(109,90,224,0.35)] hover:border-primary/50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-none bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 font-mono border-2 border-primary">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      COMMENDED FOR CREATIVE TEAMS
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-foreground uppercase font-sans">{plan.name}</h3>
                      {isPopular && <Crown className="w-5 h-5 text-amber-500" />}
                    </div>

                    <p className="text-xs text-muted-foreground mb-6 leading-relaxed min-h-[36px] font-mono">
                      {plan.tagline}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-4xl sm:text-5xl font-black text-foreground font-mono">
                        {price === 0 ? '₹0' : `₹${price.toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {inrData.monthly === 0 ? 'forever' : '/month'}
                      </span>
                    </div>
                    {isAnnual && inrData.monthly > 0 && (
                      <p className="text-[11px] font-mono text-primary mb-5 font-bold">
                        Billed annually (₹{inrData.yearly.toLocaleString('en-IN')}/yr)
                      </p>
                    )}
                    {!isAnnual && inrData.monthly > 0 && (
                      <p className="text-[11px] font-mono text-muted-foreground mb-5">
                        Billed monthly in INR (₹)
                      </p>
                    )}
                    {inrData.monthly === 0 && <div className="mb-5" />}

                    <div className="space-y-3 mb-8 pt-6 border-t-2 border-border">
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs text-foreground/80 font-medium">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ForgeButton
                    variant={isPopular ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full shadow-md"
                    onClick={() => {
                      if (plan.id === 'FREE') {
                        forgeToast.success('Free Studio Active', 'You are ready to upload up to 2 GB right now!');
                      } else {
                        forgeToast.info(
                          `${plan.name} Checkout Initiated`,
                          'Stripe sandbox activated for testing.'
                        );
                      }
                    }}
                  >
                    <span>{plan.id === 'FREE' ? 'Get Started Free' : 'Upgrade to ' + plan.name}</span>
                  </ForgeButton>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
