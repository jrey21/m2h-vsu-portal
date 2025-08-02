import { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import Auth from './src/components/Auth';
import Dashboard from './src/components/Dashboard';
import { View, AppState, Platform, StatusBar as RNStatusBar } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';
import React from 'react';

// Supabase auto-refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleNavigateToLogin = () => setShowLogin(true);
  const handleBackToHome = () => setShowLogin(false);

  // Create the status bar background view
  const renderStatusBarBackground = () => (
    <View style={{ height: RNStatusBar.currentHeight, backgroundColor: '#0d4f3c' }} />
  );

  if (session) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {renderStatusBarBackground()}
          <StatusBar style="light" translucent />
          <Dashboard session={session} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {renderStatusBarBackground()}
        <StatusBar style="light" translucent />
        {!showLogin ? (
          <Home onNavigateToLogin={handleNavigateToLogin} />
        ) : (
          <Auth onBackToHome={handleBackToHome} />
        )}
      </View>
    </SafeAreaProvider>
  );
}
