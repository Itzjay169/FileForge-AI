import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { FORGE_COLORS } from '../theme/colors';

interface SakugaButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const SakugaButton: React.FC<SakugaButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false
}) => {
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const flashOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }, { scaleY: scaleY.value }]
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value
  }));

  const handlePressIn = () => {
    if (disabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    scaleX.value = withSpring(1.08, { damping: 12, stiffness: 350 });
    scaleY.value = withSpring(0.9, { damping: 12, stiffness: 350 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    scaleX.value = withSequence(withSpring(0.96), withSpring(1));
    scaleY.value = withSequence(withSpring(1.06), withSpring(1));
    flashOpacity.value = withSequence(
      withTiming(0.4, { duration: 50 }),
      withTiming(0, { duration: 150 })
    );
    onPress();
  };

  const getBackgroundColor = () => {
    if (disabled) return '#262638';
    switch (variant) {
      case 'accent':
        return FORGE_COLORS.accent;
      case 'secondary':
        return 'rgba(255, 255, 255, 0.08)';
      default:
        return FORGE_COLORS.primary;
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: getBackgroundColor() },
          variant === 'secondary' && styles.secondaryBorder,
          animatedStyle,
          style
        ]}
      >
        <Animated.View style={[styles.flashOverlay, flashStyle]} />
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
    position: 'relative'
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff'
  }
});
