import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/auth-context';
import { QueueProvider } from '../src/context/queue-context';
import { FORGE_COLORS } from '../src/theme/colors';
import { SakugaButton } from '../src/components/SakugaButton';
import { Lock } from 'lucide-react-native';

function RootNavigator() {
  const { isLocked, unlockWithBiometrics } = useAuth();

  if (isLocked) {
    return (
      <View style={styles.lockedContainer}>
        <View style={styles.lockedIconWrapper}>
          <Lock size={40} color={FORGE_COLORS.primary} />
        </View>
        <Text style={styles.lockedTitle}>FileForge AI Locked</Text>
        <Text style={styles.lockedSubtitle}>
          Biometric app security enabled. Confirm your identity to unlock.
        </Text>
        <View style={{ marginTop: 24, width: '100%', maxWidth: 280 }}>
          <SakugaButton
            title="Unlock with Biometrics"
            variant="default"
            onPress={unlockWithBiometrics}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: FORGE_COLORS.background
          },
          headerTintColor: FORGE_COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          contentStyle: {
            backgroundColor: FORGE_COLORS.background
          }
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal'
          }}
        />
        <Stack.Screen
          name="share-sheet"
          options={{
            title: 'Share to FileForge',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{
            title: 'Sign In',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen
          name="(auth)/signup"
          options={{
            title: 'Create Account',
            headerBackTitle: 'Back'
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueueProvider>
        <RootNavigator />
      </QueueProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    backgroundColor: FORGE_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  lockedIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: FORGE_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: FORGE_COLORS.borderActive
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FORGE_COLORS.text,
    marginBottom: 8
  },
  lockedSubtitle: {
    fontSize: 13,
    color: FORGE_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280
  }
});
