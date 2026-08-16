import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { login, register } from '../api/auth';
import { saveAuthState, StoredUser } from '../store/auth.store';
import { Colors, Font, Radius, Space } from '../theme';

interface Props {
  onAuthenticated: (token: string, user: StoredUser) => void;
}

export function AuthScreen({ onAuthenticated }: Props) {
  const [mode, setMode]             = useState<'login' | 'register'>('login');
  const [email, setEmail]           = useState('');
  const [username, setUsername]     = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }
    if (isRegister && !username.trim()) {
      Alert.alert('Missing fields', 'Username is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = isRegister
        ? await register({ email: email.trim(), username: username.trim(), password, displayName: displayName.trim() || undefined })
        : await login({ email: email.trim(), password });

      await saveAuthState(payload.accessToken, payload.user);
      onAuthenticated(payload.accessToken, payload.user);
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* Brand */}
        <View style={s.brand}>
          <Text style={s.logo}>keep</Text>
          <Text style={s.tagline}>Master Real-World Finance. Build Lasting Wealth.</Text>
        </View>

        {/* Mode toggle */}
        <View style={s.toggle}>
          <Pressable style={[s.toggleBtn, !isRegister && s.toggleActive]} onPress={() => setMode('login')}>
            <Text style={[s.toggleText, !isRegister && s.toggleTextActive]}>Sign in</Text>
          </Pressable>
          <Pressable style={[s.toggleBtn, isRegister && s.toggleActive]} onPress={() => setMode('register')}>
            <Text style={[s.toggleText, isRegister && s.toggleTextActive]}>Create account</Text>
          </Pressable>
        </View>

        {/* Form */}
        <View style={s.form}>
          <TextInput
            style={s.input}
            placeholder="Email address"
            placeholderTextColor={Colors.textFaint}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          {isRegister && (
            <TextInput
              style={s.input}
              placeholder="Username"
              placeholderTextColor={Colors.textFaint}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}

          {isRegister && (
            <TextInput
              style={s.input}
              placeholder="Display name (optional)"
              placeholderTextColor={Colors.textFaint}
              value={displayName}
              onChangeText={setDisplayName}
            />
          )}

          <TextInput
            style={s.input}
            placeholder="Password (min 8 chars)"
            placeholderTextColor={Colors.textFaint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.black} />
              : <Text style={s.btnText}>{isRegister ? 'Create Account' : 'Sign In'}</Text>
            }
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Space.xl, paddingVertical: 48 },

  brand: { alignItems: 'center', marginBottom: 40, gap: 8 },
  logo:  { fontSize: Font.hero, fontWeight: Font.black, color: Colors.white, letterSpacing: -1 },
  tagline: { fontSize: Font.sm, color: Colors.textMuted, textAlign: 'center' },

  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Space.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn:        { flex: 1, paddingVertical: 10, borderRadius: Radius.md, alignItems: 'center' },
  toggleActive:     { backgroundColor: Colors.white },
  toggleText:       { fontSize: Font.sm, fontWeight: Font.semibold, color: Colors.textFaint },
  toggleTextActive: { color: Colors.black, fontWeight: Font.bold },

  form:  { gap: 12 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Space.md,
    paddingVertical: 14,
    fontSize: Font.base,
    color: Colors.white,
  },

  btn:         { marginTop: 6, backgroundColor: Colors.white, borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText:     { fontSize: Font.base, fontWeight: Font.bold, color: Colors.black },
});
