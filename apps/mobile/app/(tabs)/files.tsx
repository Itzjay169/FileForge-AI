import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { FORGE_COLORS } from '../../src/theme/colors';
import {
  Search,
  Star,
  Share2,
  Download,
  Folder,
  File,
  Image as ImageIcon,
  FileText,
  Film,
  Music
} from 'lucide-react-native';
import { formatBytes } from '@fileforge/shared';

const SAMPLE_MOBILE_FILES = [
  {
    id: 'mf_01',
    name: 'brand-identity-hero.png',
    sizeBytes: 3400000,
    format: 'png',
    category: 'images',
    isFavorite: true,
    localUri: 'file:///storage/emulated/0/Download/brand-identity-hero.png'
  },
  {
    id: 'mf_02',
    name: 'pitch-deck-2026.pdf',
    sizeBytes: 12500000,
    format: 'pdf',
    category: 'documents',
    isFavorite: false,
    localUri: 'file:///storage/emulated/0/Download/pitch-deck-2026.pdf'
  },
  {
    id: 'mf_03',
    name: 'vfx-breakdown-clip.mp4',
    sizeBytes: 48000000,
    format: 'mp4',
    category: 'video',
    isFavorite: true,
    localUri: 'file:///storage/emulated/0/Download/vfx-breakdown-clip.mp4'
  }
];

export default function MobileFilesScreen() {
  const [files, setFiles] = useState(SAMPLE_MOBILE_FILES);
  const [search, setSearch] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const toggleFavorite = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const handleNativeShare = async (file: (typeof SAMPLE_MOBILE_FILES)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Share Unavailable', 'Sharing is not supported on this device.');
      return;
    }

    try {
      // In real device, share local file URI
      await Sharing.shareAsync(file.localUri, {
        dialogTitle: `Share ${file.name}`
      });
    } catch {
      // Fallback message
      Alert.alert('Share Link Ready', `https://fileforge.studio/share/sh_${file.id}`);
    }
  };

  const filtered = files.filter((f) => {
    if (favoritesOnly && !f.isFavorite) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={16} color={FORGE_COLORS.textDim} style={{ marginRight: 8 }} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search library..."
          placeholderTextColor={FORGE_COLORS.textDim}
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => setFavoritesOnly(!favoritesOnly)}
          style={[styles.favFilterBtn, favoritesOnly && styles.favFilterBtnActive]}
        >
          <Star size={14} color={favoritesOnly ? '#f59e0b' : FORGE_COLORS.textDim} />
        </TouchableOpacity>
      </View>

      {/* Files List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>All Files ({filtered.length})</Text>
      </View>

      {filtered.map((item) => (
        <View key={item.id} style={styles.fileCard}>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            style={{ padding: 4, marginRight: 6 }}
          >
            <Star
              size={18}
              color={item.isFavorite ? '#f59e0b' : FORGE_COLORS.textDim}
              fill={item.isFavorite ? '#f59e0b' : 'none'}
            />
          </TouchableOpacity>

          <View style={styles.iconBox}>
            {item.category === 'images' && <ImageIcon size={20} color={FORGE_COLORS.accent} />}
            {item.category === 'documents' && <FileText size={20} color={FORGE_COLORS.primary} />}
            {item.category === 'video' && <Film size={20} color="#3b82f6" />}
          </View>

          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.fileMeta}>{formatBytes(item.sizeBytes)} • {item.format.toUpperCase()}</Text>
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleNativeShare(item)}
          >
            <Share2 size={16} color={FORGE_COLORS.text} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORGE_COLORS.background
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    color: FORGE_COLORS.text,
    fontSize: 13
  },
  favFilterBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  favFilterBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)'
  },
  listHeader: {
    marginBottom: 12
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FORGE_COLORS.text
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 10
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: FORGE_COLORS.text
  },
  fileMeta: {
    fontSize: 11,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  },
  actionBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  }
});
