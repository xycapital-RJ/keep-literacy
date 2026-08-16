import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import {
  loadAuthState,
  saveAuthState,
  StoredUser,
} from './src/store/auth.store';
import { Colors } from './src/theme';

const GUEST_USER: StoredUser = {
  id: 'guest-explorer-001',
  email: 'guest@keep.app',
  displayName: 'Guest Explorer',
};
const GUEST_TOKEN = 'guest-demo-token-123';

interface AuthState {
  token: string | null;
  user: StoredUser | null;
  hydrated: boolean;
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({
    token: GUEST_TOKEN,
    user: GUEST_USER,
    hydrated: false,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { token, user } = await loadAuthState();
        if (token && user) {
          setAuth({ token, user, hydrated: true });
          return;
        }
      } catch {
        // Fallback to guest user
      }
      // Always default to Guest user so the app opens directly without sign-in
      await saveAuthState(GUEST_TOKEN, GUEST_USER);
      setAuth({ token: GUEST_TOKEN, user: GUEST_USER, hydrated: true });
    };
    init();
  }, []);

  const handleLogout = useCallback(async () => {
    // Re-login instantly as guest
    await saveAuthState(GUEST_TOKEN, GUEST_USER);
    setAuth({ token: GUEST_TOKEN, user: GUEST_USER, hydrated: true });
  }, []);

  if (!auth.hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator user={auth.user ?? GUEST_USER} token={auth.token ?? GUEST_TOKEN} onLogout={handleLogout} />
    </>
  );
}
