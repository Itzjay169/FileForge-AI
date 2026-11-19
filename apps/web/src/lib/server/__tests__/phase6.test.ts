import { accountStore } from '../account-store-service';
import { shareService } from '../share-service';
import { FileForgeClient } from '@fileforge/shared';

async function runPhase6Tests() {
  console.log('⚡ Starting Phase 6: Accounts, Workspaces, Library & Sharing Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------
  // 1. Account Store & Profile Tests
  // ---------------------------------------------------------
  console.log('--- 1. Testing User Profile & Storage Accounting ---');

  const profile = accountStore.getProfile('usr_creative_pro_01');
  assert(profile.planTier === 'PRO_CREATIVE', 'Retrieves PRO_CREATIVE plan tier');
  assert((profile.creditsRemaining ?? 0) > 0, `Profile holds active credit balance (${profile.creditsRemaining} credits)`);

  const updatedProfile = accountStore.updateProfile('usr_creative_pro_01', {
    name: 'Elena Rostova (Studio Lead)'
  });
  assert(updatedProfile.name === 'Elena Rostova (Studio Lead)', 'Updates profile display name');

  const storageInfo = accountStore.getStorageInfo('usr_creative_pro_01');
  assert(storageInfo.usedBytes > 0, `Calculates active storage used: ${storageInfo.usedBytes} bytes`);
  assert(storageInfo.fileCount >= 3, `Aggregates file count (${storageInfo.fileCount} files)`);
  assert(storageInfo.breakdown.images > 0, 'Breaks down image storage bytes');
  assert(storageInfo.breakdown.documents > 0, 'Breaks down document storage bytes');
  assert(storageInfo.breakdown.audio > 0, 'Breaks down audio storage bytes');

  // ---------------------------------------------------------
  // 2. Library, Folders & Favorites Tests
  // ---------------------------------------------------------
  console.log('\n--- 2. Testing File Library, Search, Folders & Favorites ---');

  // Create folder
  const folder = accountStore.createFolder('Animation Keyframes', 'usr_creative_pro_01', '#8b5cf6');
  assert(folder.name === 'Animation Keyframes', 'Creates organized library folder');

  // Add file to library
  const addedFile = accountStore.addFile({
    userId: 'usr_creative_pro_01',
    name: 'explosion-vfx-composite.png',
    sizeBytes: 5200000,
    format: 'png',
    category: 'images',
    storageKey: '2026-11-19/explosion-vfx.png',
    downloadUrl: '/api/files/download?key=2026-11-19/explosion-vfx.png',
    isFavorite: false,
    folderId: folder.id,
    tags: ['explosion', 'vfx', 'sakuga']
  });
  assert(addedFile.name === 'explosion-vfx-composite.png', 'Persists new file to user library');

  // Search by tag
  const tagSearchResults = accountStore.listFiles('usr_creative_pro_01', { search: 'sakuga' });
  assert(tagSearchResults.length >= 1, 'Discovers files via tag search query ("sakuga")');

  // Toggle favorite
  const isFav = accountStore.toggleFavorite(addedFile.id);
  assert(isFav === true, 'Toggles file favorite status to true');

  const favoritesList = accountStore.listFiles('usr_creative_pro_01', { favoritesOnly: true });
  assert(favoritesList.some((f) => f.id === addedFile.id), 'Filters library by favoritesOnly');

  // ---------------------------------------------------------
  // 3. Secure Share Links Tests
  // ---------------------------------------------------------
  console.log('\n--- 3. Testing Secure Share Links, Passwords & Access Ceilings ---');

  // Create public link
  const publicLink = shareService.createShareLink(addedFile, {
    expiresInHours: 48,
    maxDownloads: 5
  });
  assert(publicLink.code.startsWith('sh_'), 'Generates secure share code prefixed with sh_');
  assert(Boolean(publicLink.qrCodeSvg && publicLink.qrCodeSvg.includes('<svg')), 'Generates inline vector QR code SVG');

  // Retrieve public link info
  const fetchedPublic = shareService.getShareLink(publicLink.code);
  assert(fetchedPublic.isAuthorized === true, 'Public link is immediately authorized without password');
  assert(fetchedPublic.link.viewCount >= 1, 'Increments view count analytics');

  // Create password-protected link
  const protectedLink = shareService.createShareLink(addedFile, {
    password: 'SecretForge2026',
    expiresInHours: 24,
    maxDownloads: 2
  });
  assert(protectedLink.hasPassword === true, 'Sets hasPassword flag');

  // Access without password (should require password)
  const unauthAttempt = shareService.getShareLink(protectedLink.code);
  assert(unauthAttempt.isPasswordRequired === true, 'Enforces password requirement');
  assert(unauthAttempt.isAuthorized === false, 'Blocks authorization without correct password');

  // Access with incorrect password (should throw error)
  let failedWrongPass = false;
  try {
    shareService.getShareLink(protectedLink.code, 'WrongPassword!');
  } catch (err: any) {
    if (err.message.includes('INVALID_PASSWORD')) {
      failedWrongPass = true;
    }
  }
  assert(failedWrongPass, 'Rejects invalid password attempt');

  // Access with correct password
  const authorizedAttempt = shareService.getShareLink(protectedLink.code, 'SecretForge2026');
  assert(authorizedAttempt.isAuthorized === true, 'Authorizes access with matching password');

  // Authorize Download & Check Ceiling
  const dl1 = shareService.authorizeDownload(protectedLink.code, 'SecretForge2026');
  assert(Boolean(dl1.downloadUrl.includes('/api/files/download')), 'Generates HMAC signed temporary download URL');

  const dl2 = shareService.authorizeDownload(protectedLink.code, 'SecretForge2026');
  assert(Boolean(dl2.downloadUrl), 'Authorizes second download under ceiling');

  // 3rd download attempt (must exceed maxDownloads: 2)
  let downloadCeilingExceeded = false;
  try {
    shareService.authorizeDownload(protectedLink.code, 'SecretForge2026');
  } catch (err: any) {
    if (err.message.includes('DOWNLOAD_LIMIT_REACHED')) {
      downloadCeilingExceeded = true;
    }
  }
  assert(downloadCeilingExceeded, 'Enforces maximum download limit ceiling (maxDownloads: 2)');

  // ---------------------------------------------------------
  // 4. Team Workspaces & RBAC Tests
  // ---------------------------------------------------------
  console.log('\n--- 4. Testing Team Workspaces & RBAC Permissions ---');

  const newWorkspace = accountStore.createWorkspace('Anime VFX Production Team', 'anime-vfx-team', 'usr_creative_pro_01');
  assert(newWorkspace.slug === 'anime-vfx-team', 'Creates team workspace');

  // OWNER invites EDITOR
  const invitedEditor = accountStore.inviteMember(
    newWorkspace.id,
    'animator@studio.jp',
    'EDITOR',
    'usr_creative_pro_01'
  );
  assert(invitedEditor.role === 'EDITOR', 'Workspace OWNER successfully invites team EDITOR');

  // VIEWER attempts to invite someone (Must Fail RBAC check)
  const invitedViewer = accountStore.inviteMember(
    newWorkspace.id,
    'intern@studio.jp',
    'VIEWER',
    'usr_creative_pro_01'
  );

  let rbacBlocked = false;
  try {
    accountStore.inviteMember(
      newWorkspace.id,
      'hacker@outside.com',
      'ADMIN',
      invitedViewer.userId // VIEWER trying to invite an ADMIN
    );
  } catch (err: any) {
    if (err.message.includes('FORBIDDEN_INVITE')) {
      rbacBlocked = true;
    }
  }
  assert(rbacBlocked, 'RBAC Gate: Blocks VIEWER from inviting workspace members');

  // ---------------------------------------------------------
  // 5. Shared TypeScript API Client Tests
  // ---------------------------------------------------------
  console.log('\n--- 5. Testing Shared TypeScript API Client ---');

  const client = new FileForgeClient({
    baseUrl: 'http://localhost:3000',
    authToken: 'sample_bearer_token'
  });
  assert(typeof client.getProfile === 'function', 'Shared client defines getProfile method');
  assert(typeof client.listFiles === 'function', 'Shared client defines listFiles method');
  assert(typeof client.createShareLink === 'function', 'Shared client defines createShareLink method');
  assert(typeof client.createWorkspace === 'function', 'Shared client defines createWorkspace method');

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  console.log('\n=============================================');
  console.log(`Phase 6 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase6Tests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
