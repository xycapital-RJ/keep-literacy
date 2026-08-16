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
import { StoredUser } from '../store/auth.store';
import { Colors, Font, Radius, Space } from '../theme';
import { REAL_WORLD_SCENARIOS } from '../data/scenarios';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  user: StoredUser;
  token: string;
  onLogout: () => void;
}

const CATEGORY_TABS = ['All Features', 'Real-World Problems', 'Mastery Modules'];

interface FeatureIconItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  tag: string;
  actionType: 'LESSON' | 'SCENARIO' | 'COURSE';
  targetId: string;
  targetTitle?: string;
}

const MODULE_ITEMS: FeatureIconItem[] = [
  {
    id: 'feat-course-101',
    icon: '🛡️',
    title: 'Insurance Risk Shield',
    subtitle: 'Risk transfer & health emergency protection',
    tag: 'DEFENSE',
    actionType: 'LESSON',
    targetId: 'lesson-insurance-basics',
    targetTitle: 'Insurance Basics & Risk Shields',
  },
  {
    id: 'feat-index-fund',
    icon: '📈',
    title: 'Index Fund Engine',
    subtitle: 'NIFTY 50 & S&P passive compound wealth',
    tag: 'WEALTH',
    actionType: 'LESSON',
    targetId: 'lesson-index-funds',
    targetTitle: 'Index Funds: The Boring Wealth Engine',
  },
  {
    id: 'feat-credit-card',
    icon: '💳',
    title: 'Credit Card Masterclass',
    subtitle: 'Avoid 24% interest traps & build credit score',
    tag: 'ESSENTIAL',
    actionType: 'LESSON',
    targetId: 'lesson-cc-masterclass',
    targetTitle: 'Credit Card Masterclass',
  },
];

const REAL_WORLD_ITEMS: FeatureIconItem[] = [
  {
    id: 'feat-scen-inflation',
    icon: '⚡',
    title: 'Inflation Budget Survival',
    subtitle: 'Rebalance cash flow during 12% price jumps',
    tag: 'BUDGET',
    actionType: 'SCENARIO',
    targetId: 'scen-inflation-budget',
  },
  {
    id: 'feat-scen-salary',
    icon: '💰',
    title: 'Salary vs Stock Equity',
    subtitle: '$95k cash vs $80k + startup stock options',
    tag: 'NEGOTIATION',
    actionType: 'SCENARIO',
    targetId: 'scen-salary-negotiation',
  },
  {
    id: 'feat-scen-cc',
    icon: '🎯',
    title: 'Credit Card Trap Solver',
    subtitle: 'Simulate $3,500 payoff vs minimum payments',
    tag: 'SIMULATOR',
    actionType: 'SCENARIO',
    targetId: 'scen-credit-card-trap',
  },
];

export function HomeScreen({ navigation, user, token, onLogout }: Props) {
  const handleFeaturePress = (item: FeatureIconItem) => {
    if (item.actionType === 'SCENARIO') {
      navigation.navigate('Scenario', { scenarioId: item.targetId });
    } else if (item.actionType === 'LESSON') {
      navigation.navigate('Lesson', {
        lessonId: item.targetId,
        lessonTitle: item.targetTitle ?? item.title,
      });
    } else if (item.actionType === 'COURSE') {
      navigation.navigate('CourseDetail', {
        courseId: item.targetId,
        courseTitle: item.title,
      });
    }
  };

  const renderHeader = () => (
    <View style={s.headerContainer}>
      {/* Brand Top Bar */}
      <View style={s.topBar}>
        <View style={s.brandGroup}>
          <Text style={s.brandLogo}>keep</Text>
          <Text style={s.brandTag}>Command Center</Text>
        </View>

        <Pressable onPress={() => navigation.navigate('Profile')} style={s.profileBtn}>
          <Text style={s.profileIcon}>👤</Text>
        </Pressable>
      </View>

      {/* Main 2-Column Section: Modules on Left, Real-World Problems on Right */}
      <View style={s.twoColumnContainer}>
        {/* LEFT COLUMN: MASTERY MODULES */}
        <View style={s.columnBlock}>
          <View style={s.columnHeaderRow}>
            <Text style={s.columnSectionTitle}>📚 MASTERY MODULES</Text>
            <Text style={s.columnSectionSub}>Core learning paths</Text>
          </View>

          <View style={s.columnItemsStack}>
            {MODULE_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [s.iconTile, pressed && s.iconTilePressed]}
                onPress={() => handleFeaturePress(item)}
              >
                <View style={s.iconTileHeader}>
                  <View style={s.tileEmojiBg}>
                    <Text style={s.tileEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={s.tileTag}>{item.tag}</Text>
                </View>

                <Text style={s.tileTitle}>{item.title}</Text>
                <Text style={s.tileSub} numberOfLines={2}>{item.subtitle}</Text>

                <View style={s.tileFooter}>
                  <Text style={s.tileCta}>Start Module →</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* RIGHT COLUMN: REAL-WORLD PROBLEMS */}
        <View style={s.columnBlock}>
          <View style={s.columnHeaderRow}>
            <Text style={s.columnSectionTitle}>⚡ REAL-WORLD SOLVERS</Text>
            <Text style={s.columnSectionSub}>Interactive dilemma tools</Text>
          </View>

          <View style={s.columnItemsStack}>
            {REAL_WORLD_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [s.iconTile, pressed && s.iconTilePressed]}
                onPress={() => handleFeaturePress(item)}
              >
                <View style={s.iconTileHeader}>
                  <View style={s.tileEmojiBg}>
                    <Text style={s.tileEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={s.tileTag}>{item.tag}</Text>
                </View>

                <Text style={s.tileTitle}>{item.title}</Text>
                <Text style={s.tileSub} numberOfLines={2}>{item.subtitle}</Text>

                <View style={s.tileFooter}>
                  <Text style={s.tileCta}>Solve Problem →</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Real World Problems Section Header */}
      <View style={s.sectionHeaderRow}>
        <View>
          <Text style={s.sectionTitle}>REAL-WORLD PROBLEM ARENA</Text>
          <Text style={s.sectionSubtitle}>Interactive decision solvers with live net-worth feedback</Text>
        </View>
      </View>

      {/* Horizontal Scrollable Real-World Scenarios Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scenarioCarousel}
      >
        {REAL_WORLD_SCENARIOS.map((scen) => (
          <Pressable
            key={scen.id}
            style={s.scenarioCard}
            onPress={() => navigation.navigate('Scenario', { scenarioId: scen.id })}
          >
            <View style={s.scenTagWrap}>
              <Text style={s.scenCategory}>{scen.category}</Text>
              <Text style={s.scenDiff}>{scen.difficulty}</Text>
            </View>

            <Text style={s.scenTitle}>{scen.title}</Text>
            <Text style={s.scenTagline} numberOfLines={2}>{scen.tagline}</Text>

            <View style={s.scenCardFooter}>
              <Text style={s.scenCta}>Solve Problem →</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

    </View>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  headerContainer: {
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Space.md,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  brandLogo: {
    fontSize: Font.xxl,
    fontWeight: Font.black,
    color: Colors.white,
    letterSpacing: -1,
  },
  brandTag: {
    fontSize: Font.xs,
    fontWeight: Font.semibold,
    color: Colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 18,
  },

  twoColumnContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: Space.xl,
  },
  columnBlock: {
    flex: 1,
    gap: 12,
  },
  columnHeaderRow: {
    marginBottom: 4,
  },
  columnSectionTitle: {
    fontSize: 11,
    fontWeight: Font.extrabold,
    color: Colors.white,
    letterSpacing: 1.2,
  },
  columnSectionSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  columnItemsStack: {
    gap: 12,
  },

  sectionHeaderRow: {
    marginBottom: Space.md,
  },
  sectionTitle: {
    fontSize: Font.xs,
    fontWeight: Font.extrabold,
    color: Colors.white,
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  iconTile: {
    width: '100%',
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    gap: 8,
  },
  iconTilePressed: {
    backgroundColor: Colors.surfaceUp,
    borderColor: Colors.white,
  },
  iconTileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileEmojiBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceUp,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tileEmoji: {
    fontSize: 20,
  },
  tileTag: {
    fontSize: 9,
    fontWeight: Font.bold,
    color: Colors.textFaint,
    letterSpacing: 0.8,
  },
  tileTitle: {
    fontSize: Font.sm,
    fontWeight: Font.bold,
    color: Colors.white,
    lineHeight: 18,
  },
  tileSub: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  tileFooter: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tileCta: {
    fontSize: 11,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  scenarioCarousel: {
    gap: 14,
    paddingBottom: Space.xl,
  },
  scenarioCard: {
    width: 260,
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    justifyContent: 'space-between',
  },
  scenTagWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenCategory: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: Colors.textFaint,
    letterSpacing: 0.8,
  },
  scenDiff: {
    fontSize: 10,
    fontWeight: Font.semibold,
    color: Colors.textMuted,
  },
  scenTitle: {
    fontSize: Font.md,
    fontWeight: Font.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  scenTagline: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    lineHeight: 17,
    marginBottom: 16,
  },
  scenCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  scenCta: {
    fontSize: Font.xs,
    fontWeight: Font.bold,
    color: Colors.white,
  },

  listContent: {
    paddingBottom: 48,
  },
  courseCard: {
    marginHorizontal: Space.lg,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Space.md,
  },
  courseBody: {
    gap: 8,
  },
  courseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    flex: 1,
    fontSize: Font.base,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceUp,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: Font.semibold,
    color: Colors.textMuted,
  },
  courseDesc: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  courseCta: {
    fontSize: Font.xs,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  courseModuleCount: {
    fontSize: 10,
    color: Colors.textFaint,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyText: {
    color: Colors.textFaint,
    textAlign: 'center',
    marginTop: 32,
    fontSize: Font.base,
  },
});
