/**
 * Phase 7 Automated Test Suite
 * Monetization, Subscriptions, Invoices, Usage Metering, Admin Operations & Analytics
 */

import { BillingService } from '../billing-service';
import { AdminService } from '../admin-service';
import { AccountStoreService } from '../account-store-service';
import { PLANS } from '@fileforge/shared';

let passes = 0;
let failures = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    failures++;
    console.log(`  ❌ [FAIL] ${message}`);
  } else {
    passes++;
    console.log(`  ✅ [PASS] ${message}`);
  }
}

async function runPhase7Tests() {
  console.log('⚡ Starting Phase 7: Monetization, Admin & Analytics Test Suite...\n');

  const billingService = BillingService.getInstance();
  const adminService = AdminService.getInstance();
  const accountStore = AccountStoreService.getInstance();

  const testUserId = 'usr_phase7_tester_01';
  accountStore.getProfile(testUserId); // Initializes default profile

  // ---------------------------------------------------------
  // 1. Billing Plans & Subscriptions
  // ---------------------------------------------------------
  console.log('--- 1. Testing Billing Plans, Subscriptions & Invoicing ---');

  const plans = billingService.getPlans();
  assert(plans.length === 4, `Retrieves all 4 plan tiers (found ${plans.length})`);

  const enterprisePlan = plans.find((p) => p.id === 'ENTERPRISE');
  assert(!!enterprisePlan, 'Enterprise plan exists in plan matrix');
  assert(enterprisePlan?.priceMonthly === 99, `Enterprise monthly price is $99 (got $${enterprisePlan?.priceMonthly})`);
  assert(enterprisePlan?.concurrentJobs === 200, `Enterprise supports 200 concurrent jobs`);

  const sub = billingService.createSubscription(testUserId, 'PRO_CREATIVE', 'STRIPE');
  assert(sub.status === 'ACTIVE', 'Creates ACTIVE subscription for user');
  assert(sub.planTier === 'PRO_CREATIVE', 'Subscription tier is PRO_CREATIVE');
  assert(sub.currentPeriodEnd > Date.now(), 'Sets valid 30-day billing period window');

  const retrievedSub = billingService.getSubscription(testUserId);
  assert(retrievedSub?.id === sub.id, 'Retrieves active subscription by userId');

  const cancelledSub = billingService.cancelSubscription(sub.id, true);
  assert(cancelledSub.cancelAtPeriodEnd === true, 'Sets cancelAtPeriodEnd flag to true');
  assert(cancelledSub.status === 'ACTIVE', 'Status remains ACTIVE until end of period when cancelAtPeriodEnd is true');

  const unknownSub = billingService.getSubscription('non_existent_user_999');
  assert(unknownSub === null, 'Returns null for user without active subscription');

  // ---------------------------------------------------------
  // 2. Credits, Invoices & Refunds
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing Credits, Invoices & Refund Guarantees ---');

  const purchase = billingService.purchaseCredits(testUserId, 250, 2500, 'STRIPE');
  assert(purchase.credits === 250, 'Purchases 250 processing credits');
  assert(purchase.amountCents === 2500, 'Records purchase amount: $25.00');

  const userProfile = accountStore.getProfile(testUserId);
  assert((userProfile.creditsBalance || 0) >= 250, `Increments user profile balance (${userProfile.creditsBalance} credits)`);

  const invoices = billingService.getInvoices(testUserId);
  assert(invoices.length >= 2, `Generates invoices for subscription & credit purchase (found ${invoices.length})`);

  const creditInvoice = invoices.find((inv) => inv.amountCents === 2500);
  assert(creditInvoice?.status === 'PAID', 'Credit invoice starts in PAID status');

  if (creditInvoice) {
    const refundedInvoice = billingService.refundInvoice(creditInvoice.id, 'Customer requested 7-day policy refund');
    assert(refundedInvoice.status === 'REFUNDED', 'Updates invoice status to REFUNDED');
    assert(refundedInvoice.refundedAt !== null, 'Records timestamp of refund execution');
    assert(refundedInvoice.refundReason?.includes('7-day policy') === true, 'Logs refund rationale');
  }

  // ---------------------------------------------------------
  // 3. Usage Metering & Quotas
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing Usage Metering & Quota Gate Enforcement ---');

  const meter = billingService.getUsageMeter(testUserId);
  assert(meter.userId === testUserId, 'Retrieves usage meter for user');

  const initialConversions = meter.conversions;
  billingService.incrementUsage(testUserId, 'conversions', 5);
  billingService.incrementUsage(testUserId, 'compressions', 3);
  billingService.incrementUsage(testUserId, 'processingSeconds', 120);

  const updatedMeter = billingService.getUsageMeter(testUserId);
  assert(updatedMeter.conversions === initialConversions + 5, `Increments conversion count by 5 (now ${updatedMeter.conversions})`);
  assert(updatedMeter.compressions >= 3, `Increments compression counter`);
  assert(updatedMeter.processingSeconds >= 120, `Increments processing runtime seconds`);

  // Quota verification
  const quotaCheckAllowed = billingService.checkQuota(testUserId, 'UPLOAD', 500 * 1024 * 1024); // 500MB
  assert(quotaCheckAllowed.allowed === true, 'Allows upload within plan file ceiling');

  const quotaCheckOversized = billingService.checkQuota(testUserId, 'UPLOAD', 20 * 1024 * 1024 * 1024); // 20GB on Pro (limit is 10GB)
  assert(quotaCheckOversized.allowed === false, 'Enforces file size ceiling and blocks oversized upload');
  assert(quotaCheckOversized.reason?.includes('exceeds limit') === true, 'Provides informative upgrade reason');

  // ---------------------------------------------------------
  // 4. Webhook Processing & Payment Recovery
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing Webhook Event Processing & Payment Recovery ---');

  const testSubId = sub.id;
  const webhookEvent = billingService.processWebhook('STRIPE', 'invoice.payment_failed', {
    subscriptionId: testSubId,
    failureReason: 'card_declined'
  });
  assert(webhookEvent.eventType === 'invoice.payment_failed', 'Processes invoice.payment_failed webhook');
  assert(webhookEvent.processedAt !== null, 'Timestamps processed webhook event');

  const subAfterFailedPayment = billingService.getSubscription(testUserId);
  assert(subAfterFailedPayment?.status === 'PAST_DUE', 'Transitions subscription to PAST_DUE for failed payment recovery');

  // ---------------------------------------------------------
  // 5. Admin Dashboard & User Management
  // ---------------------------------------------------------
  console.log('\n--- 5. Testing Admin Dashboard, Users & Ban Gates ---');

  const dashboardStats = adminService.getDashboardStats();
  assert(dashboardStats.totalUsers >= 5, `Aggregates total user count (${dashboardStats.totalUsers} users)`);
  assert(dashboardStats.activeSubscriptions >= 1, `Calculates active subscriptions (${dashboardStats.activeSubscriptions})`);
  assert(dashboardStats.monthlyRevenueCents > 0, `Aggregates monthly MRR ($${dashboardStats.monthlyRevenueCents / 100})`);
  assert(dashboardStats.totalJobsProcessed > 0, `Computes historical processed jobs (${dashboardStats.totalJobsProcessed})`);

  const userList = adminService.listUsers(1, 10);
  assert(userList.users.length >= 5, `Lists users with pagination (returned ${userList.users.length})`);

  const searchResult = adminService.listUsers(1, 10, 'Elena');
  assert(searchResult.users.length >= 1, 'Discovers user by name search query');

  const targetUser = 'usr_free_04';
  adminService.banUser(targetUser, 'Security violation test');
  const userListAfterBan = adminService.listUsers(1, 10, 'alex.chen');
  const bannedUser = userListAfterBan.users.find((u) => u.id === targetUser);
  assert(bannedUser?.isBanned === true, 'Admin successfully bans user');
  assert(bannedUser?.banReason === 'Security violation test', 'Stores ban rationale');

  adminService.unbanUser(targetUser);
  const userListAfterUnban = adminService.listUsers(1, 10, 'alex.chen');
  const unbannedUser = userListAfterUnban.users.find((u) => u.id === targetUser);
  assert(unbannedUser?.isBanned === false, 'Admin successfully unbans user');

  // ---------------------------------------------------------
  // 6. Job Supervision, Revenue Breakdown & Telemetry
  // ---------------------------------------------------------
  console.log('\n--- 6. Testing Job Telemetry, Revenue & System Health ---');

  const jobList = adminService.listJobs(1, 10);
  assert(jobList.jobs.length >= 5, `Lists cluster jobs (returned ${jobList.jobs.length})`);

  const completedJobs = adminService.listJobs(1, 10, 'COMPLETED');
  assert(completedJobs.jobs.every((j) => j.status === 'COMPLETED'), 'Filters jobs by COMPLETED status');

  const failedJobs = adminService.listJobs(1, 10, 'FAILED');
  assert(failedJobs.jobs.length >= 1, 'Tracks failed jobs with error diagnostic details');
  assert(failedJobs.jobs[0].error !== null, 'Diagnostic error message preserved for failed job');

  const revenueBreakdown = adminService.getRevenueBreakdown(4);
  assert(revenueBreakdown.length === 4, `Generates monthly revenue breakdown for 4 periods`);
  assert(revenueBreakdown[0].totalRevenueCents > 0, 'Computes total period revenue');

  const fileTypeStats = adminService.getFileTypeUsage();
  assert(fileTypeStats.length >= 5, 'Provides file-type usage distribution metrics');
  assert(fileTypeStats.some((f) => f.format === 'PNG'), 'Includes PNG transcoding statistics');

  const systemStatuses = adminService.getSystemStatus();
  assert(systemStatuses.length >= 6, `Monitors 6 core infrastructure services`);
  assert(systemStatuses.every((s) => s.latencyMs > 0), 'Measures latency across edge services');

  // ---------------------------------------------------------
  // 7. Feature Flags & Support Desk
  // ---------------------------------------------------------
  console.log('\n--- 7. Testing Dynamic Feature Flags & Support Desk ---');

  const flags = adminService.listFeatureFlags();
  assert(flags.length >= 3, `Maintains feature flags (found ${flags.length})`);

  const batchFlag = flags.find((f) => f.id === 'flag_batch_v2');
  assert(batchFlag?.enabled === true, 'Batch transcoding flag is active');

  const updatedFlag = adminService.updateFeatureFlag('flag_video_4k_prores', { enabled: true, percentage: 50 });
  assert(updatedFlag.enabled === true, 'Updates feature flag enablement');
  assert(updatedFlag.percentage === 50, 'Updates rollout percentage');

  const newTicket = adminService.createSupportTicket({
    userId: testUserId,
    userEmail: 'tester@fileforge.ai',
    subject: 'WebM transparency alpha channel preservation query',
    body: 'Does VP9 codec transcode preserve alpha channel transparency?',
    category: 'FEATURE',
    priority: 'MEDIUM'
  });
  assert(newTicket.status === 'OPEN', 'Creates new support ticket in OPEN state');

  const openTickets = adminService.listSupportTickets('OPEN');
  assert(openTickets.some((t) => t.id === newTicket.id), 'Lists open support tickets');

  const resolvedTicket = adminService.updateTicket(newTicket.id, {
    status: 'RESOLVED',
    response: 'Yes, VP9 with pixel format yuva420p fully preserves alpha.'
  });
  assert(resolvedTicket.status === 'RESOLVED', 'Transitions support ticket to RESOLVED');
  assert(resolvedTicket.response !== null, 'Records engineer response');

  const changelog = adminService.listChangelog();
  assert(changelog.length >= 4, `Provides release notes and changelog (found ${changelog.length} entries)`);

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  console.log('\n=============================================');
  console.log(`Phase 7 Test Summary: ${passes} Passed, ${failures} Failed`);
  console.log('=============================================');

  if (failures > 0) {
    process.exit(1);
  }
}

runPhase7Tests().catch((err) => {
  console.error('Fatal Phase 7 test runner error:', err);
  process.exit(1);
});
