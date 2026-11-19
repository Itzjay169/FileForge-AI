import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FORGE_COLORS } from '../src/theme/colors';
import { SakugaButton } from '../src/components/SakugaButton';
import { Zap, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: Zap,
    color: FORGE_COLORS.primary,
    title: 'Smart Compression',
    desc: 'Intelligently compress 4K videos, high-res photos, and multi-page PDFs to exact WhatsApp and email limits without losing visual clarity.'
  },
  {
    icon: RefreshCw,
    color: FORGE_COLORS.accent,
    title: 'Universal Converter',
    desc: 'Transcode between 100+ documents, audio tracks, videos, spreadsheets, and 3D meshes right from your mobile device.'
  },
  {
    icon: ShieldCheck,
    color: FORGE_COLORS.success,
    title: 'Content Authenticity',
    desc: 'Verify C2PA provenance manifests, inspect EXIF metadata, add visible creator watermarks, and declare AI-assisted workflows.'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);

  const handleNext = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const slide = SLIDES[slideIndex];
  const SlideIcon = slide.icon;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContent}>
        <View style={[styles.iconCircle, { borderColor: slide.color }]}>
          <SlideIcon size={48} color={slide.color} />
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      <View style={styles.bottomSection}>
        {/* Indicators */}
        <View style={styles.indicatorRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                slideIndex === i && styles.indicatorActive
              ]}
            />
          ))}
        </View>

        <SakugaButton
          title={slideIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
          variant="default"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORGE_COLORS.background,
    padding: 24,
    justifyContent: 'space-between'
  },
  topRow: {
    alignItems: 'flex-end',
    paddingTop: 40
  },
  skipText: {
    color: FORGE_COLORS.textDim,
    fontSize: 14,
    fontWeight: '600'
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 20
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: FORGE_COLORS.text,
    textAlign: 'center',
    marginBottom: 14
  },
  desc: {
    fontSize: 14,
    color: FORGE_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22
  },
  bottomSection: {
    paddingBottom: 30
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  indicatorActive: {
    width: 24,
    backgroundColor: FORGE_COLORS.primary
  }
});
