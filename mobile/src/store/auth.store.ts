import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@finlit:token';
const USER_KEY = '@finlit:user';

export interface StoredUser {
  id: string;
  email: string;
  displayName: string | null;
}

export interface AuthState {
  token: string | null;
  user: StoredUser | null;
}

/** Persist auth state to AsyncStorage */
export async function saveAuthState(
  token: string,
  user: StoredUser,
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

/** Load persisted auth state — returns null fields if not logged in */
export async function loadAuthState(): Promise<AuthState> {
  const [token, userJson] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);

  return {
    token,
    user: userJson ? (JSON.parse(userJson) as StoredUser) : null,
  };
}

/** Clear auth state on logout */
export async function clearAuthState(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}
