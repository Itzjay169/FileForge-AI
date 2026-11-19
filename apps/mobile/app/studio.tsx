import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SakugaButton } from '../src/components/SakugaButton';
import { FORGE_COLORS } from '../src/theme/colors';

type PresetType =
  | 'SMART_COMPRESS'
  | 'WEB_OPTIMIZED'
  | 'MAXIMUM_QUALITY'
  | 'EMAIL_READY'
  | 'WHATSAPP_READY'
  | 'INSTAGRAM_READY'
  | 'CUSTOM';

interface PresetItem {
  id: PresetType;
  label: string;
  desc: string;
  ratio: number;
}

const PRESETS: PresetItem[] = [
  { id: 'SMART_COMPRESS', label: 'Smart Compress', desc: 'AI auto-tune fidelity', ratio: 0.65 },
  { id: 'WEB_OPTIMIZED', label: 'Web Optimized', desc: 'Max 1080p, WebP/H264', ratio: 0.75 },
  { id: 'MAXIMUM_QUALITY', label: 'Max Quality', desc: 'Archival 95% fidelity', ratio: 0.25 },
  { id: 'EMAIL_READY', label: 'Email Ready', desc: 'Under 20 MB target', ratio: 0.70 },
  { id: 'WHATSAPP_READY', label: 'WhatsApp', desc: 'Under 16 MB messaging', ratio: 0.80 },
  { id: 'INSTAGRAM_READY', label: 'Instagram', desc: '1080px sRGB social', ratio: 0.50 },
  { id: 'CUSTOM', label: 'Custom', desc: 'Manual precision tuning', ratio: 0.60 }
];

export default function MobileStudioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fileName = (params.name as string) || 'creative-asset.mp4';
  const fileSize = parseInt((params.size as string) || '15400000', 10);

  const [activePreset, setActivePreset] = useState<PresetType>('SMART_COMPRESS');
  const [quality, setQuality] = useState(80);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPresetDef = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];

  const estimatedOutputSize = Math.round(fileSize * (1 - currentPresetDef.ratio));
  const estimatedSavingsPercent = Math.round(currentPresetDef.ratio * 100);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Compression Complete! (ドン!)',
        `File: ${fileName}\nPreset: ${currentPresetDef.label}\nOriginal: ${formatSize(fileSize)}\nOptimized: ${formatSize(estimatedOutputSize)}\nSaved: ${estimatedSavingsPercent}%`,
        [
          { text: 'Done', onPress: () => router.back() },
          { text: 'Share File', style: 'default' }
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Selected File Card */}
        <View style={styles.fileCard}>
          <Text style={styles.fileLabel}>INPUT ASSET</Text>
          <Text style={styles.fileName}>{fileName}</Text>
          <View style={styles.fileMetaRow}>
            <Text style={styles.fileSize}>Original: {formatSize(fileSize)}</Text>
            <Text style={styles.fileBadge}>Ready to Forge</Text>
          </View>
        </View>

        {/* Preset Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compression Presets</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsScroll}
          >
            {PRESETS.map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setActivePreset(p.id)}
                  style={[
                    styles.presetCard,
                    isSelected && styles.presetCardActive
                  ]}
                >
                  <Text style={[styles.presetLabel, isSelected && styles.presetLabelActive]}>
                    {p.label}
                  </Text>
                  <Text style={styles.presetDesc}>{p.desc}</Text>
                  <Text style={[styles.presetRatio, isSelected && styles.presetRatioActive]}>
                    ~{Math.round(p.ratio * 100)}% savings
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Fine-Tuning Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Precision Controls</Text>
          <View style={styles.controlsCard}>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Quality Level: {quality}%</Text>
              <View style={styles.stepButtons}>
                <TouchableOpacity
                  onPress={() => setQuality(Math.max(10, quality - 10))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>-10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setQuality(Math.min(100, quality + 10))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+10</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.controlRow, { marginTop: 16 }]}>
              <View>
                <Text style={styles.controlLabel}>Strip EXIF & Metadata</Text>
                <Text style={styles.controlSub}>Enhances privacy & trims payload</Text>
              </View>
              <TouchableOpacity
                onPress={() => setStripMetadata(!stripMetadata)}
                style={[
                  styles.toggleSwitch,
                  stripMetadata && styles.toggleSwitchActive
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    stripMetadata && styles.toggleKnobActive
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Prediction Card */}
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>OUTPUT PROJECTION</Text>
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statVal}>{formatSize(estimatedOutputSize)}</Text>
              <Text style={styles.statSub}>Estimated Output</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.statVal, { color: FORGE_COLORS.success }]}>
                -{estimatedSavingsPercent}%
              </Text>
              <Text style={styles.statSub}>Size Reduction</Text>
            </View>
          </View>
        </View>

        {/* Execute Button */}
        <SakugaButton
          title={isProcessing ? 'Forging Asset...' : `Run ${currentPresetDef.label}`}
          onPress={handleExecute}
          variant="primary"
          disabled={isProcessing}
        />
      </ScrollView>
    </SafeAreaView>
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
  fileCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 20
  },
  fileLabel: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 4,
    letterSpacing: 1
  },
  fileName: {
    color: FORGE_COLORS.text,
    fontSize: 18,
    fontWeight: '700'
  },
  fileMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  fileSize: {
    color: FORGE_COLORS.textMuted,
    fontSize: 13
  },
  fileBadge: {
    color: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '700'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    color: FORGE_COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10
  },
  presetsScroll: {
    gap: 10,
    paddingBottom: 4
  },
  presetCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    width: 140
  },
  presetCardActive: {
    borderColor: FORGE_COLORS.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.15)'
  },
  presetLabel: {
    color: FORGE_COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4
  },
  presetLabelActive: {
    color: '#c084fc'
  },
  presetDesc: {
    color: FORGE_COLORS.textMuted,
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 8
  },
  presetRatio: {
    color: FORGE_COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600'
  },
  presetRatioActive: {
    color: '#34d399'
  },
  controlsCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  controlLabel: {
    color: FORGE_COLORS.text,
    fontSize: 13,
    fontWeight: '600'
  },
  controlSub: {
    color: FORGE_COLORS.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  stepButtons: {
    flexDirection: 'row',
    gap: 8
  },
  stepBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  stepBtnText: {
    color: FORGE_COLORS.text,
    fontSize: 12,
    fontWeight: '700'
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 2,
    justifyContent: 'center'
  },
  toggleSwitchActive: {
    backgroundColor: FORGE_COLORS.primary
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff'
  },
  toggleKnobActive: {
    alignSelf: 'flex-end'
  },
  predictionCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 24
  },
  predictionTitle: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 12
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statVal: {
    color: FORGE_COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'monospace'
  },
  statSub: {
    color: FORGE_COLORS.textMuted,
    fontSize: 12,
    marginTop: 2
  }
});
