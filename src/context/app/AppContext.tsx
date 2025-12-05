'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS, getStorageData, setStorageData } from '@/lib/storage';

interface AppState {
  hasCompletedOnboarding: boolean;
  isInitialized: boolean;
}

interface AppContextType {
  hasCompletedOnboarding: boolean;
  isInitialized: boolean;
  completeOnboarding: () => void;
  resetApp: () => void;
}

const defaultAppState: AppState = {
  hasCompletedOnboarding: false,
  isInitialized: false,
};

export const AppContext = createContext<AppContextType>({
  hasCompletedOnboarding: false,
  isInitialized: false,
  completeOnboarding: () => {},
  resetApp: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);

  useEffect(() => {
    // Load app state from localStorage on mount
    const savedState = getStorageData<AppState>(STORAGE_KEYS.APP_STATE);
    setAppState({
      hasCompletedOnboarding: savedState?.hasCompletedOnboarding ?? false,
      isInitialized: true,
    });
  }, []);

  const completeOnboarding = () => {
    const newState: AppState = {
      ...appState,
      hasCompletedOnboarding: true,
    };
    setStorageData(STORAGE_KEYS.APP_STATE, newState);
    setAppState(newState);
  };

  const resetApp = () => {
    // Clear all localStorage data
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
    setAppState({ ...defaultAppState, isInitialized: true });
  };

  return (
    <AppContext.Provider
      value={{
        hasCompletedOnboarding: appState.hasCompletedOnboarding,
        isInitialized: appState.isInitialized,
        completeOnboarding,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

