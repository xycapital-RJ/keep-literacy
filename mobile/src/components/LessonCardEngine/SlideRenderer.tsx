import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { Slide } from '../../types/slide';
import { Colors, Font, Radius, Space } from '../../theme';

export type AnswerState = 'unanswered' | 'correct' | 'wrong';

export interface QuizState {
  selectedOption: number | null;
  answerState: AnswerState;
  correctOption: number | null;
  explanation: string | null;
}

export interface SlideRendererProps {
  slide: Slide & { html?: string };
  quizState?: QuizState;
  onOptionSelect?: (optionIndex: number) => void;
  onNextSlide?: () => void;
}

function getSlideIcon(title?: string, type?: string): string {
  if (!title) return '✨';
  const t = title.toLowerCase();
  if (t.includes('time') || t.includes('unfair advantage')) return '⌛';
  if (t.includes('clean') || t.includes('self-cleaning') || t.includes('machine')) return '⚙️';
  if (t.includes('shield') || t.includes('protect')) return '🛡️';
  if (t.includes('ghost')) return '👻';
  if (t.includes('credit') || t.includes('card') || t.includes('debit')) return '💳';
  if (t.includes('math') || t.includes('formula') || t.includes('number')) return '📊';
  if (t.includes('trust') || t.includes('rule')) return '🔑';
  if (t.includes('haystack') || t.includes('bogle')) return '🌾';
  if (t.includes('index') || t.includes('stock') || t.includes('sip')) return '📈';
  if (t.includes('risk') || t.includes('insurance')) return '☔';
  if (t.includes('rent') || t.includes('buy') || t.includes('home')) return '🏠';
  if (type?.toUpperCase() === 'QUIZ') return '🎯';
  return '💡';
}

function useShake(trigger: boolean) {
  const x = useSharedValue(0);
  React.useEffect(() => {
    if (trigger) {
      x.value = withSequence(
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-6, { duration: 55 }),
        withTiming(6, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      );
    }
  }, [trigger]);
  return useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
}

// ── HTML Animated Slide Component ──────────────────────────────────────────────
function HtmlSlide({ html }: { html: string }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const wrapper = containerRef.current?.querySelector('.slide-html-wrapper') || document.querySelector('.slide-html-wrapper');
      if (!wrapper) return;

      // ── Convert static display boxes (like age "24" or contribution "₹5,000") into real interactive editable inputs ──
      const displayBoxes = wrapper.querySelectorAll('div');
      displayBoxes.forEach((div) => {
        const dEl = div as HTMLElement;
        if (dEl.getAttribute('data-keep-input-bound') === 'true') return;

        const style = dEl.getAttribute('style') || '';
        const text = (dEl.textContent || '').trim();

        // Check if this div is an input container (border-accent or contains numbers like "24")
        const isInputBox = (
          (style.includes('border') && (style.includes('border-accent') || style.includes('A9C7E8') || style.includes('radius'))) ||
          dEl.classList.contains('s2')
        );

        if (!isInputBox) return;

        const spans = dEl.querySelectorAll('span');
        if (spans.length === 0) return;

        let numSpan: HTMLElement | null = null;
        let prefixText = '';

        spans.forEach((sp) => {
          const sText = (sp.textContent || '').trim();
          if (sText.includes('₹') || sText.includes('$')) {
            prefixText = sText;
          }
          if (/[0-9]/.test(sText)) {
            numSpan = sp as HTMLElement;
          }
        });

        if (!numSpan) return;
        dEl.setAttribute('data-keep-input-bound', 'true');

        const initialVal = ((numSpan as HTMLElement).textContent || '').replace(/,/g, '').trim() || '24';

        // Clear existing static spans inside the box
        dEl.innerHTML = '';
        dEl.style.cursor = 'text';
        dEl.style.border = '2px solid var(--text-accent, #0C447C)';
        dEl.style.background = '#FFFFFF';
        dEl.style.padding = '12px 18px';
        dEl.style.gap = '8px';
        dEl.style.display = 'flex';
        dEl.style.alignItems = 'center';
        dEl.style.justifyContent = 'center';

        if (prefixText) {
          const pEl = document.createElement('span');
          pEl.textContent = prefixText;
          pEl.style.fontSize = '24px';
          pEl.style.fontWeight = '700';
          pEl.style.color = 'var(--text-muted, #888780)';
          dEl.appendChild(pEl);
        }

        const inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.inputMode = 'numeric';
        inputEl.pattern = '[0-9]*';
        inputEl.value = initialVal;
        inputEl.style.fontSize = '28px';
        inputEl.style.fontWeight = '700';
        inputEl.style.fontFamily = 'Georgia, serif';
        inputEl.style.color = 'var(--text-primary, #171717)';
        inputEl.style.border = 'none';
        inputEl.style.outline = 'none';
        inputEl.style.background = 'transparent';
        inputEl.style.width = '100px';
        inputEl.style.textAlign = 'center';

        inputEl.oninput = (e: Event) => {
          const val = (e.target as HTMLInputElement).value;
          if (!(window as any).__KEEP_STATE__) (window as any).__KEEP_STATE__ = {};
          (window as any).__KEEP_STATE__.userAge = val;
        };

        dEl.appendChild(inputEl);
      });

      const buttons = wrapper.querySelectorAll('button, .opt, [role="button"]');
      buttons.forEach((btn) => {
        const el = btn as HTMLElement;
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.removeAttribute('disabled');

        if (el.getAttribute('data-keep-bound') === 'true') return;
        el.setAttribute('data-keep-bound', 'true');

        const handleAction = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();

          const btnText = (el.textContent || '').toLowerCase().trim();

          // 1. Next / Continue / Audit / Risk Buttons -> Navigate to next slide immediately
          if (
            el.classList.contains('i-3') ||
            el.classList.contains('seq3') ||
            el.classList.contains('seq4') ||
            btnText.includes('next') ||
            btnText.includes('continue') ||
            btnText.includes('analyze') ||
            btnText.includes('audit') ||
            btnText.includes('risk') ||
            btnText.includes('let\'s find out') ||
            btnText.includes('build defensive') ||
            btnText.includes('patch the firewall') ||
            btnText.includes('optimize my tranches')
          ) {
            window.dispatchEvent(new CustomEvent('keep-navigate-next'));
            return;
          }

          // 2. Choice Option Buttons
          const isChoiceBtn = (
            el.classList.contains('opt') ||
            btnText === 'yes' ||
            btnText === 'no' ||
            btnText.includes('yes,') ||
            btnText.includes('no,') ||
            btnText.includes('have one') ||
            btnText.includes('pocket money') ||
            btnText.includes('no income')
          );

          if (isChoiceBtn) {
            const parent = el.parentNode;
            if (parent) {
              const siblings = parent.querySelectorAll('button, .opt');
              siblings.forEach((s) => {
                const sel = s as HTMLElement;
                sel.style.opacity = '0.5';
                sel.style.border = '1.5px solid var(--border, #E5E4DE)';
                sel.style.background = 'var(--surface-1, #F5F5F3)';
                sel.style.color = 'var(--text-secondary, #5F5E5A)';
                sel.style.fontWeight = '500';
              });
            }

            el.style.opacity = '1';
            el.style.border = '2px solid var(--text-accent, #0C447C)';
            el.style.background = 'var(--bg-accent, #E6F1FB)';
            el.style.color = 'var(--text-accent, #0C447C)';
            el.style.fontWeight = '700';

            if (!(window as any).__KEEP_STATE__) (window as any).__KEEP_STATE__ = {};
            const slideText = (wrapper.textContent || '').toLowerCase();
            const answerVal = btnText.includes('yes') ? 'Yes' : 'No';
            if (slideText.includes('health insurance') || slideText.includes('separate from your employer')) {
              (window as any).__KEEP_STATE__.corporateLeashAnswer = answerVal;
            } else if (slideText.includes('term life') || slideText.includes('cheapest for your age')) {
              (window as any).__KEEP_STATE__.earlyLockAnswer = answerVal;
            }

            const continueBtn = wrapper.querySelector('.i-3') || wrapper.querySelector('button.i-3');
            if (continueBtn) {
              (continueBtn as HTMLElement).style.opacity = '1';
              (continueBtn as HTMLElement).style.pointerEvents = 'auto';
              (continueBtn as HTMLElement).style.cursor = 'pointer';
            }
          }
        };

        el.addEventListener('click', handleAction);
        el.addEventListener('touchend', handleAction);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [html]);

  if (Platform.OS === 'web') {
    const tablerIconsCdn = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">`;

    // Exact tokens.css from the design zip files — light cream theme
    const tokensCssVars = `
      <style>
        :root {
          --surface-2: #FFFFFF;
          --surface-1: #F5F5F3;
          --border: #E5E4DE;
          --border-strong: #D3D1C7;
          --border-accent: #A9C7E8;
          --text-primary: #171717;
          --text-secondary: #5F5E5A;
          --text-muted: #888780;
          --text-accent: #0C447C;
          --text-success: #27500A;
          --text-warning: #633806;
          --text-danger: #791F1F;
          --text-pro: #3C3489;
          --bg-accent: #E6F1FB;
          --bg-success: #EAF3DE;
          --bg-warning: #FAEEDA;
          --bg-danger: #FCEBEB;
          --bg-pro: #EEEDFE;
          --fill-primary: #171717;
          --on-primary: #FFFFFF;
          --on-success: #FFFFFF;
          --on-danger: #FFFFFF;
          --on-warning: #FFFFFF;
          --radius: 10px;
          --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --font-voice: Georgia, "Times New Roman", serif;
        }

        @keyframes drift { 0% { opacity:0; transform:translateY(14px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes gearSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes strike { 0% { width:0%; } 100% { width:100%; } }
        @keyframes popIn { 0% { opacity:0; transform:scale(0.8) translateY(6px); } 100% { opacity:1; transform:scale(1) translateY(0); } }

        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        .slide-html-wrapper * { box-sizing: border-box; }
        .slide-html-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background: transparent;
          padding: 0;
          overflow-y: auto;
          font-family: var(--font-body);
        }
      </style>
    `;

    return (
      <View style={htmlStyle.container}>
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: tablerIconsCdn + tokensCssVars + `<div class="slide-html-wrapper">${html}</div>` }}
        />
      </View>
    );
  }

  return null;
}

const htmlStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 0,
    overflow: 'hidden',
  },
});

function QuizSlide({
  slide,
  quizState,
  onOptionSelect,
}: {
  slide: Slide;
  quizState: QuizState;
  onOptionSelect: (i: number) => void;
}) {
  const shakeStyle = useShake(quizState.answerState === 'wrong');
  const answered = quizState.answerState !== 'unanswered';
  const isCorrectAnswer = quizState.answerState === 'correct';

  const correctOptIdx = quizState.correctOption ?? slide.correctOption ?? 0;
  const correctOptText = Array.isArray(slide.options) ? slide.options[correctOptIdx] : '';

  return (
    <ScrollView style={q.scroll} contentContainerStyle={q.content} showsVerticalScrollIndicator={false}>

      {/* ── Knowledge Check Banner ── */}
      <View style={q.banner}>
        <Text style={q.bannerText}>🎯  KNOWLEDGE CHECK</Text>
      </View>

      {slide.question ? <Text style={q.question}>{slide.question}</Text> : null}

      <Animated.View style={[q.optionList, shakeStyle]}>
        {Array.isArray(slide.options) &&
          slide.options.map((option, i) => {
            const isSelected = quizState.selectedOption === i;
            const isCorrectOption = (quizState.correctOption !== null
              ? quizState.correctOption === i
              : slide.correctOption === i);

            let bg = 'rgba(255, 255, 255, 0.05)';
            let borderColor = 'rgba(255, 255, 255, 0.14)';
            let borderBottomColor = 'rgba(0,0,0,0.35)';
            let textColor: string = Colors.text;
            let letterBorderColor = 'rgba(255,255,255,0.18)';
            let iconText: string | null = null;
            let shadowStyle: object = {};

            if (answered) {
              if (isCorrectOption) {
                bg = Colors.correctBg;
                borderColor = Colors.correctBorder;
                borderBottomColor = Colors.emeraldDim;
                textColor = Colors.text;
                letterBorderColor = Colors.correctBorder;
                iconText = '✓ CORRECT';
                shadowStyle = { shadowColor: Colors.emerald, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } };
              } else if (isSelected) {
                bg = Colors.wrongBg;
                borderColor = Colors.wrongBorder;
                borderBottomColor = Colors.roseDim;
                textColor = Colors.text;
                letterBorderColor = Colors.wrongBorder;
                iconText = '✕ WRONG';
                shadowStyle = { shadowColor: Colors.rose, shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } };
              } else {
                bg = 'rgba(255,255,255,0.02)';
                borderColor = 'transparent';
                borderBottomColor = 'transparent';
                textColor = Colors.textFaint;
                letterBorderColor = 'rgba(255,255,255,0.08)';
              }
            } else if (isSelected) {
              bg = 'rgba(30,136,229,0.15)';
              borderColor = Colors.sapphire;
              borderBottomColor = Colors.sapphireDim;
              letterBorderColor = Colors.sapphire;
            }

            return (
              <Pressable
                key={`${slide.id}-opt-${i}`}
                style={({ pressed }) => [
                  q.option,
                  {
                    backgroundColor: bg,
                    borderColor,
                    borderBottomColor,
                    ...shadowStyle,
                    ...(Platform.OS === 'web' ? { cursor: answered ? 'default' : 'pointer' } as any : {}),
                  },
                  pressed && !answered && q.optionPressed,
                ]}
                onPress={() => { if (!answered) onOptionSelect(i); }}
              >
                <View style={[q.optionLetter, { borderColor: letterBorderColor }]}>
                  <Text style={[q.optionLetterText, { color: textColor }]}>
                    {['A', 'B', 'C', 'D'][i] ?? i + 1}
                  </Text>
                </View>

                <Text style={[q.optionText, { color: textColor }]}>{option}</Text>

                {iconText ? (
                  <Text style={[q.optionIcon, {
                    color: iconText.includes('✓') ? Colors.emerald : Colors.rose,
                  }]}>
                    {iconText}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
      </Animated.View>

      {answered ? (
        <View style={[
          q.explanationBox,
          { borderColor: isCorrectAnswer ? Colors.correctBorder : Colors.wrongBorder },
        ]}>
          <View style={[
            q.statusBanner,
            { backgroundColor: isCorrectAnswer
                ? 'rgba(0,200,83,0.18)'
                : 'rgba(255,61,113,0.20)' }
          ]}>
            <Text style={[
              q.statusBannerText,
              { color: isCorrectAnswer ? Colors.emerald : Colors.rose },
            ]}>
              {isCorrectAnswer ? '✓  RIGHT ANSWER!' : '✕  WRONG ANSWER'}
            </Text>
          </View>

          <Text style={q.reasoningTitle}>
            {isCorrectAnswer
              ? 'WHY THIS IS RIGHT:'
              : `WHY IT'S WRONG  (${['A','B','C','D'][correctOptIdx]} is correct):`}
          </Text>

          <Text style={q.explanationText}>
            {quizState.explanation || slide.explanation ||
              `Option ${['A','B','C','D'][correctOptIdx]} ("${correctOptText}") is the correct financial principle.`}
          </Text>

          <Text style={q.continueHint}>↓  Scroll down to continue</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const q = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: Space.lg, gap: 16 },

  banner: {
    backgroundColor: 'rgba(30,136,229,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(30,136,229,0.35)',
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 11,
    fontWeight: Font.extrabold,
    color: Colors.sapphire,
    letterSpacing: 1.6,
    fontFamily: 'Inter, sans-serif',
  },

  question: {
    fontSize: Font.lg,
    fontWeight: Font.bold,
    color: Colors.text,
    lineHeight: 29,
    letterSpacing: -0.2,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  optionList: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    gap: 12,
  },
  optionPressed: {
    transform: [{ translateY: 2 }],
    opacity: 0.9,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  optionLetterText: {
    fontSize: 12,
    fontWeight: Font.bold,
    fontFamily: 'Inter, sans-serif',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: Font.medium,
    fontFamily: 'Inter, sans-serif',
  },
  optionIcon: {
    fontSize: 11,
    fontWeight: Font.extrabold,
    letterSpacing: 0.4,
    fontFamily: 'Inter, sans-serif',
  },

  explanationBox: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Space.md,
    gap: 8,
    backgroundColor: 'rgba(11,14,20,0.7)',
    marginTop: Space.xs,
  },
  statusBanner: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusBannerText: {
    fontSize: 11,
    fontWeight: Font.extrabold,
    letterSpacing: 1.0,
    fontFamily: 'Inter, sans-serif',
  },
  reasoningTitle: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: Colors.textSecondary,
    letterSpacing: 1.0,
    fontFamily: 'Inter, sans-serif',
  },
  explanationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter, sans-serif',
  },
  continueHint: {
    fontSize: 11,
    color: Colors.textFaint,
    textAlign: 'center',
    marginTop: 6,
    fontFamily: 'Inter, sans-serif',
  },
});

function StorySlide({ slide, isDark }: { slide: Slide; isDark: boolean }) {
  const icon = getSlideIcon(slide.title ?? undefined, slide.type);
  const bgColor = isDark ? '#111111' : '#F5F4EE';
  const textColor = isDark ? '#FFFFFF' : '#18181B';
  const mutedColor = isDark ? 'rgba(255, 255, 255, 0.72)' : 'rgba(24, 24, 27, 0.78)';
  const chipBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 24, 27, 0.08)';
  const chipBorder = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(24, 24, 27, 0.18)';

  return (
    <View style={[story.card, { backgroundColor: bgColor }]}>
      <ScrollView
        style={story.scroll}
        contentContainerStyle={story.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[story.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}>
          <Text style={[story.chipText, { color: textColor }]}>
            LESSON SLIDE
          </Text>
        </View>

        {slide.title ? (
          <Text style={[story.title, { color: textColor }]}>{slide.title}</Text>
        ) : null}

        <View style={[story.iconContainer, { borderColor: chipBorder }]}>
          <Text style={story.iconEmoji}>{icon}</Text>
        </View>

        {slide.mediaUrl ? (
          <Image source={{ uri: slide.mediaUrl }} style={story.media} resizeMode="cover" />
        ) : null}

        {slide.body ? (
          <Text style={[story.body, { color: mutedColor }]}>{slide.body}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const story = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
  },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Space.xl,
    paddingVertical: Space.xl,
    gap: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 10,
    fontWeight: Font.bold,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 30,
    fontWeight: Font.black,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 4,
  },
  iconEmoji: {
    fontSize: 28,
  },
  media: {
    width: '100%',
    height: 170,
    borderRadius: Radius.md,
  },
  body: {
    fontSize: Font.sm,
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: Font.regular,
    maxWidth: 340,
  },
});

export function SlideRenderer({ slide, quizState, onOptionSelect }: SlideRendererProps) {
  if (slide.html) {
    return (
      <View style={r.container}>
        <HtmlSlide html={slide.html} />
      </View>
    );
  }

  if (slide.type?.toUpperCase() === 'QUIZ') {
    return (
      <View style={r.container}>
        <QuizSlide
          slide={slide}
          quizState={
            quizState ?? {
              selectedOption: null,
              answerState: 'unanswered',
              correctOption: null,
              explanation: null,
            }
          }
          onOptionSelect={onOptionSelect ?? (() => {})}
        />
      </View>
    );
  }

  const isDark = (slide.order ?? 1) % 2 === 1;

  return (
    <View style={r.container}>
      <StorySlide slide={slide} isDark={isDark} />
    </View>
  );
}

const r = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.bg,
  },
});
