import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../src/context/auth-context';
import { FORGE_COLORS } from '../../src/theme/colors';
import { SakugaButton } from '../../src/components/SakugaButton';
import { Lock, Mail, Sparkles } from 'lucide-react-native';

export default function MobileLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Sparkles size={12} color={FORGE_COLORS.accent} />
          <Text style={styles.badgeText}>FileForge Studio</Text>
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your cloud library and workspaces.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Mail size={18} color={FORGE_COLORS.textDim} style={{ marginRight: 10 }} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="creator@fileforge.studio"
            placeholderTextColor={FORGE_COLORS.textDim}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Lock size={18} color={FORGE_COLORS.textDim} style={{ marginRight: 10 }} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={FORGE_COLORS.textDim}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <SakugaButton
            title="Sign In"
            variant="default"
            isLoading={isLoading}
            onPress={handleLogin}
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FORGE_COLORS.background,
    padding: 24,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 28
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: FORGE_COLORS.accent
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: FORGE_COLORS.text,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: FORGE_COLORS.textMuted
  },
  form: {
    gap: 14
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORGE_COLORS.backgroundElevated,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: FORGE_COLORS.border
  },
  input: {
    flex: 1,
    color: FORGE_COLORS.text,
    fontSize: 14
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  footerText: {
    fontSize: 13,
    color: FORGE_COLORS.textMuted
  },
  linkText: {
    fontSize: 13,
    color: FORGE_COLORS.primaryLight,
    fontWeight: 'bold'
  }
});
