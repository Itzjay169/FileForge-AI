import { PrismaClient, PlanTier, UserRole } from '@prisma/client';
import { PLANS } from '@fileforge/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Starting FileForge AI database seed...');

  // 1. Seed Plans
  console.log('Seeding Subscription Plans...');
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        description: plan.tagline,
        priceMonthlyCents: plan.priceMonthly * 100,
        priceYearlyCents: plan.priceYearly * 100,
        fileLimitBytes: BigInt(plan.maxFileSizeBytes),
        dailyProcessingLimit: plan.dailyConversions === 'UNLIMITED' ? -1 : plan.dailyConversions,
        concurrentJobsLimit: plan.concurrentJobs,
        retentionDays: plan.retentionDays,
        featuresJson: plan.features,
        isActive: true
      },
      create: {
        id: plan.id,
        name: plan.name,
        slug: plan.id.toLowerCase().replace(/_/g, '-'),
        description: plan.tagline,
        priceMonthlyCents: plan.priceMonthly * 100,
        priceYearlyCents: plan.priceYearly * 100,
        fileLimitBytes: BigInt(plan.maxFileSizeBytes),
        dailyProcessingLimit: plan.dailyConversions === 'UNLIMITED' ? -1 : plan.dailyConversions,
        concurrentJobsLimit: plan.concurrentJobs,
        retentionDays: plan.retentionDays,
        featuresJson: plan.features,
        isActive: true
      }
    });
  }

  // 2. Seed Admin & Demo Users
  console.log('Seeding Demo & Admin Users...');
  const demoUser = await prisma.user.upsert({
    where: { email: 'creator@fileforge.ai' },
    update: {},
    create: {
      email: 'creator@fileforge.ai',
      name: 'Aiko Tanaka',
      role: UserRole.USER,
      planTier: PlanTier.PRO_CREATIVE,
      creditsBalance: 500,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      storageUsedBytes: BigInt(1024 * 1024 * 350) // 350 MB
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fileforge.ai' },
    update: {},
    create: {
      email: 'admin@fileforge.ai',
      name: 'Forge Lead Architect',
      role: UserRole.ADMIN,
      planTier: PlanTier.STUDIO_TEAM,
      creditsBalance: 99999,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      storageUsedBytes: BigInt(1024 * 1024 * 1024 * 5) // 5 GB
    }
  });

  // 3. Seed Sample Files
  console.log('Seeding Sample Files...');
  const sampleFile = await prisma.file.upsert({
    where: { storageKey: 'seed/sakuga-cinematic-reel.mov' },
    update: {},
    create: {
      userId: demoUser.id,
      originalName: 'sakuga-cinematic-reel.mov',
      sanitizedName: 'sakuga-cinematic-reel-1700000000.mov',
      storageKey: 'seed/sakuga-cinematic-reel.mov',
      s3Bucket: 'fileforge-storage',
      mimeType: 'video/quicktime',
      extension: 'mov',
      sizeBytes: BigInt(142 * 1024 * 1024), // 142 MB
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      metadataJson: {
        width: 3840,
        height: 2160,
        fps: 60,
        codec: 'prores_422',
        durationSec: 45.2
      }
    }
  });

  // 4. Seed Audit Log Record
  console.log('Seeding Sample Audit Logs...');
  await prisma.auditLog.create({
    data: {
      userId: demoUser.id,
      action: 'SYSTEM_SEED_INITIALIZED',
      resourceType: 'SYSTEM',
      resourceId: 'INIT-001',
      detailsJson: {
        environment: 'development',
        timestamp: new Date().toISOString()
      }
    }
  });

  console.log('✅ FileForge AI seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
