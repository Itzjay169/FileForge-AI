'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Table2,
  Presentation,
  Code,
  Archive,
  Type,
  Box,
  Cpu,
  Database,
  Check,
  AlertTriangle,
  ArrowRight,
  Zap,
  ChevronRight
} from 'lucide-react';
import { fileRegistry } from '@fileforge/file-registry';
import { FileCategory, FileFormatDefinition } from '@fileforge/shared';
import { ForgeButton } from '@/components/sakuga/forge-button';
import { ForgeInput } from '@/components/sakuga/forge-input';
import { forgeToast } from '@/components/sakuga/forge-toast';

export const FormatExplorer: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'ALL'>(
    (initialCategory as FileCategory) || 'ALL'
  );
  const [capabilityFilter, setCapabilityFilter] = useState<'all' | 'compress' | 'convert' | 'preview' | 'premium'>('all');
  const [selectedFormat, setSelectedFormat] = useState<FileFormatDefinition | null>(null);

  const allFormats = useMemo(() => fileRegistry.getAllFormats(), []);
  const allCategories = useMemo(() => fileRegistry.getCategories(), []);

  // Filtered formats based on query and category
  const filteredFormats = useMemo(() => {
    let result = allFormats;

    if (selectedCategory !== 'ALL') {
      result = result.filter((f) => f.category === selectedCategory);
    }

    if (capabilityFilter === 'compress') {
      result = result.filter((f) => f.compressionSupported);
    } else if (capabilityFilter === 'convert') {
      result = result.filter((f) => f.conversionTargets && f.conversionTargets.length > 0);
    } else if (capabilityFilter === 'preview') {
      result = result.filter((f) => f.previewSupported);
    } else if (capabilityFilter === 'premium') {
      result = result.filter((f) => f.requiresPremiumWorker || f.riskLevel === 'HIGH' || f.maxFreeSizeBytes < 100 * 1024 * 1024);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim().replace(/^\./, '');
      result = result.filter(
        (f) =>
          f.extension.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.conversionTargets.some((target) => target.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allFormats, selectedCategory, capabilityFilter, search]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'documents':
        return <FileText className="w-4 h-4 text-violet-400" />;
      case 'images':
        return <ImageIcon className="w-4 h-4 text-pink-400" />;
      case 'video':
        return <Film className="w-4 h-4 text-purple-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-cyan-400" />;
      case 'spreadsheets':
        return <Table2 className="w-4 h-4 text-emerald-400" />;
      case 'presentations':
        return <Presentation className="w-4 h-4 text-amber-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-indigo-400" />;
      case 'archives':
        return <Archive className="w-4 h-4 text-orange-400" />;
      case 'fonts':
        return <Type className="w-4 h-4 text-rose-400" />;
      case 'cad3d':
        return <Box className="w-4 h-4 text-teal-400" />;
      case 'executables':
        return <Cpu className="w-4 h-4 text-red-400" />;
      case 'databases':
        return <Database className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      {/* Search Header Bar */}
      {/* Search Bar & Filters */}
      <div className="mb-8 space-y-4">
        <ForgeInput
          placeholder="Search by extension (e.g. '.heic', '.mkv', '.docx', '.psd', '.7z', '.glb', '.ttf') or format name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          leadingIcon={<Search className="w-4 h-4" />}
        />

        {/* Capability Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-semibold text-[var(--sk-text-muted)] mr-1">Filter Capabilities:</span>
          {(['all', 'compress', 'convert', 'preview', 'premium'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setCapabilityFilter(filterKey)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                capabilityFilter === filterKey
                  ? 'bg-[var(--sk-acc)] text-white shadow-sm'
                  : 'bg-white/5 text-[var(--sk-text-muted)] hover:text-white hover:bg-white/10 border border-[var(--sk-border)]'
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedCategory === 'ALL'
              ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/20'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <span>All Formats</span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">
            {allFormats.length}
          </span>
        </button>

        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = allFormats.filter((f) => f.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/10'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-6 font-mono">
        <span>
          Showing <strong className="text-white font-bold">{filteredFormats.length}</strong> format
          definitions
        </span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-violet-400 hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFormats.map((item) => (
          <motion.div
            key={`${item.category}-${item.extension}`}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedFormat(item)}
            className="bg-[#12121c] border border-white/10 hover:border-violet-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:shadow-violet-950/20 flex flex-col justify-between group"
          >
            <div>
              {/* Card Top: Extension badge & Category */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono font-extrabold px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-300 border border-violet-500/30 group-hover:scale-105 transition-transform">
                  .{item.extension.toUpperCase()}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getRiskBadge(item.riskLevel)}`}>
                  {item.riskLevel} RISK
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-bold text-white mb-1.5 font-sans group-hover:text-violet-300 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Bottom Capabilities Pills */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                {item.compressionSupported && (
                  <span className="text-emerald-400 font-mono flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Compress
                  </span>
                )}
                {item.conversionTargets.length > 0 && (
                  <span className="text-cyan-400 font-mono flex items-center gap-0.5">
                    <ArrowRight className="w-3 h-3" /> {item.conversionTargets.length} Targets
                  </span>
                )}
              </div>

              <span className="text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
                Inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFormats.length === 0 && (
        <div className="text-center py-20 bg-[#12121c] border border-white/10 rounded-3xl p-8">
          <p className="text-lg font-bold text-white mb-2">No formats matched your search</p>
          <p className="text-xs text-gray-400 mb-6">
            Try searching with another keyword or pick an explicit category tab above.
          </p>
          <ForgeButton
            variant="primary"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setCapabilityFilter('all');
            }}
          >
            Reset All Filters
          </ForgeButton>
        </div>
      )}

      {/* Format Details Modal */}
      <AnimatePresence>
        {selectedFormat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFormat(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#141422] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-6 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-bold px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30">
                    .{selectedFormat.extension.toUpperCase()}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedFormat.name}</h3>
                    <p className="text-xs text-gray-400">
                      Category:{' '}
                      <span className="capitalize font-medium text-violet-400">
                        {selectedFormat.category}
                      </span>{' '}
                      • Processor:{' '}
                      <span className="font-mono text-pink-400">
                        {selectedFormat.requiredProcessor}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFormat(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {selectedFormat.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block mb-1">Upload Allowed</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Allowed
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block mb-1">Compression</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      selectedFormat.compressionSupported ? 'text-emerald-400' : 'text-gray-500'
                    }`}
                  >
                    {selectedFormat.compressionSupported ? 'Supported' : 'Not Applicable'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-400 block mb-1">Free Tier Limit</span>
                  <span className="font-mono text-violet-300 font-semibold">
                    {Math.round(selectedFormat.maxFreeSizeBytes / (1024 * 1024))} MB
                  </span>
                </div>
              </div>

              {/* Conversion Targets */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-gray-400 mb-3 font-bold tracking-wider">
                  Supported Conversion Targets ({selectedFormat.conversionTargets.length})
                </h4>

                {selectedFormat.conversionTargets.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFormat.conversionTargets.map((target) => {
                      const warning = selectedFormat.lossWarnings?.[target.toLowerCase()];
                      return (
                        <div
                          key={target}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
                            warning
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-white/5 border-white/10 text-white'
                          }`}
                        >
                          <span>.{target.toUpperCase()}</span>
                          {warning && (
                            <span title={warning.warningTitle}>
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Direct conversion targets not registered for this system file. Packaging into archive (.ZIP) is supported.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-white/10">
                <ForgeButton
                  variant="secondary"
                  size="md"
                  onClick={() => setSelectedFormat(null)}
                >
                  Close
                </ForgeButton>
                <ForgeButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    forgeToast.success(
                      `Target Ready: .${selectedFormat.extension.toUpperCase()}`,
                      'You can drop this file in the studio playground above.'
                    );
                    setSelectedFormat(null);
                    window.location.hash = 'playground';
                  }}
                >
                  <Zap className="w-4 h-4 fill-current text-[var(--sk-acc)]" />
                  <span>Launch in Studio</span>
                </ForgeButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
