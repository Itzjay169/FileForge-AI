import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { useQueue } from '../../src/context/queue-context';
import { FORGE_COLORS } from '../../src/theme/colors';
import { SakugaButton } from '../../src/components/SakugaButton';
import {
  Camera,
  Image as ImageIcon,
  FileText,
  Zap,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  X,
  RotateCw
} from 'lucide-react-native';
import { formatBytes } from '@fileforge/shared';

export default function MobileStudioScreen() {
  const { queue, addToQueue, retryItem, cancelItem, clearCompleted } = useQueue();
  const [selectedPreset, setSelectedPreset] = useState<'SMART' | 'WHATSAPP' | 'EMAIL' | 'WEB'>('SMART');

  // 1. Camera Scan
  const handleCameraScan = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed to scan documents.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.9,
      allowsEditing: true
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const filename = asset.fileName || `scan-${Date.now()}.jpg`;
      addToQueue({
        fileName: filename,
        fileSize: asset.fileSize || 2500000,
        localUri: asset.uri,
        mimeType: asset.mimeType || 'image/jpeg',
        operation: 'COMPRESS',
        options: { preset: selectedPreset }
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // 2. Gallery Import
  const handleGalleryImport = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.9
    });

    if (!result.canceled && result.assets) {
      for (const asset of result.assets) {
        addToQueue({
          fileName: asset.fileName || `import-${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
          fileSize: asset.fileSize || 4500000,
          localUri: asset.uri,
          mimeType: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
          operation: 'COMPRESS',
          options: { preset: selectedPreset }
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // 3. Document Picker
  const handleDocumentPick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const doc = result.assets[0];
      addToQueue({
        fileName: doc.name,
        fileSize: doc.size || 1500000,
        localUri: doc.uri,
        mimeType: doc.mimeType || 'application/octet-stream',
        operation: 'COMPRESS',
        options: { preset: selectedPreset }
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Studio Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.badge}>
          <Sparkles size={12} color={FORGE_COLORS.accent} />
          <Text style={styles.badgeText}>Sakuga Mobile Studio</Text>
        </View>
        <Text style={styles.bannerTitle}>Compress & Transcode</Text>
        <Text style={styles.bannerSubtitle}>
          Lightning-fast on-device camera scans and cloud compression with smart size controls.
        </Text>
      </View>

      {/* Action Import Buttons */}
      <View style={styles.importGrid}>
        <TouchableOpacity style={styles.importCard} onPress={handleCameraScan}>
          <View style={[styles.importIcon, { backgroundColor: FORGE_COLORS.primarySoft }]}>
            <Camera size={24} color={FORGE_COLORS.primary} />
          </View>
          <Text style={styles.importTitle}>Camera Scan</Text>
          <Text style={styles.importDesc}>Photo or Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.importCard} onPress={handleGalleryImport}>
          <View style={[styles.importIcon, { backgroundColor: FORGE_COLORS.accentSoft }]}>
            <ImageIcon size={24} color={FORGE_COLORS.accent} />
          </View>
          <Text style={styles.importTitle}>Photos & Video</Text>
          <Text style={styles.importDesc}>From Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.importCard} onPress={handleDocumentPick}>
          <View style={[styles.importIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
            <FileText size={24} color="#3b82f6" />
          </View>
          <Text style={styles.importTitle}>Files & PDFs</Text>
          <Text style={styles.importDesc}>iCloud / Storage</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Selector */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Compression Preset</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
        {[
          { id: 'SMART', label: 'Smart Compress', desc: 'Auto quality' },
          { id: 'WHATSAPP', label: 'WhatsApp Ready', desc: '< 16 MB ceiling' },
          { id: 'EMAIL', label: 'Email Package', desc: '< 20 MB ceiling' },
          { id: 'WEB', label: 'Web Optimized', desc: 'WebP / AVIF' }
        ].map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.presetChip,
              selectedPreset === p.id && styles.presetChipActive
            ]}
            onPress={() => setSelectedPreset(p.id as any)}
          >
            <Text
              style={[
                styles.presetLabel,
                selectedPreset === p.id && styles.presetLabelActive
              ]}
            >
              {p.label}
            </Text>
            <Text style={styles.presetDesc}>{p.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active Processing Queue */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Zap size={16} color={FORGE_COLORS.primary} />
          <Text style={styles.sectionTitle}>Processing Queue ({queue.length})</Text>
        </View>
        {queue.some((i) => i.status === 'COMPLETED') && (
          <TouchableOpacity onPress={clearCompleted}>
            <Text style={styles.clearText}>Clear Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {queue.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Queue is clear. Import a file above to process.</Text>
        </View>
      ) : (
        queue.map((item) => (
          <View key={item.id} style={styles.queueItemCard}>
            <View style={styles.queueItemHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.queueFileName} numberOfLines={1}>
                  {item.fileName}
                </Text>
                <Text style={styles.queueFileSize}>
                  {formatBytes(item.fileSize)} • {item.operation}
                </Text>
              </View>

              <View style={styles.queueStatusBadge}>
                {item.status === 'COMPLETED' ? (
                  <CheckCircle2 size={16} color={FORGE_COLORS.success} />
                ) : (
                  <Text style={styles.queueStatusText}>{item.status}</Text>
                )}
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${item.progress}%`,
                    backgroundColor:
                      item.status === 'COMPLETED'
                        ? FORGE_COLORS.success
                        : FORGE_COLORS.primary
                  }
                ]}
              />
            </View>

            {/* Actions */}
            <View style={styles.queueActions}>
              <Text style={styles.progressText}>{item.progress}%</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {item.status === 'FAILED' && (
                  <TouchableOpacity onPress={() => retryItem(item.id)}>
                    <RotateCw size={16} color={FORGE_COLORS.primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => cancelItem(item.id)}>
                  <X size={16} color={FORGE_COLORS.textDim} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
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
  bannerCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 20
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: FORGE_COLORS.accent
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: FORGE_COLORS.text,
    marginBottom: 4
  },
  bannerSubtitle: {
    fontSize: 12,
    color: FORGE_COLORS.textMuted,
    lineHeight: 18
  },
  importGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  importCard: {
    flex: 1,
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  importIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  importTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: FORGE_COLORS.text,
    textAlign: 'center'
  },
  importDesc: {
    fontSize: 9,
    color: FORGE_COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FORGE_COLORS.text
  },
  clearText: {
    fontSize: 11,
    color: FORGE_COLORS.primary,
    fontWeight: '600'
  },
  presetsRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  presetChip: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  presetChipActive: {
    borderColor: FORGE_COLORS.primary,
    backgroundColor: FORGE_COLORS.primarySoft
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: FORGE_COLORS.text
  },
  presetLabelActive: {
    color: FORGE_COLORS.primaryLight
  },
  presetDesc: {
    fontSize: 10,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  },
  emptyCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  emptyText: {
    fontSize: 12,
    color: FORGE_COLORS.textMuted
  },
  queueItemCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 10
  },
  queueItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  queueFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: FORGE_COLORS.text
  },
  queueFileSize: {
    fontSize: 11,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  },
  queueStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  queueStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: FORGE_COLORS.primaryLight
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  queueActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  progressText: {
    fontSize: 10,
    color: FORGE_COLORS.textMuted,
    fontFamily: 'monospace'
  }
});
