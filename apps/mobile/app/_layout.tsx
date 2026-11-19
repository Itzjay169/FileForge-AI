import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FORGE_COLORS } from '../src/theme/colors';

export default function RootLayout() {
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
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="formats"
          options={{
            title: 'Formats Explorer',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="studio"
          options={{
            title: 'Compression Studio'
          }}
        />
      </Stack>
    </>
  );
}
