import {
  UserProfile,
  UserStorageInfo,
  UserFileRecord,
  UserFolder,
  ShareLink,
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from '../types/account.types';

export interface FileForgeClientConfig {
  baseUrl: string;
  authToken?: string;
  timeoutMs?: number;
}

export class FileForgeClient {
  private baseUrl: string;
  private authToken?: string;
  private timeoutMs: number;

  constructor(config: FileForgeClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.authToken = config.authToken;
    this.timeoutMs = config.timeoutMs || 30000;
  }

  public setAuthToken(token?: string) {
    this.authToken = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>)
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || data.error || `HTTP error ${res.status}`);
    }

    return data as T;
  }

  // --- Profile & Storage ---

  public async getProfile(): Promise<UserProfile> {
    const res = await this.request<{ profile: UserProfile }>('/api/user/profile');
    return res.profile;
  }

  public async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<UserProfile> {
    const res = await this.request<{ profile: UserProfile }>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.profile;
  }

  public async getStorageInfo(): Promise<UserStorageInfo> {
    const res = await this.request<{ storage: UserStorageInfo }>('/api/user/storage');
    return res.storage;
  }

  // --- Files & Library ---

  public async listFiles(params?: {
    search?: string;
    category?: string;
    folderId?: string;
    favoritesOnly?: boolean;
    workspaceId?: string;
  }): Promise<UserFileRecord[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.folderId) query.append('folderId', params.folderId);
    if (params?.favoritesOnly) query.append('favoritesOnly', 'true');
    if (params?.workspaceId) query.append('workspaceId', params.workspaceId);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ files: UserFileRecord[] }>(`/api/files${queryString}`);
    return res.files;
  }

  public async updateFileMeta(
    fileId: string,
    meta: { name?: string; isFavorite?: boolean; folderId?: string | null; tags?: string[] }
  ): Promise<UserFileRecord> {
    const res = await this.request<{ file: UserFileRecord }>(`/api/files?id=${fileId}`, {
      method: 'PATCH',
      body: JSON.stringify(meta)
    });
    return res.file;
  }

  public async toggleFavorite(fileId: string): Promise<boolean> {
    const res = await this.request<{ isFavorite: boolean }>(`/api/files/favorites`, {
      method: 'POST',
      body: JSON.stringify({ fileId })
    });
    return res.isFavorite;
  }

  public async deleteFile(fileId: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/api/files?id=${fileId}`, {
      method: 'DELETE'
    });
    return res.success;
  }

  // --- Folders ---

  public async listFolders(): Promise<UserFolder[]> {
    const res = await this.request<{ folders: UserFolder[] }>('/api/files/folders');
    return res.folders;
  }

  public async createFolder(name: string, color?: string, parentId?: string): Promise<UserFolder> {
    const res = await this.request<{ folder: UserFolder }>('/api/files/folders', {
      method: 'POST',
      body: JSON.stringify({ name, color, parentId })
    });
    return res.folder;
  }

  // --- Secure Share Links ---

  public async createShareLink(
    fileId: string,
    options?: { password?: string; expiresInHours?: number; maxDownloads?: number }
  ): Promise<ShareLink> {
    const res = await this.request<{ link: ShareLink }>('/api/share/create', {
      method: 'POST',
      body: JSON.stringify({ fileId, ...options })
    });
    return res.link;
  }

  public async getShareLinkInfo(code: string, password?: string): Promise<ShareLink> {
    const res = await this.request<{ link: ShareLink }>(`/api/share/${code}`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    return res.link;
  }

  public async downloadSharedFile(code: string, password?: string): Promise<{ downloadUrl: string; fileName: string }> {
    return this.request<{ downloadUrl: string; fileName: string }>(`/api/share/${code}/download`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  }

  // --- Workspaces ---

  public async listWorkspaces(): Promise<Workspace[]> {
    const res = await this.request<{ workspaces: Workspace[] }>('/api/workspace');
    return res.workspaces;
  }

  public async createWorkspace(name: string, slug: string): Promise<Workspace> {
    const res = await this.request<{ workspace: Workspace }>('/api/workspace', {
      method: 'POST',
      body: JSON.stringify({ name, slug })
    });
    return res.workspace;
  }

  public async inviteWorkspaceMember(workspaceId: string, email: string, role: WorkspaceRole): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/workspace/members', {
      method: 'POST',
      body: JSON.stringify({ workspaceId, email, role })
    });
  }
}
