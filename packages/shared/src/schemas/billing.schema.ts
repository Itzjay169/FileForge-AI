import { z } from 'zod';

export const CreateSubscriptionSchema = z.object({
  planTier: z.enum(['FREE', 'PRO_CREATIVE', 'STUDIO_TEAM', 'ENTERPRISE']),
  paymentProvider: z.enum(['STRIPE', 'RAZORPAY']).default('STRIPE')
});

export const CancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1),
  cancelAtPeriodEnd: z.boolean().default(true)
});

export const PurchaseCreditsSchema = z.object({
  credits: z.number().int().positive(),
  amountCents: z.number().int().positive(),
  paymentProvider: z.enum(['STRIPE', 'RAZORPAY']).default('STRIPE')
});

export const RefundInvoiceSchema = z.object({
  invoiceId: z.string().min(1),
  reason: z.string().min(3).optional()
});

export const CreateSupportTicketSchema = z.object({
  userEmail: z.string().email(),
  subject: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
  category: z.enum(['BUG', 'BILLING', 'FEATURE', 'GENERAL']).default('GENERAL'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW')
});

export const UpdateFeatureFlagSchema = z.object({
  enabled: z.boolean().optional(),
  percentage: z.number().min(0).max(100).optional(),
  planTiers: z.array(z.string()).optional()
});

export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  category: z.enum(['BUG', 'BILLING', 'FEATURE', 'GENERAL']).default('GENERAL')
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type CancelSubscriptionInput = z.infer<typeof CancelSubscriptionSchema>;
export type PurchaseCreditsInput = z.infer<typeof PurchaseCreditsSchema>;
export type CreateSupportTicketInput = z.infer<typeof CreateSupportTicketSchema>;
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
