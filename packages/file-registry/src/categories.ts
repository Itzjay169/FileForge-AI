import { CategoryInfo, FileCategory } from '@fileforge/shared';

export const FILE_CATEGORIES: Record<FileCategory, CategoryInfo> = {
  documents: {
    id: 'documents',
    label: 'Documents',
    description: 'Text, PDFs, word processor files, and digital e-books',
    iconName: 'FileText',
    badgeColor: '#8b5cf6' // Violet
  },
  images: {
    id: 'images',
    label: 'Images',
    description: 'Raster, vector, RAW camera files, and creative design projects',
    iconName: 'Image',
    badgeColor: '#ec4899' // Pink
  },
  video: {
    id: 'video',
    label: 'Video',
    description: 'Motion footage, streaming containers, and high-framerate clips',
    iconName: 'Film',
    badgeColor: '#a855f7' // Purple
  },
  audio: {
    id: 'audio',
    label: 'Audio',
    description: 'Lossless stems, high-bitrate voice clips, and music tracks',
    iconName: 'Music',
    badgeColor: '#06b6d4' // Cyan
  },
  spreadsheets: {
    id: 'spreadsheets',
    label: 'Spreadsheets',
    description: 'Tabular workbooks, CSV datasets, and computational sheets',
    iconName: 'Table',
    badgeColor: '#10b981' // Emerald
  },
  presentations: {
    id: 'presentations',
    label: 'Presentations',
    description: 'Slide decks, keynote templates, and conference shows',
    iconName: 'Presentation',
    badgeColor: '#f59e0b' // Amber
  },
  code: {
    id: 'code',
    label: 'Code & Text',
    description: 'Source code, markup, configuration files, and scripts',
    iconName: 'Code',
    badgeColor: '#6366f1' // Indigo
  },
  archives: {
    id: 'archives',
    label: 'Archives',
    description: 'Compressed bundles, disk images, and distribution packages',
    iconName: 'Archive',
    badgeColor: '#f97316' // Orange
  },
  fonts: {
    id: 'fonts',
    label: 'Fonts',
    description: 'Webfonts, OpenType, TrueType, and typography resources',
    iconName: 'Type',
    badgeColor: '#e11d48' // Rose
  },
  cad3d: {
    id: 'cad3d',
    label: '3D & CAD',
    description: 'Polygon meshes, spatial models, CAD prints, and scenes',
    iconName: 'Box',
    badgeColor: '#14b8a6' // Teal
  },
  executables: {
    id: 'executables',
    label: 'Executables & System',
    description: 'System packages, compiled binaries, and runtime dynamic libs',
    iconName: 'Cpu',
    badgeColor: '#ef4444' // Red
  },
  databases: {
    id: 'databases',
    label: 'Databases & Data',
    description: 'Relational dumps, embedded SQLite stores, and schemas',
    iconName: 'Database',
    badgeColor: '#3b82f6' // Blue
  }
};
