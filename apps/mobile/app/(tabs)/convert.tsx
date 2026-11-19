import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { FORGE_COLORS } from '../../src/theme/colors';
import { SakugaButton } from '../../src/components/SakugaButton';
import { useQueue } from '../../src/context/queue-context';
import { RefreshCw, FileText, ArrowRight, Check, Sliders } from 'lucide-react-native';
import { formatBytes } from '@fileforge/shared';

const TARGET_FORMATS = ['WEBP', 'PNG', 'JPG', 'PDF', 'MP4', 'MP3', 'ZIP'];

export default function MobileConvertScreen() {
  const { addToQueue } = useQueue();
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    uri: string;
    mimeType: string;
  } | null>(null);
  const [targetFormat, setTargetFormat] = useState('WEBP');
  const [quality, setQuality] = useState(85);

  const handlePickFile = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const doc = res.assets[0];
      setSelectedFile({
        name: doc.name,
        size: doc.size || 2000000,
        uri: doc.uri,
        mimeType: doc.mimeType || 'application/octet-stream'
      });
    }
  };

  const handleStartConversion = () => {
    if (!selectedFile) {
      Alert.alert('Select File', 'Please choose a file to convert.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToQueue({
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      localUri: selectedFile.uri,
      mimeType: selectedFile.mimeType,
      operation: 'CONVERT',
      options: { targetFormat: targetFormat.toLowerCase(), quality }
    });

    Alert.alert('Added to Queue', `Conversion to .${targetFormat.toLowerCase()} is processing in background.`);
    setSelectedFile(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* File Selector */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Source Asset</Text>
        {!selectedFile ? (
          <TouchableOpacity style={styles.pickBox} onPress={handlePickFile}>
            <FileText size={32} color={FORGE_COLORS.primary} />
            <Text style={styles.pickText}>Choose File to Convert</Text>
            <Text style={styles.pickSubtext}>Tap to open document picker</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.selectedRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>{formatBytes(selectedFile.size)}</Text>
            </View>
            <TouchableOpacity onPress={handlePickFile} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Target Format Grid */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Target Output Format</Text>
        <View style={styles.formatGrid}>
          {TARGET_FORMATS.map((fmt) => (
            <TouchableOpacity
              key={fmt}
              style={[
                styles.formatChip,
                targetFormat === fmt && styles.formatChipActive
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTargetFormat(fmt);
              }}
            >
              <Text
                style={[
                  styles.formatText,
                  targetFormat === fmt && styles.formatTextActive
                ]}
              >
                .{fmt.toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quality Setting */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={styles.cardTitle}>Quality Level</Text>
          <Text style={styles.qualityValue}>{quality}%</Text>
        </View>
        <View style={styles.qualityPresetsRow}>
          {[60, 75, 85, 95].map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.qualityBtn,
                quality === q && styles.qualityBtnActive
              ]}
              onPress={() => setQuality(q)}
            >
              <Text
                style={[
                  styles.qualityBtnText,
                  quality === q && styles.qualityBtnTextActive
                ]}
              >
                {q}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Execute Button */}
      <View style={{ marginTop: 8 }}>
        <SakugaButton
          title={`Convert to .${targetFormat.toLowerCase()}`}
          variant="default"
          onPress={handleStartConversion}
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
    padding: 16,
    paddingBottom: 40
  },
  card: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FORGE_COLORS.text,
    marginBottom: 12
  },
  pickBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: FORGE_COLORS.borderActive,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)'
  },
  pickText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: FORGE_COLORS.text,
    marginTop: 8
  },
  pickSubtext: {
    fontSize: 11,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12
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
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8
  },
  changeBtnText: {
    fontSize: 11,
    color: FORGE_COLORS.text,
    fontWeight: '600'
  },
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  formatChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  formatChipActive: {
    backgroundColor: FORGE_COLORS.primarySoft,
    borderColor: FORGE_COLORS.primary
  },
  formatText: {
    fontSize: 12,
    fontWeight: '700',
    color: FORGE_COLORS.textMuted
  },
  formatTextActive: {
    color: FORGE_COLORS.primaryLight
  },
  qualityValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: FORGE_COLORS.primaryLight
  },
  qualityPresetsRow: {
    flexDirection: 'row',
    gap: 8
  },
  qualityBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  qualityBtnActive: {
    backgroundColor: FORGE_COLORS.primarySoft,
    borderColor: FORGE_COLORS.primary
  },
  qualityBtnText: {
    fontSize: 12,
    color: FORGE_COLORS.textMuted,
    fontWeight: '600'
  },
  qualityBtnTextActive: {
    color: FORGE_COLORS.text,
    fontWeight: 'bold'
  }
});
