import { ApiResponse, SystemHealthStatus, FileFormatDefinition } from '@fileforge/shared';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fileforge.ai';

export class FileForgeApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<ApiResponse<SystemHealthStatus>> {
    const res = await fetch(`${this.baseUrl}/api/health`);
    return res.json();
  }

  async getFormats(query?: string, category?: string): Promise<ApiResponse<{ formats: FileFormatDefinition[]; total: number }>> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    const res = await fetch(`${this.baseUrl}/api/formats?${params.toString()}`);
    return res.json();
  }

  async getFormat(extension: string): Promise<ApiResponse<{ format: FileFormatDefinition; availableConversions: any[] }>> {
    const res = await fetch(`${this.baseUrl}/api/formats/${extension}`);
    return res.json();
  }
}

export const mobileApiClient = new FileForgeApiClient();
