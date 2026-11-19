import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { fileRegistry } from '@fileforge/file-registry';
import { FileFormatDefinition } from '@fileforge/shared';
import { FORGE_COLORS } from '../src/theme/colors';

export default function MobileFormatsScreen() {
  const [search, setSearch] = useState('');
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
    <View style={styles.card}>
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
        <Text style={styles.footerTag}>
          {item.conversionTargets.length} Targets
        </Text>
      </View>
    </View>
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
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8
  },
  footerTag: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'monospace'
  }
});
