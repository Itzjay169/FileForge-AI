import React from 'react';
import { Tabs } from 'expo-router';
import { FORGE_COLORS } from '../../src/theme/colors';
import { Zap, RefreshCw, Folder, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: FORGE_COLORS.backgroundElevated,
          borderTopColor: FORGE_COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarActiveTintColor: FORGE_COLORS.primary,
        tabBarInactiveTintColor: FORGE_COLORS.textDim,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600'
        },
        headerStyle: {
          backgroundColor: FORGE_COLORS.background,
          borderBottomColor: FORGE_COLORS.border,
          borderBottomWidth: 1
        },
        headerTintColor: FORGE_COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 17
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Studio',
          tabBarIcon: ({ color, size }) => <Zap color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="convert"
        options={{
          title: 'Convert',
          tabBarIcon: ({ color, size }) => <RefreshCw color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ color, size }) => <Folder color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
