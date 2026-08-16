import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { fetchLesson } from '../api/lessons';
import { saveLessonProgress } from '../api/progress';
import { LessonCardEngine } from '../components/LessonCardEngine';
import type { LessonWithSlides } from '../types/course';
import type { RootStackParamList } from '../navigation/types';
import { StoredUser } from '../store/auth.store';
import { Colors, Font, Radius } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lesson'>;
  route: RouteProp<RootStackParamList, 'Lesson'>;
  user: StoredUser;
}

export function LessonScreen({ navigation, route, user }: Props) {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<LessonWithSlides | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setLesson(await fetchLesson(lessonId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => { load(); }, [load]);

  const handleComplete = useCallback(
    async (id: string) => {
      try {
        await saveLessonProgress(id, { userId: user.id, status: 'COMPLETED' });
        Alert.alert(
          'Lesson Complete 🎉',
          'Well done! Keep going.',
          [{ text: 'Back', onPress: () => navigation.goBack() }],
        );
      } catch (e) {
        Alert.alert(
          'Progress not saved',
          e instanceof Error ? e.message : 'Unknown error',
        );
      }
    },
    [user.id, navigation],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Lesson not found'}</Text>
        <Pressable style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <View style={styles.topHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Home')}>
              <Text style={styles.backLogo}>keep</Text>
            </Pressable>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
          <View style={{ width: 60 }} />
        </View>

        <LessonCardEngine
          slides={lesson.slides}
          lessonId={lesson.id}
          userId={user.id}
          onLessonComplete={handleComplete}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    gap: 12,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Font.base,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
  },
  retryText: {
    color: Colors.black,
    fontWeight: Font.bold,
    fontSize: Font.sm,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backArrow: { fontSize: 20, color: Colors.white, fontWeight: '700' as any },
  backLogo: { fontSize: 16, fontWeight: '900' as any, color: Colors.white, letterSpacing: -0.5 },
  headerTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as any,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
