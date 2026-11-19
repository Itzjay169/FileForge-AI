import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useAuth } from '../../src/context/auth-context';
import { useQueue } from '../../src/context/queue-context';
import { FORGE_COLORS } from '../../src/theme/colors';
import { SakugaButton } from '../../src/components/SakugaButton';
import {
  User,
  Shield,
  HardDrive,
  Coins,
  Bell,
  WifiOff,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react-native';
import { formatBytes } from '@fileforge/shared';

export default function MobileSettingsScreen() {
  const { user, isBiometricEnabled, setBiometricEnabled, logout } = useAuth();
  const { offlineQueueEnabled, setOfflineQueueEnabled } = useQueue();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || 'Creator'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>{user?.planTier || 'PRO_CREATIVE'}</Text>
            </View>
          </View>
        </View>

        {/* Credits banner */}
        <View style={styles.creditsBanner}>
          <Coins size={16} color={FORGE_COLORS.accent} />
          <Text style={styles.creditsText}>
            {user?.creditsRemaining || 485} AI & Priority Processing Credits
          </Text>
        </View>
      </View>

      {/* Storage Allocation Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HardDrive size={18} color={FORGE_COLORS.primary} />
          <Text style={styles.cardTitle}>Cloud Storage</Text>
        </View>
        <Text style={styles.storageUsageText}>
          {formatBytes(user?.storageUsedBytes || 425000000)} of {formatBytes(user?.storageLimitBytes || 50 * 1024 * 1024 * 1024)} used
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '8%' }]} />
        </View>
      </View>

      {/* Security & Preferences */}
      <View style={styles.card}>
        <Text style={styles.sectionHeaderTitle}>Security & Offline</Text>

        {/* Biometrics */}
        <View style={styles.settingRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.settingLabel}>Biometric App Lock</Text>
            <Text style={styles.settingDesc}>Require Face ID or Fingerprint on app launch</Text>
          </View>
          <Switch
            value={isBiometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: '#2a2a38', true: FORGE_COLORS.primary }}
          />
        </View>

        {/* Offline Queue */}
        <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }]}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.settingLabel}>Offline Queueing</Text>
            <Text style={styles.settingDesc}>Cache jobs under 15 MB when network is offline</Text>
          </View>
          <Switch
            value={offlineQueueEnabled}
            onValueChange={setOfflineQueueEnabled}
            trackColor={{ false: '#2a2a38', true: FORGE_COLORS.primary }}
          />
        </View>

        {/* Push Notifications */}
        <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }]}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.settingLabel}>Job Notifications</Text>
            <Text style={styles.settingDesc}>Alert when background batch transcoding finishes</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#2a2a38', true: FORGE_COLORS.primary }}
          />
        </View>
      </View>

      {/* Log Out Button */}
      <View style={{ marginTop: 8 }}>
        <SakugaButton
          title="Sign Out"
          variant="secondary"
          onPress={handleLogout}
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: FORGE_COLORS.primarySoft,
    borderWidth: 1.5,
    borderColor: FORGE_COLORS.borderActive,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: FORGE_COLORS.primaryLight
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: FORGE_COLORS.text
  },
  userEmail: {
    fontSize: 12,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  },
  planBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  planText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: FORGE_COLORS.primaryLight
  },
  creditsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.25)'
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '600',
    color: FORGE_COLORS.accent
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FORGE_COLORS.text
  },
  storageUsageText: {
    fontSize: 12,
    color: FORGE_COLORS.textMuted,
    marginBottom: 8
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: FORGE_COLORS.primary,
    borderRadius: 4
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: FORGE_COLORS.text,
    marginBottom: 12
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: FORGE_COLORS.text
  },
  settingDesc: {
    fontSize: 11,
    color: FORGE_COLORS.textMuted,
    marginTop: 2
  }
});
