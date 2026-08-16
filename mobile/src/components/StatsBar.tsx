import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { UserStats } from '../api/user';
import { Colors, Font, Radius, Space } from '../theme';

interface Props {
  stats: UserStats;
}

function Stat({ icon, value, label, color }: { icon: string; value: number; label: string; color?: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.icon}>{icon}</Text>
      <Text style={[s.value, color ? { color } : null]}>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

export function StatsBar({ stats }: Props) {
  return (
    <View style={s.container}>
      <Stat icon="🔥" value={stats.currentStreak} label="Streak" color={stats.currentStreak > 0 ? Colors.amber : undefined} />
      <View style={s.divider} />
      <Stat icon="⭐" value={stats.xp} label="XP" color={Colors.indigo} />
      <View style={s.divider} />
      <Stat icon="⚡" value={stats.level} label="Level" />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Space.lg,
    marginBottom: Space.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  icon:  { fontSize: 18 },
  value: { fontSize: Font.lg, fontWeight: Font.extrabold, color: Colors.text },
  label: { fontSize: Font.xs, color: Colors.textFaint, fontWeight: Font.semibold, textTransform: 'uppercase', letterSpacing: 0.6 },
  divider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
});
