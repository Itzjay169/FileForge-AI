import crypto from 'crypto';
import {
  PlanTier,
  PaymentProvider,
  Subscription,
  Invoice,
  CreditPurchase,
  UsageMeter,
  WebhookEvent,
  QuotaCheckResult,
  PLANS
} from '@fileforge/shared';
import { AccountStoreService } from './account-store-service';

export class BillingService {
  private static instance: BillingService;

  private subscriptions: Map<string, Subscription> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private creditPurchases: Map<string, CreditPurchase> = new Map();
  private usageMeters: Map<string, UsageMeter> = new Map();
  private webhookEvents: Map<string, WebhookEvent> = new Map();

  private constructor() {
    this.seedDefaultData();
  }

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  private seedDefaultData() {
    const defaultUserId = 'usr_creative_pro_01';
    const subId = 'sub_creative_pro_active';

    const sub: Subscription = {
      id: subId,
      userId: defaultUserId,
      planTier: 'PRO_CREATIVE',
      status: 'ACTIVE',
      currentPeriodStart: Date.now() - 86400000 * 15,
      currentPeriodEnd: Date.now() + 86400000 * 15,
      cancelAtPeriodEnd: false,
      paymentProvider: 'STRIPE',
      externalSubscriptionId: 'sub_stripe_demo_8829',
      createdAt: Date.now() - 86400000 * 15
    };
    this.subscriptions.set(sub.id, sub);

    // Seed default invoice
    const invId = 'inv_creative_pro_101';
    this.invoices.set(invId, {
      id: invId,
      userId: defaultUserId,
      subscriptionId: subId,
      amountCents: 1200, // $12.00
      currency: 'usd',
      status: 'PAID',
      description: 'FileForge Pro Creative — Monthly Subscription',
      paidAt: Date.now() - 86400000 * 15,
      refundedAt: null,
      externalInvoiceId: 'in_stripe_demo_101',
      createdAt: Date.now() - 86400000 * 15
    });

    // Seed default usage meter
    this.usageMeters.set(defaultUserId, {
      userId: defaultUserId,
      periodStart: Date.now() - 86400000 * 15,
      periodEnd: Date.now() + 86400000 * 15,
      storageBytes: 425000000,
      processingSeconds: 1420,
      conversions: 84,
      compressions: 112,
      premiumActions: 18,
      aiAssistantCalls: 32
    });
  }

  public getPlans() {
    return PLANS;
  }

  public getSubscription(userId: string): Subscription | null {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId && sub.status !== 'CANCELED') {
        return sub;
      }
    }
    return null;
  }

  public createSubscription(
    userId: string,
    planTier: PlanTier,
    paymentProvider: PaymentProvider = 'STRIPE'
  ): Subscription {
    // Existing active subscription check - cancel prior
    const existing = this.getSubscription(userId);
    if (existing) {
      existing.status = 'CANCELED';
    }

    const subId = `sub_${crypto.randomUUID().slice(0, 8)}`;
    const now = Date.now();
    const periodEnd = now + 86400000 * 30; // 30 days

    const sub: Subscription = {
      id: subId,
      userId,
      planTier,
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      paymentProvider,
      externalSubscriptionId: `sub_ext_${crypto.randomUUID().slice(0, 12)}`,
      createdAt: now
    };
    this.subscriptions.set(sub.id, sub);

    // Update account profile
    const accountStore = AccountStoreService.getInstance();
    accountStore.updateProfile(userId, { planTier });

    // Generate Invoice for paid plans
    const plan = PLANS.find((p) => p.id === planTier);
    const amountCents = plan ? plan.priceMonthly * 100 : 0;
    if (amountCents > 0) {
      this.createInvoice(userId, sub.id, amountCents, `FileForge ${plan?.name || planTier} Subscription`);
    }

    return sub;
  }

  public cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Subscription {
    const sub = this.subscriptions.get(subscriptionId);
    if (!sub) {
      throw new Error(`Subscription not found: ${subscriptionId}`);
    }

    if (cancelAtPeriodEnd) {
      sub.cancelAtPeriodEnd = true;
    } else {
      sub.status = 'CANCELED';
      const accountStore = AccountStoreService.getInstance();
      accountStore.updateProfile(sub.userId, { planTier: 'FREE' });
    }

    return sub;
  }

  public purchaseCredits(
    userId: string,
    credits: number,
    amountCents: number,
    paymentProvider: PaymentProvider = 'STRIPE'
  ): CreditPurchase {
    const purchase: CreditPurchase = {
      id: `cp_${crypto.randomUUID().slice(0, 8)}`,
      userId,
      credits,
      amountCents,
      paymentProvider,
      externalPaymentId: `pay_${crypto.randomUUID().slice(0, 12)}`,
      createdAt: Date.now()
    };
    this.creditPurchases.set(purchase.id, purchase);

    // Increment user balance
    const accountStore = AccountStoreService.getInstance();
    const profile = accountStore.getProfile(userId);
    const newBal = (profile.creditsBalance || 0) + credits;
    accountStore.updateProfile(userId, {
      creditsBalance: newBal,
      creditsRemaining: newBal
    });

    // Create Invoice
    this.createInvoice(userId, null, amountCents, `FileForge ${credits} Processing Credits Pack`);

    return purchase;
  }

  public createInvoice(
    userId: string,
    subscriptionId: string | null,
    amountCents: number,
    description: string
  ): Invoice {
    const invoice: Invoice = {
      id: `inv_${crypto.randomUUID().slice(0, 8)}`,
      userId,
      subscriptionId,
      amountCents,
      currency: 'usd',
      status: 'PAID',
      description,
      paidAt: Date.now(),
      refundedAt: null,
      externalInvoiceId: `in_ext_${crypto.randomUUID().slice(0, 12)}`,
      createdAt: Date.now()
    };
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  public refundInvoice(invoiceId: string, reason?: string): Invoice {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice not found: ${invoiceId}`);
    }
    if (invoice.status === 'REFUNDED') {
      return invoice;
    }

    invoice.status = 'REFUNDED';
    invoice.refundedAt = Date.now();
    invoice.refundReason = reason || 'Customer requested refund within policy window';

    return invoice;
  }

  public getInvoices(userId: string): Invoice[] {
    return Array.from(this.invoices.values())
      .filter((inv) => inv.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  public processWebhook(
    provider: PaymentProvider,
    eventType: string,
    payload: Record<string, unknown>
  ): WebhookEvent {
    const event: WebhookEvent = {
      id: `wh_${crypto.randomUUID().slice(0, 8)}`,
      provider,
      eventType,
      payload,
      processedAt: Date.now(),
      createdAt: Date.now()
    };
    this.webhookEvents.set(event.id, event);

    // React to webhook event types
    if (eventType === 'invoice.payment_failed') {
      const subId = (payload.subscriptionId as string) || '';
      const sub = this.subscriptions.get(subId);
      if (sub) {
        sub.status = 'PAST_DUE';
      }
    } else if (eventType === 'customer.subscription.deleted') {
      const subId = (payload.subscriptionId as string) || '';
      const sub = this.subscriptions.get(subId);
      if (sub) {
        sub.status = 'CANCELED';
      }
    }

    return event;
  }

  public getUsageMeter(userId: string): UsageMeter {
    let meter = this.usageMeters.get(userId);
    if (!meter) {
      meter = {
        userId,
        periodStart: Date.now(),
        periodEnd: Date.now() + 86400000 * 30,
        storageBytes: 0,
        processingSeconds: 0,
        conversions: 0,
        compressions: 0,
        premiumActions: 0,
        aiAssistantCalls: 0
      };
      this.usageMeters.set(userId, meter);
    }
    return meter;
  }

  public incrementUsage(
    userId: string,
    metric: 'storageBytes' | 'processingSeconds' | 'conversions' | 'compressions' | 'premiumActions' | 'aiAssistantCalls',
    amount = 1
  ): void {
    const meter = this.getUsageMeter(userId);
    meter[metric] = (meter[metric] || 0) + amount;
  }

  public checkQuota(
    userId: string,
    action: 'CONVERT' | 'COMPRESS' | 'PREMIUM' | 'AI_ASSISTANT' | 'UPLOAD',
    sizeBytes?: number
  ): QuotaCheckResult {
    const profile = AccountStoreService.getInstance().getProfile(userId);
    const plan = PLANS.find((p) => p.id === profile.planTier) || PLANS[0];
    const meter = this.getUsageMeter(userId);

    if (action === 'UPLOAD' && sizeBytes) {
      if (sizeBytes > plan.maxFileSizeBytes) {
        return {
          allowed: false,
          reason: `File size (${Math.round(sizeBytes / 1024 / 1024)}MB) exceeds limit (${Math.round(plan.maxFileSizeBytes / 1024 / 1024)}MB) for ${plan.name}. Upgrade to increase limit.`
        };
      }
      if (profile.storageUsedBytes + sizeBytes > profile.storageLimitBytes) {
        return {
          allowed: false,
          reason: 'Workspace storage capacity exceeded. Please upgrade plan or delete older files.'
        };
      }
    }

    if (action === 'CONVERT' && plan.dailyConversions !== 'UNLIMITED') {
      if (meter.conversions >= plan.dailyConversions) {
        return {
          allowed: false,
          reason: `Daily conversion limit of ${plan.dailyConversions} reached for ${plan.name}. Upgrade to Pro for unlimited conversions.`
        };
      }
    }

    return { allowed: true };
  }
}
