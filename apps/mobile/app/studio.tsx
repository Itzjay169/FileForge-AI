import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SakugaButton } from '../src/components/SakugaButton';
import { FORGE_COLORS } from '../src/theme/colors';

export default function MobileStudioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fileName = (params.name as string) || 'creative-asset.mp4';
  const fileSize = parseInt((params.size as string) || '15400000', 10);

  const [strength, setStrength] = useState<'LOW' | 'BALANCED' | 'HIGH' | 'EXTREME'>('BALANCED');
  const [isProcessing, setIsProcessing] = useState(false);

  const savingsRatios = {
    LOW: 0.3,
    BALANCED: 0.55,
    HIGH: 0.75,
    EXTREME: 0.88
  };

  const estimatedOutputSize = Math.round(fileSize * (1 - savingsRatios[strength]));
  const estimatedSavingsPercent = Math.round(savingsRatios[strength] * 100);

  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Compression Complete! (ドン!)',
        `Original: ${formatSize(fileSize)}\nOptimized: ${formatSize(estimatedOutputSize)}\nSaved: ${estimatedSavingsPercent}%`,
        [{ text: 'Great', onPress: () => router.back() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Selected File Card */}
        <View style={styles.fileCard}>
          <Text style={styles.fileLabel}>Target File</Text>
          <Text style={styles.fileName}>{fileName}</Text>
          <Text style={styles.fileSize}>Input Size: {formatSize(fileSize)}</Text>
        </View>

        {/* Compression Strength Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compression Strength</Text>
          <View style={styles.strengthRow}>
            {(['LOW', 'BALANCED', 'HIGH', 'EXTREME'] as const).map((s) => (
              <SakugaButton
                key={s}
                title={s}
                onPress={() => setStrength(s)}
                variant={strength === s ? 'primary' : 'secondary'}
                style={styles.strengthBtn}
                textStyle={styles.strengthText}
              />
            ))}
          </View>
        </View>

        {/* Prediction Card */}
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>Estimated Output</Text>
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statVal}>{formatSize(estimatedOutputSize)}</Text>
              <Text style={styles.statSub}>Projected Size</Text>
            </View>
            <View>
              <Text style={[styles.statVal, { color: FORGE_COLORS.success }]}>
                -{estimatedSavingsPercent}%
              </Text>
              <Text style={styles.statSub}>Size Savings</Text>
            </View>
          </View>
        </View>

        {/* Execute Button */}
        <SakugaButton
          title={isProcessing ? 'Transcoding...' : 'Run Smart Compress'}
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
    padding: 20
  },
  fileCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 24
  },
  fileLabel: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 4
  },
  fileName: {
    color: FORGE_COLORS.text,
    fontSize: 18,
    fontWeight: '700'
  },
  fileSize: {
    color: FORGE_COLORS.textMuted,
    fontSize: 13,
    marginTop: 4
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    color: FORGE_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },
  strengthRow: {
    flexDirection: 'row',
    gap: 8
  },
  strengthBtn: {
    flex: 1,
    height: 42,
    paddingHorizontal: 4
  },
  strengthText: {
    fontSize: 11
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
    color: FORGE_COLORS.textMuted,
    fontSize: 13,
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
