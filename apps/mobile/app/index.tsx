import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { SakugaButton } from '../src/components/SakugaButton';
import { FORGE_COLORS } from '../src/theme/colors';

export default function MobileHomeScreen() {
  const router = useRouter();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        router.push({
          pathname: '/studio',
          params: { name: file.name, size: file.size }
        });
      }
    } catch (e) {
      console.log('Error picking document', e);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        router.push({
          pathname: '/studio',
          params: { name: file.fileName || 'photo.jpg', size: file.fileSize || 2048000 }
        });
      }
    } catch (e) {
      console.log('Error picking image', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚡ SAKUGA MOBILE ENGINE</Text>
          </View>
          <Text style={styles.title}>FileForge AI</Text>
          <Text style={styles.subtitle}>
            Compress, convert, and forge your assets on the go. 2 GB free uploads.
          </Text>
        </View>

        {/* Dropzone / Upload Action Card */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Select Asset to Optimize</Text>
          <Text style={styles.actionDesc}>
            Supports video, camera RAW, office documents, PDFs & 3D models.
          </Text>

          <View style={styles.buttonStack}>
            <SakugaButton
              title="Browse Files (PDF, Docs, Video)"
              onPress={handlePickDocument}
              variant="primary"
            />
            <SakugaButton
              title="Camera Roll / Photos"
              onPress={handlePickImage}
              variant="secondary"
            />
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.linksRow}>
          <TouchableOpacity
            style={styles.pillCard}
            onPress={() => router.push('/formats')}
          >
            <Text style={styles.pillTitle}>200+ Formats</Text>
            <Text style={styles.pillSub}>Check capabilities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pillCard}
            onPress={() => router.push('/studio')}
          >
            <Text style={styles.pillTitle}>Studio Tuning</Text>
            <Text style={styles.pillSub}>Sliders & presets</Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
    paddingTop: 40
  },
  header: {
    marginBottom: 32
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: FORGE_COLORS.primarySoft,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12
  },
  badgeText: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '700'
  },
  title: {
    color: FORGE_COLORS.text,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  subtitle: {
    color: FORGE_COLORS.textMuted,
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22
  },
  actionCard: {
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border,
    marginBottom: 24
  },
  actionTitle: {
    color: FORGE_COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6
  },
  actionDesc: {
    color: FORGE_COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20
  },
  buttonStack: {
    gap: 12
  },
  linksRow: {
    flexDirection: 'row',
    gap: 12
  },
  pillCard: {
    flex: 1,
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  pillTitle: {
    color: FORGE_COLORS.text,
    fontSize: 15,
    fontWeight: '700'
  },
  pillSub: {
    color: FORGE_COLORS.textMuted,
    fontSize: 12,
    marginTop: 2
  }
});
