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

        /* ── Screen-reader-only text: hide visually ── */
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
          font-family: var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        /* Phone container leftovers — make them fill the screen */
        .slide-html-wrapper .phone-cleaned {
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Index fund card containers — remove fixed sizing */
        .slide-html-wrapper > div[style*="justify-content:center"][style*="padding:1rem"] {
          width: 100% !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        .slide-html-wrapper > div[style*="justify-content:center"] > div[style*="border-radius:28px"],
        .slide-html-wrapper > div[style*="justify-content:center"] > div[style*="border-radius: 28px"] {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          padding: 24px 20px !important;
          flex: 1 !important;
        }

        /* Any remaining fixed-width cards */
        .slide-html-wrapper > div > div[style*="width:280px"],
        .slide-html-wrapper > div > div[style*="width:270px"],
        .slide-html-wrapper > div > div[style*="width: 280px"],
        .slide-html-wrapper > div > div[style*="width: 270px"],
        .slide-html-wrapper > div[style*="width:280px"],
        .slide-html-wrapper > div[style*="width:270px"] {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* ── Editable input field injected by JS ── */
        .keep-editable-field {
          outline: none;
          border: none;
          background: transparent;
          font-size: inherit;
          font-weight: inherit;
          font-family: inherit;
          color: inherit;
          width: 100%;
          min-width: 60px;
          text-align: inherit;
          caret-color: var(--text-accent);
        }
        .keep-editable-field:focus {
          outline: none;
        }
        .keep-input-wrapper {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--border-accent);
          border-radius: var(--radius);
          padding: 12px 16px;
          gap: 8px;
          background: white;
          transition: border-color 0.2s;
          cursor: text;
        }
        .keep-input-wrapper:focus-within {
          border-color: var(--text-accent);
          box-shadow: 0 0 0 3px rgba(12, 68, 124, 0.12);
        }
        .keep-input-prefix {
          font-size: 18px;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .keep-input-cursor {
          width: 2px;
          height: 22px;
          background: var(--text-accent);
          margin-left: 2px;
          animation: keepBlink 1s step-end infinite;
          flex-shrink: 0;
        }
        @keyframes keepBlink { 0%, 100% { opacity:1; } 50% { opacity:0; } }
        .keep-result-box {
          background: var(--bg-success);
          border: 1.5px solid var(--text-success);
          border-radius: var(--radius);
          padding: 14px 16px;
          margin-top: 12px;
          animation: popIn 0.35s ease both;
        }
        .keep-result-box .keep-result-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-success);
          letter-spacing: 0.8px;
          margin-bottom: 6px;
        }
        .keep-result-box .keep-result-val {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .keep-result-box .keep-result-sub {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
          line-height: 1.5;
        }
        .keep-btn-active {
          opacity: 1 !important;
          cursor: pointer !important;
        }
      </style>
    `;

    // ── Interactive JS injected into every HTML slide ──────────────────────────
    // Detects static "faux-input" display spans and replaces them with real
    // editable fields. Also activates buttons to compute live results.
    const interactiveJS = `
      <script>
      (function() {
        // Run after DOM is ready
        function activateSlide() {
          var wrapper = document.querySelector('.slide-html-wrapper');
          if (!wrapper) return;

          // ── 1. Find bordered "display value" containers and make them editable ──
          // These are divs/spans styled with border that contain a numeric <span>
          // Pattern: a container div with border-accent style containing a large font-size span
          var allDivs = wrapper.querySelectorAll('div');
          allDivs.forEach(function(div) {
            var style = div.getAttribute('style') || '';
            // Match containers that look like input field wrappers
            var looksLikeInputWrapper = (
              (style.includes('border') && (style.includes('border-accent') || style.includes('A9C7E8'))) ||
              (style.includes('border') && style.includes('border-radius') && style.includes('padding'))
            );
            if (!looksLikeInputWrapper) return;
            if (div.classList.contains('keep-activated')) return;

            // Find the value span — typically the largest font-size span inside
            var spans = div.querySelectorAll('span');
            var valueSpan = null;
            var prefixSpan = null;
            var cursorSpan = null;

            spans.forEach(function(sp) {
              var spStyle = sp.getAttribute('style') || '';
              var spText = (sp.textContent || '').trim();
              // Currency / prefix spans: single char or currency symbol
              if (spText.length <= 2 && (spText.match(/[₹$€£¥]/) || spText === '')) {
                prefixSpan = sp;
                return;
              }
              // Cursor spans: thin 2px wide
              if (spStyle.includes('width:2px') || spStyle.includes('width: 2px')) {
                cursorSpan = sp;
                return;
              }
              // Value span: contains a number
              if (/[0-9]/.test(spText) && (spStyle.includes('font-size') || spText.length > 0)) {
                valueSpan = sp;
              }
            });

            if (!valueSpan) return;

            div.classList.add('keep-activated');

            // Extract existing value
            var rawVal = (valueSpan.textContent || '').replace(/,/g, '').trim();
            var prefix = prefixSpan ? (prefixSpan.textContent || '').trim() : '';

            // Build editable replacement
            var wrapper2 = document.createElement('div');
            wrapper2.className = 'keep-input-wrapper';

            if (prefix) {
              var prefixEl = document.createElement('span');
              prefixEl.className = 'keep-input-prefix';
              prefixEl.textContent = prefix;
              wrapper2.appendChild(prefixEl);
            }

            var input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.pattern = '[0-9,]*';
            input.className = 'keep-editable-field';
            input.value = rawVal;
            input.setAttribute('data-raw', rawVal);
            input.style.fontSize = '24px';
            input.style.fontWeight = '700';
            wrapper2.appendChild(input);

            // Format on blur, raw on focus
            input.addEventListener('focus', function() {
              this.value = this.getAttribute('data-raw') || this.value.replace(/,/g,'');
              wrapper2.style.borderColor = 'var(--text-accent)';
            });
            input.addEventListener('blur', function() {
              var n = parseFloat(this.value.replace(/,/g,''));
              if (!isNaN(n)) {
                this.setAttribute('data-raw', String(n));
                this.value = n.toLocaleString('en-IN');
              }
              wrapper2.style.borderColor = 'var(--border-accent)';
            });
            input.addEventListener('input', function() {
              var clean = this.value.replace(/[^0-9.]/g,'');
              this.setAttribute('data-raw', clean);
              this.value = clean;
            });

            // Replace the container
            div.style.border = 'none';
            div.style.padding = '0';
            div.style.background = 'transparent';
            // Clear children and put our wrapper
            while (div.firstChild) div.removeChild(div.firstChild);
            div.appendChild(wrapper2);
          });

          // Ensure all buttons are clickable and visible
          var buttons = wrapper.querySelectorAll('button, .opt, [role="button"]');
          buttons.forEach(function(btn) {
            (btn as HTMLElement).style.pointerEvents = 'auto';
            (btn as HTMLElement).style.cursor = 'pointer';
            (btn as HTMLElement).removeAttribute('disabled');
          });

          // ── 2. Activate buttons to compute results & navigate ──
          buttons.forEach(function(btn) {
            if (btn.classList.contains('keep-btn-activated')) return;
            btn.classList.add('keep-btn-activated', 'keep-btn-active');

            var handleBtnAction = function(e: Event) {
              e.preventDefault();
              e.stopPropagation();

              var btnText = (btn.textContent || '').toLowerCase().trim();

              // 1. Next / Continue / Audit Buttons
              if (
                btn.classList.contains('i-3') ||
                btn.classList.contains('seq3') ||
                btn.classList.contains('seq4') ||
                btnText.includes('next') ||
                btnText.includes('continue') ||
                btnText.includes('analyze my exposure') ||
                btnText.includes('run my risk audit') ||
                btnText.includes('let\'s find out') ||
                btnText.includes('build defensive') ||
                btnText.includes('patch the firewall') ||
                btnText.includes('optimize my tranches')
              ) {
                // Dispatch next slide navigation event
                window.dispatchEvent(new CustomEvent('keep-navigate-next'));
                return;
              }

              // 2. Choice Option Buttons (Screen 12/13 Yes/No, Credit Card Branching options)
              var isChoiceBtn = (
                btn.classList.contains('opt') ||
                btnText === 'yes' ||
                btnText === 'no' ||
                btnText.includes('yes,') ||
                btnText.includes('no,') ||
                btnText.includes('have one') ||
                btnText.includes('pocket money') ||
                btnText.includes('no income')
              );

              if (isChoiceBtn) {
                var parent = btn.parentNode;
                if (parent) {
                  var siblings = parent.querySelectorAll('button, .opt');
                  siblings.forEach(function(s) {
                    (s as HTMLElement).style.opacity = '0.5';
                    (s as HTMLElement).style.border = '1.5px solid var(--border, #E5E4DE)';
                    (s as HTMLElement).style.background = 'var(--surface-1, #F5F5F3)';
                    (s as HTMLElement).style.color = 'var(--text-secondary, #5F5E5A)';
                    (s as HTMLElement).style.fontWeight = '500';
                  });
                }

                (btn as HTMLElement).style.opacity = '1';
                (btn as HTMLElement).style.border = '2px solid var(--text-accent, #0C447C)';
                (btn as HTMLElement).style.background = 'var(--bg-accent, #E6F1FB)';
                (btn as HTMLElement).style.color = 'var(--text-accent, #0C447C)';
                (btn as HTMLElement).style.fontWeight = '700';

                // Save choice to global state
                if (!(window as any).__KEEP_STATE__) (window as any).__KEEP_STATE__ = {};
                var slideText = (wrapper.textContent || '').toLowerCase();
                var answerVal = btnText.includes('yes') ? 'Yes' : 'No';
                if (slideText.includes('health insurance') || slideText.includes('separate from your employer')) {
                  (window as any).__KEEP_STATE__.corporateLeashAnswer = answerVal;
                } else if (slideText.includes('term life') || slideText.includes('cheapest for your age')) {
                  (window as any).__KEEP_STATE__.earlyLockAnswer = answerVal;
                }

                // Enable Continue/Next button (.i-3) if present
                var continueBtn = wrapper.querySelector('.i-3') || wrapper.querySelector('button.i-3');
                if (continueBtn) {
                  (continueBtn as HTMLElement).style.opacity = '1';
                  (continueBtn as HTMLElement).style.pointerEvents = 'auto';
                  (continueBtn as HTMLElement).style.cursor = 'pointer';
                }

                // Remove existing result box if any
                var existing = wrapper.querySelector('.keep-result-box');
                if (existing) existing.remove();

                var resultBox = document.createElement('div');
                resultBox.className = 'keep-result-box';
                var title = document.createElement('div');
                title.className = 'keep-result-title';
                var resultVal = document.createElement('div');
                resultVal.className = 'keep-result-val';
                var resultSub = document.createElement('div');
                resultSub.className = 'keep-result-sub';

                title.textContent = '👍 CHOICE RECORDED';
                resultVal.textContent = (btn.textContent || '').trim();
                resultSub.textContent = 'Whatever you pick, there\'s a real answer for you next. Click Next to continue.';
                resultBox.appendChild(title);
                resultBox.appendChild(resultVal);
                resultBox.appendChild(resultSub);
                btn.parentNode.insertBefore(resultBox, btn.nextSibling);
                resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
              }

              if (btnText.includes('utilisation') || btnText.includes('calculate') || btnText.includes('number')) {
                // Credit limit utilisation: 30% rule
                var thirtyPct = Math.round(val1 * 0.30);
                title.textContent = '✅ YOUR SAFE SPENDING LIMIT';
                resultVal.textContent = '₹' + thirtyPct.toLocaleString('en-IN');
                resultSub.textContent = 'Keep your monthly spend below this (30% of ₹' + val1.toLocaleString('en-IN') + ') to protect your credit score. Going above 30% hurts your CIBIL score.';
              } else if (btnText.includes('next') || btnText.includes('age') || val1 > 0) {
                // Age → retirement wealth projection
                var yearsLeft = Math.max(0, 60 - val1);
                var monthlyAmount = 5000;
                var annualReturn = 0.12;
                var months = yearsLeft * 12;
                var corpus = monthlyAmount * ((Math.pow(1 + annualReturn/12, months) - 1) / (annualReturn/12));
                title.textContent = '📈 IF YOU START SIP TODAY AT AGE ' + Math.round(val1);
                resultVal.textContent = '₹' + Math.round(corpus/100000).toLocaleString('en-IN') + ' Lakh';
                resultSub.textContent = 'Investing just ₹5,000/month in a NIFTY 50 index fund at ~12% CAGR until age 60 gives you this corpus. Starting earlier is the biggest advantage.';
              } else if (btnText.includes('save') || btnText.includes('invest')) {
                var monthlyInvest = val1;
                var years = val2 || 10;
                var fv = monthlyInvest * ((Math.pow(1.01, years * 12) - 1) / 0.01);
                title.textContent = '📊 PROJECTED CORPUS IN ' + Math.round(years) + ' YEARS';
                resultVal.textContent = '₹' + Math.round(fv / 100000).toLocaleString('en-IN') + ' Lakh';
                resultSub.textContent = 'At 12% annual returns, investing ₹' + monthlyInvest.toLocaleString('en-IN') + '/month grows to this amount in ' + Math.round(years) + ' years through compounding.';
              } else if (btnText.includes('both sides') || btnText.includes('rent')) {
                var rent = val1 || 25000;
                var home = val2 || 10000000;
                var emi = Math.round((home * 0.8) * 0.0085 * (Math.pow(1.0085, 240) / (Math.pow(1.0085, 240) - 1)));
                title.textContent = '⚖️ RENT VS. BUY';
                resultVal.textContent = 'Rent: ₹' + rent.toLocaleString('en-IN') + ' vs EMI: ₹' + emi.toLocaleString('en-IN');
                resultSub.textContent = 'Buying a ₹' + (home/100000).toLocaleString('en-IN') + 'L home requires ~₹' + ((home*0.2)/100000).toLocaleString('en-IN') + 'L upfront and an EMI of ~₹' + emi.toLocaleString('en-IN') + '/month for 20 years.';
              } else if (btnText.includes('audit') || btnText.includes('exposure') || btnText.includes('shield') || btnText.includes('analyze')) {
                title.textContent = '🛡️ RISK AUDIT RESULT';
                resultVal.textContent = 'Personal Firewall Gap Detected';
                resultSub.textContent = 'Relying only on employer insurance leaves you exposed when changing jobs. A personal health and term policy keeps your investment tranches safe.';
              } else {
                // Generic: show what was entered
                title.textContent = '✅ GOT IT!';
                resultVal.textContent = (values.map(function(v) { return '₹' + v.toLocaleString('en-IN'); }).join('  ·  ')) || 'Saved';
                resultSub.textContent = 'Your number has been noted. Scroll down to continue the lesson.';
              }

              resultBox.appendChild(title);
              resultBox.appendChild(resultVal);
              resultBox.appendChild(resultSub);

              resultBox.appendChild(title);
              resultBox.appendChild(resultVal);
              resultBox.appendChild(resultSub);

              // Insert result after the button
              btn.parentNode.insertBefore(resultBox, btn.nextSibling);
              resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            };

            btn.addEventListener('click', handleBtnAction);
            btn.addEventListener('touchend', handleBtnAction);
          });
        }

        // Run immediately + after short delay (for animated slides)
        activateSlide();
        setTimeout(activateSlide, 400);
        setTimeout(activateSlide, 800);
      })();
      </script>
    `;

    const wrappedHtml = `<div class="slide-html-wrapper">${html}</div>${interactiveJS}`;

    return (
      <View style={htmlStyle.container}>
        <div
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: tablerIconsCdn + tokensCssVars + wrappedHtml }}
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

      {/* ── Knowledge Check Banner (full-width gradient, Duolingo-inspired) ── */}
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

            // ── Colour logic: emerald correct, rose wrong ──
            let bg = 'rgba(255, 255, 255, 0.05)';
            let borderColor = 'rgba(255, 255, 255, 0.14)';
            let borderBottomColor = 'rgba(0,0,0,0.35)';
            let textColor: string = Colors.text;
            let letterBorderColor = 'rgba(255,255,255,0.18)';
            let iconText: string | null = null;
            let shadowStyle: object = {};

            if (answered) {
              if (isCorrectOption) {
                // ✅ Emerald correct
                bg = Colors.correctBg;
                borderColor = Colors.correctBorder;
                borderBottomColor = Colors.emeraldDim;
                textColor = Colors.text;
                letterBorderColor = Colors.correctBorder;
                iconText = '✓ CORRECT';
                shadowStyle = { shadowColor: Colors.emerald, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } };
              } else if (isSelected) {
                // ❌ Rose wrong
                bg = Colors.wrongBg;
                borderColor = Colors.wrongBorder;
                borderBottomColor = Colors.roseDim;
                textColor = Colors.text;
                letterBorderColor = Colors.wrongBorder;
                iconText = '✕ WRONG';
                shadowStyle = { shadowColor: Colors.rose, shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } };
              } else {
                // Dimmed unselected
                bg = 'rgba(255,255,255,0.02)';
                borderColor = 'transparent';
                borderBottomColor = 'transparent';
                textColor = Colors.textFaint;
                letterBorderColor = 'rgba(255,255,255,0.08)';
              }
            } else if (isSelected) {
              // Pre-answer selected state
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
                {/* Letter badge */}
                <View style={[q.optionLetter, { borderColor: letterBorderColor }]}>
                  <Text style={[q.optionLetterText, { color: textColor }]}>
                    {['A', 'B', 'C', 'D'][i] ?? i + 1}
                  </Text>
                </View>

                {/* Option text — 16px Inter Medium */}
                <Text style={[q.optionText, { color: textColor }]}>{option}</Text>

                {/* Result icon */}
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

      {/* ── Explanation box ── */}
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

  // ── Full-width Knowledge Check banner ──
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

  // ── Question ──
  question: {
    fontSize: Font.lg,          // 20px (up from 22, tighter)
    fontWeight: Font.bold,
    color: Colors.text,
    lineHeight: 29,
    letterSpacing: -0.2,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  // ── Options list ──
  optionList: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,             // Duolingo standard tap target
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderBottomWidth: 3,      // 3D depth bottom border
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
    fontSize: 16,              // 16px — Duolingo standard (up from 13.5)
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

  // ── Explanation box ──
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
