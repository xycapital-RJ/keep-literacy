import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Slide } from '../../types/slide';
import { SlideRenderer, QuizState } from './SlideRenderer';
import { recordSlideAttempt } from '../../api/progress';
import { Colors, Font, Radius, Space } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ANIMATION_DURATION = 240;

export interface LessonCardEngineProps {
  slides: Slide[];
  lessonId: string;
  userId?: string;
  onLessonComplete?: (lessonId: string) => Promise<void>;
  onSlideChange?: (index: number) => void;
}

type QuizStateMap = Record<string, QuizState>;

export function LessonCardEngine({
  slides,
  lessonId,
  userId,
  onLessonComplete,
  onSlideChange,
}: LessonCardEngineProps) {
  const sortedSlides = useMemo(
    () => [...slides].sort((a, b) => a.order - b.order),
    [slides],
  );
  const slideCount = sortedSlides.length;

  const [displayIndex, setDisplayIndex] = useState(0);
  const [quizStates, setQuizStates] = useState<QuizStateMap>({});

  const currentIndex = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const isAnimating = useSharedValue(false);
  const hasCompletedRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);

  const syncDisplayIndex = useCallback(
    (index: number) => {
      setDisplayIndex(index);
      onSlideChange?.(index);
    },
    [onSlideChange],
  );

  const handleLessonComplete = useCallback(async () => {
    if (hasCompletedRef.current || !onLessonComplete) return;
    hasCompletedRef.current = true;
    try {
      await onLessonComplete(lessonId);
    } catch (error) {
      hasCompletedRef.current = false;
      console.error('[LessonCardEngine] Failed to save progress:', error);
    }
  }, [lessonId, onLessonComplete]);

  const canAdvanceFromCurrent = useCallback(
    (index: number): boolean => {
      const slide = sortedSlides[index];
      if (slide?.type !== 'QUIZ') return true;
      const state = quizStates[slide.id];
      return !!state && state.answerState !== 'unanswered';
    },
    [sortedSlides, quizStates],
  );

  const handleOptionSelect = useCallback(
    async (slide: Slide, optionIndex: number) => {
      if (!slide.id) return;
      // Only block re-tapping if an answer has ALREADY been recorded
      const existing = quizStates[slide.id];
      if (existing && existing.answerState !== 'unanswered') return;

      const localCorrect = slide.correctOption === optionIndex;

      setQuizStates((prev) => ({
        ...prev,
        [slide.id]: {
          selectedOption: optionIndex,
          answerState: localCorrect ? 'correct' : 'wrong',
          correctOption: slide.correctOption ?? null,
          explanation: slide.explanation ?? null,
        },
      }));

      if (userId) {
        try {
          const result = await recordSlideAttempt(slide.id, userId, optionIndex);
          setQuizStates((prev) => ({
            ...prev,
            [slide.id]: {
              selectedOption: optionIndex,
              answerState: result.isCorrect ? 'correct' : 'wrong',
              correctOption: result.correctOption,
              explanation: result.explanation,
            },
          }));
        } catch (e) {
          console.log('[LessonCardEngine] API attempt fallback:', e);
        }
      }
    },
    [quizStates, userId],
  );

  const animateVertical = useCallback(
    (direction: 'next' | 'prev', nextIdx: number) => {
      isAnimating.value = true;
      const exitOffset = direction === 'next' ? -140 : 140;

      translateY.value = withTiming(exitOffset, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });

      opacity.value = withTiming(0.3, { duration: ANIMATION_DURATION }, (finished) => {
        if (!finished) {
          isAnimating.value = false;
          return;
        }

        currentIndex.value = nextIdx;
        runOnJS(syncDisplayIndex)(nextIdx);

        if (direction === 'next' && nextIdx === slideCount - 1) {
          runOnJS(handleLessonComplete)();
        }

        translateY.value = direction === 'next' ? 140 : -140;
        translateY.value = withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
        });

        opacity.value = withTiming(1, { duration: ANIMATION_DURATION }, () => {
          isAnimating.value = false;
        });
      });
    },
    [handleLessonComplete, slideCount, syncDisplayIndex],
  );

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating.value) return;

      const canGoNext = currentIndex.value < slideCount - 1;
      const canGoPrev = currentIndex.value > 0;

      if (direction === 'next' && !canGoNext) return;
      if (direction === 'prev' && !canGoPrev) return;

      if (direction === 'next' && !canAdvanceFromCurrent(currentIndex.value)) {
        return;
      }

      const nextIdx =
        direction === 'next'
          ? currentIndex.value + 1
          : currentIndex.value - 1;

      animateVertical(direction, nextIdx);
    },
    [animateVertical, canAdvanceFromCurrent, slideCount],
  );

  // Web Keyboard, Mouse Wheel & Mobile Touch Drag Vertical Swipe Listeners
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        navigate('next');
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigate('prev');
      }
    };

    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 450) return;
      if (Math.abs(event.deltaY) > 20) {
        lastWheelTimeRef.current = now;
        if (event.deltaY > 0) {
          navigate('next');
        } else {
          navigate('prev');
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('input'))) {
        return;
      }
      if (e.touches && e.touches[0]) {
        touchStartYRef.current = e.touches[0].clientY;
        touchStartXRef.current = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Don't intercept taps on interactive elements (quiz options, buttons, inputs)
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('[role="button"]') || target.closest('button') || target.closest('input'))) {
        return;
      }
      if (e.changedTouches && e.changedTouches[0]) {
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const deltaY = touchStartYRef.current - endY;
        const deltaX = Math.abs((touchStartXRef.current ?? endX) - endX);
        // Only treat as vertical swipe if primarily vertical and long enough
        if (Math.abs(deltaY) > 60 && Math.abs(deltaY) > deltaX * 1.5) {
          if (deltaY > 0) {
            navigate('next');
          } else {
            navigate('prev');
          }
        }
      }
    };

    const handleNavigateNext = () => {
      navigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keep-navigate-next', handleNavigateNext);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keep-navigate-next', handleNavigateNext);
    };
  }, [navigate]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const currentSlide = sortedSlides[displayIndex];
  const isCurrentQuiz = currentSlide?.type === 'QUIZ';
  const currentQuizAnswered =
    isCurrentQuiz &&
    !!quizStates[currentSlide.id] &&
    quizStates[currentSlide.id]?.answerState !== 'unanswered';

  if (slideCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No slides available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {/* Side Progress Track — hidden on mobile for clean full-screen look */}
      {!isMobile && (
        <View style={styles.sideProgressTrack}>
          {sortedSlides.map((s, idx) => {
            const isDone = idx < displayIndex;
            const isCurrent = idx === displayIndex;
            return (
              <View
                key={s.id ?? idx}
                style={[
                  styles.verticalDot,
                  isDone && styles.verticalDotDone,
                  isCurrent && styles.verticalDotActive,
                ]}
              />
            );
          })}
        </View>
      )}

      {/* Top Header Bar */}
      <View style={[styles.counterRow, isMobile && styles.counterRowMobile]}>
        <Text style={styles.counter}>
          {displayIndex + 1} / {slideCount}
        </Text>
        {isCurrentQuiz && !currentQuizAnswered ? (
          <Text style={styles.quizGateHint}>Tap an answer ↓</Text>
        ) : (
          <Text style={styles.navHint}>Swipe up / down</Text>
        )}
      </View>

      {/* Stage Container */}
      <View style={[styles.stage, isMobile && styles.stageMobile]}>
        <View style={[styles.cardContainer, isMobile && styles.cardContainerMobile]}>
          <Animated.View style={[styles.card, isMobile && styles.cardMobile, cardAnimatedStyle]}>
            <SlideRenderer
              slide={currentSlide}
              quizState={quizStates[currentSlide.id]}
              onOptionSelect={(idx) => handleOptionSelect(currentSlide, idx)}
            />
          </Animated.View>
        </View>

        {/* Desktop-only floating nav buttons */}
        {!isMobile && (
          <View style={styles.desktopControlColumn}>
            {displayIndex > 0 ? (
              <Pressable
                style={styles.desktopNavBtn}
                onPress={() => navigate('prev')}
              >
                <Text style={styles.navArrowText}>↑</Text>
              </Pressable>
            ) : null}

            {displayIndex < slideCount - 1 && (!isCurrentQuiz || currentQuizAnswered) ? (
              <Pressable
                style={[styles.desktopNavBtn, styles.desktopNavBtnActive]}
                onPress={() => navigate('next')}
              >
                <Text style={styles.navArrowTextActive}>↓</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </View>

      {/* Bottom Nav Action Bar */}
      <View style={[styles.bottomBar, isMobile && styles.bottomBarMobile]}>
        <Pressable
          style={[styles.navActionBtn, displayIndex === 0 && styles.navBtnDisabled]}
          disabled={displayIndex === 0}
          onPress={() => navigate('prev')}
        >
          <Text style={styles.navActionText}>↑ Swipe Up</Text>
        </Pressable>

        {displayIndex < slideCount - 1 ? (
          <Pressable
            style={[
              styles.navActionBtnPrimary,
              isCurrentQuiz && !currentQuizAnswered && styles.navBtnDisabled,
            ]}
            disabled={isCurrentQuiz && !currentQuizAnswered}
            onPress={() => navigate('next')}
          >
            <Text style={styles.navActionTextPrimary}>Swipe Down ↓</Text>
          </Pressable>
        ) : (
          <Text style={styles.completeBadge}>✓ Reel Completed</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingTop: 12,
    paddingHorizontal: Space.md,
    paddingBottom: Space.md,
    justifyContent: 'space-between',
  },
  containerMobile: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  sideProgressTrack: {
    position: 'absolute',
    left: 8,
    top: 60,
    bottom: 60,
    width: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  verticalDot: {
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  verticalDotActive: {
    height: 24,
    backgroundColor: Colors.white,
  },
  verticalDotDone: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 18,
    paddingRight: 4,
  },
  counterRowMobile: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    marginBottom: 0,
    backgroundColor: 'rgba(10,10,10,0.55)',
  },
  counter: {
    fontSize: Font.xs,
    fontWeight: Font.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  quizGateHint: {
    fontSize: Font.xs,
    color: Colors.warning,
    fontWeight: Font.bold,
  },
  navHint: {
    fontSize: Font.xs,
    color: Colors.textFaint,
  },
  stage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingLeft: 12,
  },
  stageMobile: {
    paddingLeft: 0,
    alignItems: 'stretch',
  },
  cardContainer: {
    flex: 1,
    maxWidth: 420,
    height: '100%',
    alignSelf: 'center',
  },
  cardContainerMobile: {
    maxWidth: 9999,
    alignSelf: 'stretch',
  },
  card: {
    flex: 1,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderUp,
  },
  cardMobile: {
    borderRadius: 0,
    borderWidth: 0,
  },
  desktopControlColumn: {
    gap: 12,
    marginLeft: 12,
  },
  desktopNavBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  desktopNavBtnActive: {
    backgroundColor: Colors.white,
  },
  navArrowText: {
    fontSize: 22,
    color: Colors.textMuted,
    fontWeight: Font.bold,
  },
  navArrowTextActive: {
    fontSize: 22,
    color: Colors.black,
    fontWeight: Font.bold,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingLeft: 18,
    paddingRight: 4,
  },
  bottomBarMobile: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(10,10,10,0.75)',
    zIndex: 30,
  },

  navActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navActionText: {
    color: Colors.textMuted,
    fontSize: Font.xs,
    fontWeight: Font.semibold,
  },
  navActionBtnPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  navActionTextPrimary: {
    color: Colors.black,
    fontSize: Font.xs,
    fontWeight: Font.bold,
  },
  completeBadge: {
    color: Colors.white,
    fontWeight: Font.bold,
    fontSize: Font.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: Font.base,
  },
});
