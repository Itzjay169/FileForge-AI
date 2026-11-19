import crypto from 'crypto';
import {
  UserProfile,
  UserStorageInfo,
  UserFileRecord,
  UserFolder,
  Workspace,
  WorkspaceMember,
  WorkspaceRole
} from '@fileforge/shared';

/**
 * Account, Library & Workspace Store Service
 * In-memory ledger with database persistence hooks.
 */
export class AccountStoreService {
  private static instance: AccountStoreService;

  private profiles: Map<string, UserProfile> = new Map();
  private files: Map<string, UserFileRecord> = new Map();
  private folders: Map<string, UserFolder> = new Map();
  private workspaces: Map<string, Workspace> = new Map();
  private workspaceMembers: Map<string, WorkspaceMember[]> = new Map();

  private constructor() {
    this.seedDefaultData();
  }

  public static getInstance(): AccountStoreService {
    if (!AccountStoreService.instance) {
      AccountStoreService.instance = new AccountStoreService();
    }
    return AccountStoreService.instance;
  }

  private seedDefaultData() {
    // Default Pro Creator user
    const defaultUserId = 'usr_creative_pro_01';
    const defaultWorkspaceId = 'ws_creative_studio';

    this.profiles.set(defaultUserId, {
      id: defaultUserId,
      email: 'creator@fileforge.studio',
      name: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'USER' as const,
      planTier: 'PRO_CREATIVE',
      creditsBalance: 485,
      creditsRemaining: 485,
      storageUsedBytes: 425000000, // 425 MB
      storageLimitBytes: 50 * 1024 * 1024 * 1024, // 50 GB
      activeWorkspaceId: defaultWorkspaceId,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Default workspace
    this.workspaces.set(defaultWorkspaceId, {
      id: defaultWorkspaceId,
      name: 'Creative VFX Studio',
      slug: 'creative-vfx-studio',
      ownerId: defaultUserId,
      planTier: 'PRO_CREATIVE',
      storageUsedBytes: 425000000,
      storageLimitBytes: 50 * 1024 * 1024 * 1024,
      memberCount: 3,
      createdAt: Date.now() - 86400000 * 30
    });

    this.workspaceMembers.set(defaultWorkspaceId, [
      {
        id: 'mem_1',
        workspaceId: defaultWorkspaceId,
        userId: defaultUserId,
        userEmail: 'creator@fileforge.studio',
        userName: 'Elena Rostova',
        role: 'OWNER',
        joinedAt: Date.now() - 86400000 * 30
      },
      {
        id: 'mem_2',
        workspaceId: defaultWorkspaceId,
        userId: 'usr_editor_02',
        userEmail: 'kenji@sakuga-vfx.org',
        userName: 'Kenji Sato',
        role: 'ADMIN',
        joinedAt: Date.now() - 86400000 * 15
      },
      {
        id: 'mem_3',
        workspaceId: defaultWorkspaceId,
        userId: 'usr_viewer_03',
        userEmail: 'client@agency.com',
        userName: 'Agency Reviewer',
        role: 'VIEWER',
        joinedAt: Date.now() - 86400000 * 5
      }
    ]);

    // Seed folders
    const folderDesign = 'fld_design_assets';
    const folderReports = 'fld_client_reports';
    this.folders.set(folderDesign, {
      id: folderDesign,
      userId: defaultUserId,
      workspaceId: defaultWorkspaceId,
      name: 'Brand Key Art',
      color: '#8b5cf6',
      createdAt: Date.now() - 86400000 * 20
    });
    this.folders.set(folderReports, {
      id: folderReports,
      userId: defaultUserId,
      workspaceId: defaultWorkspaceId,
      name: 'Pitch Decks & PDF',
      color: '#ec4899',
      createdAt: Date.now() - 86400000 * 10
    });

    // Seed sample files
    this.files.set('fil_101', {
      id: 'fil_101',
      userId: defaultUserId,
      workspaceId: defaultWorkspaceId,
      name: 'sakuga-impact-keyframe.png',
      sizeBytes: 3200000,
      format: 'png',
      category: 'images',
      storageKey: '2026-11-19/sakuga-keyframe.png',
      downloadUrl: '/api/files/download?key=2026-11-19/sakuga-keyframe.png',
      isFavorite: true,
      folderId: folderDesign,
      tags: ['vfx', 'keyframe', '4k'],
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2
    });

    this.files.set('fil_102', {
      id: 'fil_102',
      userId: defaultUserId,
      workspaceId: defaultWorkspaceId,
      name: 'q4-investor-presentation.pdf',
      sizeBytes: 14500000,
      format: 'pdf',
      category: 'documents',
      storageKey: '2026-11-19/investor-presentation.pdf',
      downloadUrl: '/api/files/download?key=2026-11-19/investor-presentation.pdf',
      isFavorite: false,
      folderId: folderReports,
      tags: ['pitch', 'confidential', 'q4'],
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1
    });

    this.files.set('fil_103', {
      id: 'fil_103',
      userId: defaultUserId,
      workspaceId: defaultWorkspaceId,
      name: 'trailer-audio-stem.wav',
      sizeBytes: 42000000,
      format: 'wav',
      category: 'audio',
      storageKey: '2026-11-19/trailer-stem.wav',
      downloadUrl: '/api/files/download?key=2026-11-19/trailer-stem.wav',
      isFavorite: true,
      tags: ['audio', 'trailer', 'lossless'],
      createdAt: Date.now() - 86400000 * 4,
      updatedAt: Date.now() - 86400000 * 4
    });
  }

  // --- Profile & Storage ---

  public getProfile(userId = 'usr_creative_pro_01'): UserProfile {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = {
        id: userId,
        email: `${userId}@fileforge.ai`,
        name: 'Creator',
        avatarUrl: null,
        role: 'USER' as const,
        planTier: 'FREE',
        creditsBalance: 50,
        creditsRemaining: 50,
        storageUsedBytes: 0,
        storageLimitBytes: 5 * 1024 * 1024 * 1024,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.profiles.set(userId, profile);
    }
    return profile;
  }

  public updateProfile(userId: string, data: Partial<UserProfile>): UserProfile {
    const existing = this.getProfile(userId);
    const updated = { ...existing, ...data };
    this.profiles.set(userId, updated);
    return updated;
  }

  public getStorageInfo(userId = 'usr_creative_pro_01'): UserStorageInfo {
    const profile = this.getProfile(userId);
    const userFiles = Array.from(this.files.values()).filter((f) => f.userId === userId);

    const breakdown = {
      images: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      archives: 0,
      others: 0
    };

    let totalBytes = 0;
    for (const file of userFiles) {
      totalBytes += file.sizeBytes;
      if (file.category === 'images') breakdown.images += file.sizeBytes;
      else if (file.category === 'video') breakdown.videos += file.sizeBytes;
      else if (file.category === 'audio') breakdown.audio += file.sizeBytes;
      else if (file.category === 'documents') breakdown.documents += file.sizeBytes;
      else if (file.category === 'archives') breakdown.archives += file.sizeBytes;
      else breakdown.others += file.sizeBytes;
    }

    return {
      usedBytes: totalBytes,
      limitBytes: profile.storageLimitBytes,
      usagePercent: Math.round((totalBytes / profile.storageLimitBytes) * 100),
      fileCount: userFiles.length,
      breakdown
    };
  }

  // --- Files & Library ---

  public listFiles(
    userId = 'usr_creative_pro_01',
    options?: {
      search?: string;
      category?: string;
      folderId?: string;
      favoritesOnly?: boolean;
      workspaceId?: string;
    }
  ): UserFileRecord[] {
    let list = Array.from(this.files.values()).filter(
      (f) => f.userId === userId || (options?.workspaceId && f.workspaceId === options.workspaceId)
    );

    if (options?.favoritesOnly) {
      list = list.filter((f) => f.isFavorite);
    }

    if (options?.category && options.category !== 'all') {
      list = list.filter((f) => f.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options?.folderId) {
      list = list.filter((f) => f.folderId === options.folderId);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.format.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  public getFile(fileId: string): UserFileRecord | undefined {
    return this.files.get(fileId);
  }

  public addFile(file: Omit<UserFileRecord, 'id' | 'createdAt' | 'updatedAt'>): UserFileRecord {
    const id = `fil_${crypto.randomUUID().substring(0, 8)}`;
    const now = Date.now();
    const record: UserFileRecord = {
      ...file,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.files.set(id, record);
    return record;
  }

  public updateFile(fileId: string, updates: Partial<UserFileRecord>): UserFileRecord {
    const file = this.files.get(fileId);
    if (!file) throw new Error(`File ${fileId} not found`);
    const updated = { ...file, ...updates, updatedAt: Date.now() };
    this.files.set(fileId, updated);
    return updated;
  }

  public deleteFile(fileId: string): boolean {
    return this.files.delete(fileId);
  }

  public toggleFavorite(fileId: string): boolean {
    const file = this.files.get(fileId);
    if (!file) throw new Error(`File ${fileId} not found`);
    file.isFavorite = !file.isFavorite;
    file.updatedAt = Date.now();
    this.files.set(fileId, file);
    return file.isFavorite;
  }

  // --- Folders ---

  public listFolders(userId = 'usr_creative_pro_01'): UserFolder[] {
    return Array.from(this.folders.values())
      .filter((f) => f.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public createFolder(name: string, userId = 'usr_creative_pro_01', color?: string, parentId?: string): UserFolder {
    const id = `fld_${crypto.randomUUID().substring(0, 8)}`;
    const folder: UserFolder = {
      id,
      userId,
      name,
      color: color || '#8b5cf6',
      parentId,
      createdAt: Date.now()
    };
    this.folders.set(id, folder);
    return folder;
  }

  // --- Workspaces & RBAC ---

  public listWorkspaces(userId = 'usr_creative_pro_01'): Workspace[] {
    const userWorkspaceIds = new Set<string>();
    for (const [wsId, members] of this.workspaceMembers.entries()) {
      if (members.some((m) => m.userId === userId)) {
        userWorkspaceIds.add(wsId);
      }
    }

    return Array.from(this.workspaces.values()).filter((ws) => userWorkspaceIds.has(ws.id));
  }

  public createWorkspace(name: string, slug: string, ownerId = 'usr_creative_pro_01'): Workspace {
    const id = `ws_${crypto.randomUUID().substring(0, 8)}`;
    const workspace: Workspace = {
      id,
      name,
      slug,
      ownerId,
      planTier: 'PRO_CREATIVE',
      storageUsedBytes: 0,
      storageLimitBytes: 100 * 1024 * 1024 * 1024,
      memberCount: 1,
      createdAt: Date.now()
    };
    this.workspaces.set(id, workspace);

    const ownerMember: WorkspaceMember = {
      id: `mem_${crypto.randomUUID().substring(0, 8)}`,
      workspaceId: id,
      userId: ownerId,
      userEmail: 'creator@fileforge.studio',
      userName: 'Workspace Owner',
      role: 'OWNER',
      joinedAt: Date.now()
    };
    this.workspaceMembers.set(id, [ownerMember]);

    return workspace;
  }

  public getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
    return this.workspaceMembers.get(workspaceId) || [];
  }

  public inviteMember(
    workspaceId: string,
    email: string,
    role: WorkspaceRole,
    inviterUserId = 'usr_creative_pro_01'
  ): WorkspaceMember {
    const members = this.workspaceMembers.get(workspaceId) || [];
    const inviter = members.find((m) => m.userId === inviterUserId);

    // RBAC: Only OWNER or ADMIN can invite new members
    if (!inviter || (inviter.role !== 'OWNER' && inviter.role !== 'ADMIN')) {
      throw new Error('FORBIDDEN_INVITE: Only Workspace Owners or Admins can invite team members.');
    }

    const newMember: WorkspaceMember = {
      id: `mem_${crypto.randomUUID().substring(0, 8)}`,
      workspaceId,
      userId: `usr_${crypto.randomUUID().substring(0, 8)}`,
      userEmail: email,
      userName: email.split('@')[0],
      role,
      joinedAt: Date.now()
    };

    members.push(newMember);
    this.workspaceMembers.set(workspaceId, members);

    const ws = this.workspaces.get(workspaceId);
    if (ws) {
      ws.memberCount = members.length;
      this.workspaces.set(workspaceId, ws);
    }

    return newMember;
  }
}

export const accountStore = AccountStoreService.getInstance();
