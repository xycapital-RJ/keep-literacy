import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { StoredUser } from '../store/auth.store';
import { Colors, Font, Radius, Space } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  user: StoredUser;
  onLogout: () => void;
}

export function ProfileScreen({ navigation, user, onLogout }: Props) {
  const initials = (user.email ?? 'U').slice(0, 2).toUpperCase();
  const displayName = user.email?.split('@')[0] ?? 'Learner';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <Text style={s.backLabel}>keep</Text>
          </Pressable>
        </View>
        <Text style={s.screenTitle}>Profile</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.displayName}>{displayName}</Text>
          <Text style={s.emailText}>{user.email}</Text>
        </View>

        {/* Sign Out */}
        <Pressable style={s.signOutBtn} onPress={onLogout}>
          <Text style={s.signOutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 20, color: Colors.white, fontWeight: Font.bold },
  backLabel: {
    fontSize: Font.base,
    fontWeight: Font.black,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontSize: Font.base,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  scroll: {
    paddingHorizontal: Space.lg,
    paddingTop: Space.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Space.xl,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: Font.black,
    color: Colors.black,
  },
  displayName: {
    fontSize: Font.xl,
    fontWeight: Font.bold,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  emailText: {
    fontSize: Font.xs,
    color: Colors.textMuted,
  },
  signOutBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: Font.base,
    fontWeight: Font.semibold,
    color: Colors.textMuted,
  },
});
