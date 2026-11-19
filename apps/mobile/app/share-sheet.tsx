import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FORGE_COLORS } from '../src/theme/colors';
import { SakugaButton } from '../src/components/SakugaButton';
import { useQueue } from '../src/context/queue-context';
import { Share2, Zap, RefreshCw, Stamp, CheckCircle2 } from 'lucide-react-native';

export default function ShareSheetScreen() {
  const router = useRouter();
  const { addToQueue } = useQueue();
  const [incomingFile] = useState({
    name: 'shared-asset-upload.mp4',
    size: 24500000,
    uri: 'file:///data/user/0/ai.fileforge.mobile/cache/shared.mp4',
    mimeType: 'video/mp4'
  });
  const [selectedAction, setSelectedAction] = useState<'COMPRESS' | 'CONVERT' | 'WATERMARK'>('COMPRESS');

  const handleProcessSharedFile = () => {
    addToQueue({
      fileName: incomingFile.name,
      fileSize: incomingFile.size,
      localUri: incomingFile.uri,
      mimeType: incomingFile.mimeType,
      operation: selectedAction
    });
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Share2 size={32} color={FORGE_COLORS.primary} />
        </View>
        <Text style={styles.title}>File Received via Share Sheet</Text>
        <Text style={styles.subtitle}>
          Choose how you would like FileForge AI to process this asset:
        </Text>
      </View>

      <View style={styles.fileSummaryCard}>
        <Text style={styles.fileName}>{incomingFile.name}</Text>
        <Text style={styles.fileSize}>24.5 MB • MP4 Video</Text>
      </View>

      <View style={styles.actionGrid}>
        {[
          {
            id: 'COMPRESS',
            label: 'Compress & Optimize',
            desc: 'Reduce size for WhatsApp/Email',
            icon: Zap,
            color: FORGE_COLORS.primary
          },
          {
            id: 'CONVERT',
            label: 'Universal Convert',
            desc: 'Transcode to MP3, WebM, or GIF',
            icon: RefreshCw,
            color: FORGE_COLORS.accent
          },
          {
            id: 'WATERMARK',
            label: 'Add Creator Watermark',
            desc: 'Stamp rights protection overlay',
            icon: Stamp,
            color: '#10b981'
          }
        ].map((act) => {
          const Icon = act.icon;
          const isSelected = selectedAction === act.id;
          return (
            <TouchableOpacity
              key={act.id}
              style={[styles.actionCard, isSelected && styles.actionCardActive]}
              onPress={() => setSelectedAction(act.id as any)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: `${act.color}20` }]}>
                <Icon size={20} color={act.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionLabel}>{act.label}</Text>
                <Text style={styles.actionDesc}>{act.desc}</Text>
              </View>
              {isSelected && <CheckCircle2 size={18} color={FORGE_COLORS.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 24 }}>
        <SakugaButton
          title="Process Asset"
          variant="default"
          onPress={handleProcessSharedFile}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORGE_COLORS.background
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: FORGE_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FORGE_COLORS.text,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 12,
    color: FORGE_COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4
  },
  fileSummaryCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 20
  },
  fileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: FORGE_COLORS.text
  },
  fileSize: {
    fontSize: 11,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  },
  actionGrid: {
    gap: 10
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    gap: 12
  },
  actionCardActive: {
    borderColor: FORGE_COLORS.primary,
    backgroundColor: FORGE_COLORS.primarySoft
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: FORGE_COLORS.text
  },
  actionDesc: {
    fontSize: 10,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  }
});
