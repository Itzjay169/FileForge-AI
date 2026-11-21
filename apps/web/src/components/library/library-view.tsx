'use client';

import { ForgeButton, ForgeInput, forgeToast } from '@/components/sakuga';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CommandPalette } from '@/components/layout/command-palette';
import {
  UserProfile,
  UserStorageInfo,
  UserFileRecord,
  UserFolder,
  Workspace,
  ShareLink,
  formatBytes
} from '@fileforge/shared';
import {
  HardDrive,
  Coins,
  Search,
  Star,
  Folder,
  Share2,
  Download,
  Plus,
  Lock,
  Copy,
  Check,
  X,
  Users,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Archive,
  File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LibraryViewProps {
  showFooter?: boolean;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ showFooter = false }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [storage, setStorage] = useState<UserStorageInfo | null>(null);
  const [files, setFiles] = useState<UserFileRecord[]>([]);
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Share Modal State
  const [shareFile, setShareFile] = useState<UserFileRecord | null>(null);
  const [sharePassword, setSharePassword] = useState('');
  const [shareExpiryHours, setShareExpiryHours] = useState<number>(24);
  const [shareMaxDownloads, setShareMaxDownloads] = useState<number>(50);
  const [createdShareLink, setCreatedShareLink] = useState<ShareLink | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Folder Modal State
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadDashboardData() {
      try {
        const [pRes, sRes, fRes, fldRes, wsRes] = await Promise.all([
          fetch('/api/user/profile').then((r) => r.json()),
          fetch('/api/user/storage').then((r) => r.json()),
          fetch('/api/files').then((r) => r.json()),
          fetch('/api/files/folders').then((r) => r.json()),
          fetch('/api/workspace').then((r) => r.json())
        ]);

        if (!ignore) {
          if (pRes.profile) setProfile(pRes.profile);
          if (sRes.storage) setStorage(sRes.storage);
          if (fRes.files) setFiles(fRes.files);
          if (fldRes.folders) setFolders(fldRes.folders);
          if (wsRes.workspaces) {
            setWorkspaces(wsRes.workspaces);
            setSelectedWorkspace((prev) => prev || (wsRes.workspaces.length > 0 ? wsRes.workspaces[0].id : null));
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadDashboardData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleFavorite = async (fileId: string) => {
    try {
      const res = await fetch('/api/files/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId })
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, isFavorite: data.isFavorite } : f))
        );
      }
    } catch (err: unknown) {
      forgeToast.error('Favorite Error', (err as Error).message);
    }
  };

  const handleCreateShareLink = async () => {
    if (!shareFile) return;
    setIsCreatingLink(true);
    try {
      const res = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: shareFile.id,
          password: sharePassword || undefined,
          expiresInHours: shareExpiryHours,
          maxDownloads: shareMaxDownloads
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate link');

      setCreatedShareLink(data.link);
      forgeToast.success('Secure Link Ready', 'Share link and QR code generated.');
    } catch (err: unknown) {
      forgeToast.error('Share Error', (err as Error).message);
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch('/api/files/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName })
      });
      const data = await res.json();
      if (data.folder) {
        setFolders((prev) => [...prev, data.folder]);
        setNewFolderName('');
        setNewFolderOpen(false);
        forgeToast.success('Folder Created', `Folder "${data.folder.name}" added.`);
      }
    } catch (err: unknown) {
      forgeToast.error('Folder Error', (err as Error).message);
    }
  };

  const filteredFiles = files.filter((f) => {
    if (favoritesOnly && !f.isFavorite) return false;
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (selectedFolderId && f.folderId !== selectedFolderId) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.format.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        {/* User Profile & Storage Overview Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-600 p-0.5 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center text-primary font-bold text-xl">
                  {(profile?.name ?? 'C').charAt(0)}
                </div>
              </div>
              <div className="truncate">
                <h2 className="text-lg font-bold text-foreground truncate">
                  {profile?.name || 'Creative Studio'}
                </h2>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/15 text-primary border border-violet-500/30">
                    {profile?.planTier}
                  </span>
                  <span className="text-[11px] text-pink-500 font-semibold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {profile?.creditsRemaining} Credits
                  </span>
                </div>
              </div>
            </div>

            {/* Workspace Switcher */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                Workspace:
              </div>
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-muted/50 border border-border text-xs text-foreground focus:outline-none"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id} className="bg-card text-foreground">
                    {ws.name} ({ws.memberCount} members)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Storage Meter Card */}
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Cloud Storage Allocation</h3>
                </div>
                <span className="text-xs text-primary font-semibold font-mono">
                  {formatBytes(storage?.usedBytes || 0)} of {formatBytes(storage?.limitBytes || 50 * 1024 * 1024 * 1024)} ({storage?.usagePercent || 1}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden p-0.5 border border-border mb-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-violet-400 transition-all duration-500"
                  style={{ width: `${Math.max(2, storage?.usagePercent || 5)}%` }}
                />
              </div>

              {/* Storage breakdown pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Images</span>
                  <span className="font-semibold text-foreground">
                    {formatBytes(storage?.breakdown.images || 0)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Documents</span>
                  <span className="font-semibold text-foreground">
                    {formatBytes(storage?.breakdown.documents || 0)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Video & Media</span>
                  <span className="font-semibold text-foreground">
                    {formatBytes((storage?.breakdown.videos || 0) + (storage?.breakdown.audio || 0))}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Total Assets</span>
                  <span className="font-semibold text-foreground">
                    {storage?.fileCount || files.length} files
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Unlimited downloads on active Pro tier.</span>
              <a href="/pricing" className="text-primary hover:underline font-semibold">
                Upgrade Storage
              </a>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Categories, Folders */}
        <div className="bg-card border border-border rounded-3xl p-6 mb-8 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files by name, extension (.png, .pdf), or tags..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  favoritesOnly
                    ? 'border-amber-500 bg-amber-500/15 text-amber-500'
                    : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                Favorites Only
              </button>

              <ForgeButton variant="secondary" size="sm" onClick={() => setNewFolderOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                New Folder
              </ForgeButton>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-border">
            {['all', 'images', 'documents', 'video', 'audio', 'archives'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Folder pills */}
            {folders.length > 0 && (
              <div className="flex items-center gap-1.5 pl-4 border-l border-border">
                {folders.map((fld) => (
                  <button
                    key={fld.id}
                    onClick={() =>
                      setSelectedFolderId(selectedFolderId === fld.id ? null : fld.id)
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      selectedFolderId === fld.id
                        ? 'bg-pink-600 text-white font-semibold'
                        : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Folder className="w-3 h-3" />
                    {fld.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Files Grid / List */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <h3 className="text-sm font-bold text-foreground">
              File Library ({filteredFiles.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              Synced across Web and Mobile
            </span>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No files matching your search or active filters.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 transition-all gap-4"
                >
                  <div className="flex items-center gap-3 truncate">
                    <button
                      onClick={() => handleToggleFavorite(file.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-amber-500 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          file.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                      />
                    </button>

                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-primary shrink-0">
                      {file.category === 'images' && <ImageIcon className="w-5 h-5" />}
                      {file.category === 'documents' && <FileText className="w-5 h-5" />}
                      {file.category === 'video' && <Film className="w-5 h-5" />}
                      {file.category === 'audio' && <Music className="w-5 h-5" />}
                      {file.category === 'archives' && <Archive className="w-5 h-5" />}
                      {!['images', 'documents', 'video', 'audio', 'archives'].includes(file.category) && (
                        <File className="w-5 h-5" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{formatBytes(file.sizeBytes)}</span>
                        <span>•</span>
                        <span className="uppercase text-primary font-semibold">{file.format}</span>
                        {file.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-muted-foreground/80">{file.tags.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <ForgeButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShareFile(file);
                        setCreatedShareLink(null);
                        setSharePassword('');
                      }}
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1" />
                      Share Link
                    </ForgeButton>

                    <a href={file.downloadUrl} download={file.name}>
                      <ForgeButton variant="primary" size="sm">
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Download
                      </ForgeButton>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Link Modal */}
        <AnimatePresence>
          {shareFile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShareFile(null)}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 z-10 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Create Secure Share Link</h3>
                  </div>
                  <button
                    onClick={() => setShareFile(null)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!createdShareLink ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                      <File className="w-6 h-6 text-primary shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-foreground truncate">{shareFile.name}</div>
                        <div className="text-[11px] text-muted-foreground">{formatBytes(shareFile.sizeBytes)}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground/80 block mb-1">
                        Optional Password Protection
                      </label>
                      <ForgeInput
                        type="password"
                        value={sharePassword}
                        onChange={(e) => setSharePassword(e.target.value)}
                        placeholder="Leave empty for public link"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground/80 block mb-1">
                          Expiration Time
                        </label>
                        <select
                          value={shareExpiryHours}
                          onChange={(e) => setShareExpiryHours(Number(e.target.value))}
                          className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border text-xs text-foreground focus:outline-none"
                        >
                          <option value={1} className="bg-card text-foreground">1 Hour</option>
                          <option value={24} className="bg-card text-foreground">24 Hours (1 Day)</option>
                          <option value={168} className="bg-card text-foreground">7 Days</option>
                          <option value={720} className="bg-card text-foreground">30 Days</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground/80 block mb-1">
                          Max Download Limit
                        </label>
                        <select
                          value={shareMaxDownloads}
                          onChange={(e) => setShareMaxDownloads(Number(e.target.value))}
                          className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border text-xs text-foreground focus:outline-none"
                        >
                          <option value={1} className="bg-card text-foreground">1 Download (Self-destruct)</option>
                          <option value={10} className="bg-card text-foreground">10 Downloads</option>
                          <option value={50} className="bg-card text-foreground">50 Downloads</option>
                          <option value={500} className="bg-card text-foreground">500 Downloads</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <ForgeButton variant="ghost" size="sm" onClick={() => setShareFile(null)}>
                        Cancel
                      </ForgeButton>
                      <ForgeButton variant="primary"
                        size="sm"
                        isLoading={isCreatingLink}
                        onClick={handleCreateShareLink}
                      >
                        <Lock className="w-3.5 h-3.5 mr-1" />
                        Generate Link & QR
                      </ForgeButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col items-center">
                      <div
                        className="mb-3"
                        dangerouslySetInnerHTML={{ __html: createdShareLink.qrCodeSvg || '' }}
                      />
                      <span className="text-[11px] text-muted-foreground">
                        Scan with your phone to download immediately.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 border border-border">
                      <input
                        type="text"
                        readOnly
                        value={`https://fileforge.studio/share/${createdShareLink.code}`}
                        className="bg-transparent flex-1 text-xs text-foreground px-2 focus:outline-none font-mono"
                      />
                      <ForgeButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://fileforge.studio/share/${createdShareLink.code}`
                          );
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </ForgeButton>
                    </div>

                    <div className="pt-2">
                      <ForgeButton variant="ghost" size="sm" onClick={() => setShareFile(null)}>
                        Done
                      </ForgeButton>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Folder Modal */}
        <AnimatePresence>
          {newFolderOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                onClick={() => setNewFolderOpen(false)}
              />
              <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl p-6 z-10 shadow-2xl">
                <h3 className="text-base font-bold text-foreground mb-3">Create New Folder</h3>
                <ForgeInput
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder Name (e.g. Design Assets)"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <ForgeButton variant="ghost" size="sm" onClick={() => setNewFolderOpen(false)}>
                    Cancel
                  </ForgeButton>
                  <ForgeButton variant="primary" size="sm" onClick={handleCreateFolder}>
                    Create
                  </ForgeButton>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {showFooter && <Footer />}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};
