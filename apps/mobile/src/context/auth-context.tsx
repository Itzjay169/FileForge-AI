import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@fileforge/shared';
import { mobileApiClient } from '../api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isBiometricEnabled: boolean;
  isLocked: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  setBiometricEnabled: (enabled: boolean) => void;
  unlockWithBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr_mobile_01',
    email: 'creator@fileforge.studio',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    planTier: 'PRO_CREATIVE',
    creditsRemaining: 485,
    storageUsedBytes: 425000000,
    storageLimitBytes: 50 * 1024 * 1024 * 1024,
    createdAt: Date.now() - 86400000 * 30
  });
  const [isBiometricEnabled, setBiometricEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsAuthenticated(true);
    setUser({
      id: 'usr_mobile_01',
      email,
      name: email.split('@')[0],
      planTier: 'PRO_CREATIVE',
      creditsRemaining: 485,
      storageUsedBytes: 425000000,
      storageLimitBytes: 50 * 1024 * 1024 * 1024,
      createdAt: Date.now()
    });
  };

  const signup = async (email: string, pass: string, name: string) => {
    setIsAuthenticated(true);
    setUser({
      id: 'usr_mobile_01',
      email,
      name,
      planTier: 'FREE',
      creditsRemaining: 50,
      storageUsedBytes: 0,
      storageLimitBytes: 5 * 1024 * 1024 * 1024,
      createdAt: Date.now()
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const unlockWithBiometrics = async (): Promise<boolean> => {
    // Biometric authentication emulation (iOS FaceID / Android Biometrics)
    setIsLocked(false);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isBiometricEnabled,
        isLocked,
        login,
        signup,
        logout,
        setBiometricEnabled,
        unlockWithBiometrics
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
