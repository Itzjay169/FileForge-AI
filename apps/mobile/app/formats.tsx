import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { fileRegistry } from '@fileforge/file-registry';
import { FileFormatDefinition } from '@fileforge/shared';
import { FORGE_COLORS } from '../src/theme/colors';
import { SakugaButton } from '../src/components/SakugaButton';

export default function MobileFormatsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<FileFormatDefinition | null>(null);

  const allFormats = useMemo(() => fileRegistry.getAllFormats(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allFormats;
    const q = search.toLowerCase().trim().replace(/^\./, '');
    return allFormats.filter(
      (f) =>
        f.extension.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [allFormats, search]);

  const renderItem = ({ item }: { item: FileFormatDefinition }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedFormat(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.extBadge}>.{item.extension.toUpperCase()}</Text>
        <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
      </View>
      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
      <View style={styles.footerRow}>
        <Text style={styles.footerTag}>
          {item.compressionSupported ? '✓ Compress' : 'No Compression'}
        </Text>
        <Text style={[styles.footerTag, { color: '#c084fc' }]}>
          {item.conversionTargets.length} Convert Targets →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search format (e.g. docx, heic, mkv)..."
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.extension}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Target Formats Modal */}
      <Modal
        visible={Boolean(selectedFormat)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedFormat(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalExtTitle}>
                  .{selectedFormat?.extension.toUpperCase()} Conversions
                </Text>
                <Text style={styles.modalSubTitle}>{selectedFormat?.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedFormat(null)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionLabel}>COMPATIBLE TARGET FORMATS</Text>
            <ScrollView style={{ maxHeight: 280 }}>
              <View style={styles.targetsGrid}>
                {selectedFormat?.conversionTargets.map((targetExt) => {
                  const lossWarning = selectedFormat.lossWarnings?.[targetExt.toLowerCase()];
                  const isLossy = !!lossWarning?.isLossy;

                  return (
                    <TouchableOpacity
                      key={targetExt}
                      style={[
                        styles.targetChip,
                        isLossy && styles.targetChipLossy
                      ]}
                      onPress={() => {
                        const ext = selectedFormat.extension;
                        setSelectedFormat(null);
                        router.push(`/studio?name=sample.${ext}&target=${targetExt}`);
                      }}
                    >
                      <Text style={styles.targetChipExt}>.{targetExt.toUpperCase()}</Text>
                      <Text style={[styles.targetChipTag, isLossy && { color: '#f59e0b' }]}>
                        {isLossy ? 'Lossy' : 'Lossless'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <SakugaButton
              title="Launch Studio with this Format"
              onPress={() => {
                const ext = selectedFormat?.extension || 'png';
                setSelectedFormat(null);
                router.push(`/studio?name=sample.${ext}`);
              }}
              variant="primary"
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORGE_COLORS.background
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: FORGE_COLORS.border
  },
  searchInput: {
    height: 48,
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: FORGE_COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  list: {
    padding: 16,
    gap: 12
  },
  card: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  extBadge: {
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#c084fc',
    fontSize: 14
  },
  categoryText: {
    color: FORGE_COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  nameText: {
    color: FORGE_COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4
  },
  descText: {
    color: FORGE_COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8
  },
  footerTag: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'monospace'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: '#12121a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    paddingBottom: 36
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  modalExtTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'monospace'
  },
  modalSubTitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '700'
  },
  modalSectionLabel: {
    color: '#8b5cf6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10
  },
  targetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  targetChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  targetChipLossy: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)'
  },
  targetChipExt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  targetChipTag: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700'
  }
});
