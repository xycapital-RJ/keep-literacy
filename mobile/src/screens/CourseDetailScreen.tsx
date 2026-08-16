import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { fetchCourse } from '../api/courses';
import type { CourseWithModules, Lesson } from '../types/course';
import type { RootStackParamList } from '../navigation/types';
import { Colors, Font, Radius, Space } from '../theme';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CourseDetail'>;
  route: RouteProp<RootStackParamList, 'CourseDetail'>;
}

export function CourseDetailScreen({ navigation, route }: Props) {
  const { courseId } = route.params;
  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCourse(await fetchCourse(courseId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate('Lesson', { lessonId: lesson.id, lessonTitle: lesson.title });
  };

  const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;

  return (
    <SafeAreaView style={s.root} edges={['bottom', 'top']}>
      {/* Header */}
      <View style={s.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Text style={s.backLogo}>keep</Text>
        </Pressable>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
          <Pressable style={s.retryBtn} onPress={load}>
            <Text style={s.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : course ? (
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Meta strip */}
          <View style={s.metaStrip}>
            <View style={s.metaItem}>
              <Text style={s.metaValue}>{course.modules.length}</Text>
              <Text style={s.metaLabel}>Modules</Text>
            </View>
            <View style={s.metaDivider} />
            <View style={s.metaItem}>
              <Text style={s.metaValue}>{totalLessons}</Text>
              <Text style={s.metaLabel}>Lessons</Text>
            </View>
            <View style={s.metaDivider} />
            <View style={s.metaItem}>
              <Text style={s.metaValue}>{course.difficulty}</Text>
              <Text style={s.metaLabel}>Level</Text>
            </View>
          </View>

          {course.description ? (
            <Text style={s.courseDesc}>{course.description}</Text>
          ) : null}

          {/* Modules */}
          {course.modules.filter(m => m.lessons.length > 0).map((mod, modIdx) => (
            <View key={mod.id} style={s.module}>
              <View style={s.moduleHeader}>
                <View style={s.moduleNumWrap}>
                  <Text style={s.moduleNum}>{modIdx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.moduleTitle}>{mod.title}</Text>
                  {mod.description ? (
                    <Text style={s.moduleDesc}>{mod.description}</Text>
                  ) : null}
                </View>
              </View>

              {/* Lessons List */}
              <View style={s.lessonList}>
                {mod.lessons.map((lesson, idx) => (
                  <Pressable
                    key={lesson.id}
                    style={s.lessonRow}
                    onPress={() => handleLessonPress(lesson)}
                  >
                    <Text style={s.lessonNum}>{idx + 1}</Text>
                    <View style={s.lessonInfo}>
                      <Text style={s.lessonTitle}>{lesson.title}</Text>
                      {lesson.description ? (
                        <Text style={s.lessonDesc} numberOfLines={1}>{lesson.description}</Text>
                      ) : null}
                    </View>
                    <View style={s.xpBadge}>
                      <Text style={s.xpText}>+{lesson.xpReward}</Text>
                      <Text style={s.xpUnit}>XP</Text>
                    </View>
                    <Text style={s.chevron}>›</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  errorText: { color: Colors.danger, fontSize: Font.base, textAlign: 'center', paddingHorizontal: 24 },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.md, backgroundColor: Colors.white },
  retryText: { color: Colors.black, fontWeight: Font.bold, fontSize: Font.sm },

  scroll: { paddingHorizontal: Space.lg, paddingTop: Space.md, paddingBottom: 48, gap: Space.xl },

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
  backArrow: { fontSize: 24, color: Colors.textFaint, fontWeight: Font.bold },
  backLogo: {
    fontSize: Font.xl,
    fontWeight: Font.black,
    color: Colors.white,
    letterSpacing: -0.5,
  },

  metaStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaItem: { flex: 1, alignItems: 'center', gap: 2 },
  metaValue: { fontSize: Font.xl, fontWeight: Font.extrabold, color: Colors.white },
  metaLabel: { fontSize: Font.xs, color: Colors.textFaint, fontWeight: Font.semibold, textTransform: 'uppercase', letterSpacing: 0.6 },
  metaDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  courseDesc: { fontSize: Font.base, color: Colors.textMuted, lineHeight: 23 },

  module: { gap: 10 },
  moduleHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  moduleNumWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceUp,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  moduleNum: { fontSize: Font.sm, fontWeight: Font.bold, color: Colors.white },
  moduleTitle: { fontSize: Font.md, fontWeight: Font.bold, color: Colors.white },
  moduleDesc: { fontSize: Font.xs, color: Colors.textFaint, marginTop: 2 },

  lessonList: { gap: 8, paddingLeft: 42 },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  lessonNum: { fontSize: Font.sm, fontWeight: Font.bold, color: Colors.textFaint, width: 18, textAlign: 'center' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: Font.base, fontWeight: Font.semibold, color: Colors.white },
  lessonDesc: { fontSize: Font.xs, color: Colors.textFaint, marginTop: 2 },
  xpBadge: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  xpText: { fontSize: Font.sm, fontWeight: Font.bold, color: Colors.white },
  xpUnit: { fontSize: Font.xs, fontWeight: Font.bold, color: Colors.textMuted },
  chevron: { fontSize: 20, color: Colors.textFaint, lineHeight: 22 },
});
