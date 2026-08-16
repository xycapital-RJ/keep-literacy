import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { GamificationResult } from '../api/progress';
import { Colors, Font, Radius, Space } from '../theme';

interface Props {
  visible: boolean;
  gamification: GamificationResult;
  onClose: () => void;
}

export function XpCelebrationModal({ visible, gamification, onClose }: Props) {
  const cardScale   = useSharedValue(0.88);
  const cardOpacity = useSharedValue(0);
  const xpScale     = useSharedValue(0.5);
  const xpOpacity   = useSharedValue(0);
  const row1Scale   = useSharedValue(0.7);
  const row1Opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      cardScale.value   = 0.88;
      cardOpacity.value = 0;
      xpScale.value     = 0.5;
      xpOpacity.value   = 0;
      row1Scale.value   = 0.7;
      row1Opacity.value = 0;
      return;
    }

    // Card
    cardOpacity.value = withTiming(1, { duration: 250 });
    cardScale.value   = withSpring(1, { damping: 18, stiffness: 200 });

    // XP number
    xpOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));
    xpScale.value   = withDelay(150, withSequence(
      withSpring(1.1, { damping: 10, stiffness: 260 }),
      withSpring(1,   { damping: 16 }),
    ));

    // Stats row
    row1Opacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    row1Scale.value   = withDelay(400, withSpring(1, { damping: 14, stiffness: 180 }));
  }, [visible]);

  const cardStyle  = useAnimatedStyle(() => ({ opacity: cardOpacity.value, transform: [{ scale: cardScale.value }] }));
  const xpStyle    = useAnimatedStyle(() => ({ opacity: xpOpacity.value,   transform: [{ scale: xpScale.value }] }));
  const row1Style  = useAnimatedStyle(() => ({ opacity: row1Opacity.value, transform: [{ scale: row1Scale.value }] }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Animated.View style={[s.card, cardStyle]}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.emoji}>🏆</Text>
            <Text style={s.title}>Lesson Complete</Text>
            <Text style={s.subtitle}>You earned XP for this lesson</Text>
          </View>

          {/* XP earned — hero number */}
          <Animated.View style={[s.xpWrap, xpStyle]}>
            <Text style={s.xpPlus}>+</Text>
            <Text style={s.xpNum}>{gamification.xpEarned}</Text>
            <Text style={s.xpUnit}>XP</Text>
          </Animated.View>

          {/* Divider */}
          <View style={s.divider} />

          {/* Stats */}
          <Animated.View style={[s.statsRow, row1Style]}>
            <View style={s.stat}>
              <Text style={s.statEmoji}>🔥</Text>
              <Text style={s.statNum}>{gamification.currentStreak}</Text>
              <Text style={s.statLabel}>Streak</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statEmoji}>⭐</Text>
              <Text style={s.statNum}>{gamification.xp}</Text>
              <Text style={s.statLabel}>Total XP</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statEmoji}>⚡</Text>
              <Text style={s.statNum}>{gamification.level}</Text>
              <Text style={s.statLabel}>Level</Text>
            </View>
          </Animated.View>

          {/* CTA */}
          <Pressable style={s.btn} onPress={onClose}>
            <Text style={s.btnText}>Continue</Text>
          </Pressable>

        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Space.lg,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    paddingTop: Space.xl,
    paddingBottom: Space.lg,
    paddingHorizontal: Space.xl,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    gap: Space.md,
    alignItems: 'center',
  },
  header: { alignItems: 'center', gap: 6 },
  emoji: { fontSize: 44 },
  title: { fontSize: Font.xl, fontWeight: Font.bold, color: Colors.text },
  subtitle: { fontSize: Font.sm, color: Colors.textMuted },

  xpWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginVertical: 4 },
  xpPlus: { fontSize: Font.xl, fontWeight: Font.black, color: Colors.green, lineHeight: 44 },
  xpNum:  { fontSize: 56, fontWeight: Font.black, color: Colors.green, lineHeight: 60 },
  xpUnit: { fontSize: Font.lg, fontWeight: Font.bold, color: Colors.green, lineHeight: 44 },

  divider: { width: '100%', height: 1, backgroundColor: Colors.border },

  statsRow: { flexDirection: 'row', width: '100%', paddingVertical: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statEmoji: { fontSize: 22 },
  statNum:   { fontSize: Font.xl, fontWeight: Font.extrabold, color: Colors.text },
  statLabel: { fontSize: Font.xs, color: Colors.textFaint, fontWeight: Font.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  btn: {
    width: '100%',
    backgroundColor: Colors.indigo,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: { fontSize: Font.base, fontWeight: Font.bold, color: '#fff', letterSpacing: 0.3 },
});
