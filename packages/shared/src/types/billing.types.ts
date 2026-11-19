import { PlanTier } from './user.types';

export type PaymentProvider = 'STRIPE' | 'RAZORPAY';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';
export type InvoiceStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type TicketCategory = 'BUG' | 'BILLING' | 'FEATURE' | 'GENERAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Subscription {
  id: string;
  userId: string;
  planTier: PlanTier;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  paymentProvider: PaymentProvider;
  externalSubscriptionId: string;
  createdAt: number;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string | null;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  paidAt: number | null;
  refundedAt: number | null;
  refundReason?: string | null;
  externalInvoiceId: string;
  createdAt: number;
}

export interface CreditPurchase {
  id: string;
  userId: string;
  credits: number;
  amountCents: number;
  paymentProvider: PaymentProvider;
  externalPaymentId: string;
  createdAt: number;
}

export interface UsageMeter {
  userId: string;
  periodStart: number;
  periodEnd: number;
  storageBytes: number;
  processingSeconds: number;
  conversions: number;
  compressions: number;
  premiumActions: number;
  aiAssistantCalls: number;
}

export interface WebhookEvent {
  id: string;
  provider: PaymentProvider;
  eventType: string;
  payload: Record<string, unknown>;
  processedAt: number | null;
  createdAt: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  planTiers: string[];
  percentage: number;
  createdAt: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  body: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string | null;
  response: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenueCents: number;
  totalStorageBytes: number;
  totalJobsProcessed: number;
  failedJobsLast24h: number;
  openTickets: number;
  openAbuseReports: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
}
