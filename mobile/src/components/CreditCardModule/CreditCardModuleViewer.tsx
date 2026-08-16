import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import { useCreditCardState } from './CreditCardStateController';
import creditCardData from '../../data/creditCardModule.json';
import { Font, Radius, Space } from '../../theme';

const TABLER_ICONS_CDN = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">`;

const TOKENS_CSS = `
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
    --radius: 10px;
    --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --font-voice: Georgia, "Times New Roman", serif;
  }

  .sr-only, .statusbar { display: none !important; }
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

  .opt-selected {
    border: 2px solid var(--text-accent, #0C447C) !important;
    background: var(--bg-accent, #E6F1FB) !important;
    color: var(--text-accent, #0C447C) !important;
    font-weight: 700 !important;
    opacity: 1 !important;
  }
  .opt-dimmed {
    border: 0.5px solid var(--border, #E5E4DE) !important;
    background: var(--surface-1, #F5F5F3) !important;
    color: var(--text-secondary, #5F5E5A) !important;
    opacity: 0.5 !important;
  }
</style>
`;

export function CreditCardModuleViewer() {
  const {
    activeScreenIndex,
    totalSequenceScreens,
    selectedBranch,
    goToNext,
    goToPrev,
    selectBranch,
    setUserCreditLimit,
  } = useCreditCardState();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Map active screen or branch to slide in JSON
  const getActiveSlideHtml = () => {
    if (selectedBranch) {
      const branchSlideIdMap: Record<string, string> = {
        '10a-no-income': 'cc-s10a-no-income',
        '10b-yes-input': 'cc-s10b-yes-input',
        '10c-no-card-yet': 'cc-s10c-no-card-yet',
      };
      const targetId = branchSlideIdMap[selectedBranch];
      const found = creditCardData.slides.find((s: any) => s.slide_id === targetId);
      return found?.html || '';
    }

    // Sequence screens map (Screen 1 to 11 in main sequence)
    const seqSlideIdMap = [
      'cc-s1a-script',
      'cc-s1b-ad-crack',
      'cc-s2-ghost',
      'cc-s3-trust',
      'cc-s4-debit-math',
      'cc-s5-shield',
      'cc-s6-borrowed-time',
      'cc-s7-two-users',
      'cc-s8-goal',
      'cc-s9-pivot',
      'cc-s10-branch',
    ];

    const targetId = seqSlideIdMap[activeScreenIndex];
    const found = creditCardData.slides.find((s: any) => s.slide_id === targetId);
    return found?.html || creditCardData.slides[activeScreenIndex]?.html || '';
  };

  const slideHtml = getActiveSlideHtml();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const wrapper = document.querySelector('.slide-html-wrapper');
      if (!wrapper) return;

      // --- Screen 10 Branching Setup ---
      if (activeScreenIndex === 10 && !selectedBranch) {
        const options = wrapper.querySelectorAll('.opt, button');
        if (options.length >= 3) {
          const optYes = options[0] as HTMLButtonElement;      // Yes, I have one -> 10b
          const optIncome = options[1] as HTMLButtonElement;   // No, but I have income -> 10c
          const optNoIncome = options[2] as HTMLButtonElement; // No, and I don't have income -> 10a

          optYes.onclick = (e) => {
            e.preventDefault();
            optYes.className = 'opt opt-selected';
            optIncome.className = 'opt opt-dimmed';
            optNoIncome.className = 'opt opt-dimmed';
            setTimeout(() => selectBranch('10b-yes-input'), 300);
          };

          optIncome.onclick = (e) => {
            e.preventDefault();
            optIncome.className = 'opt opt-selected';
            optYes.className = 'opt opt-dimmed';
            optNoIncome.className = 'opt opt-dimmed';
            setTimeout(() => selectBranch('10c-no-card-yet'), 300);
          };

          optNoIncome.onclick = (e) => {
            e.preventDefault();
            optNoIncome.className = 'opt opt-selected';
            optYes.className = 'opt opt-dimmed';
            optIncome.className = 'opt opt-dimmed';
            setTimeout(() => selectBranch('10a-no-income'), 300);
          };
        }
      }

      // --- Screen 10B (Credit Limit Input) ---
      if (selectedBranch === '10b-yes-input') {
        const calcBtn = wrapper.querySelector('button') as HTMLButtonElement;
        const input = wrapper.querySelector('input') as HTMLInputElement;

        if (calcBtn) {
          calcBtn.onclick = (e) => {
            e.preventDefault();
            if (input && input.value) {
              const val = parseFloat(input.value.replace(/,/g, ''));
              if (!isNaN(val)) setUserCreditLimit(val);
            }
          };
        }
      }

      // General CTA buttons handler
      const ctaBtn = wrapper.querySelector('button.cta, button') as HTMLButtonElement;
      if (ctaBtn && activeScreenIndex < 10 && !selectedBranch) {
        ctaBtn.onclick = (e) => {
          e.preventDefault();
          goToNext();
        };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeScreenIndex, selectedBranch]);

  if (!slideHtml) {
    return (
      <View style={s.centerContainer}>
        <Text style={s.errorText}>Slide content unavailable.</Text>
      </View>
    );
  }

  const wrappedHtml = `<div class="slide-html-wrapper">${slideHtml}</div>`;

  return (
    <View style={s.root}>
      <View style={s.canvas}>
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          dangerouslySetInnerHTML={{ __html: TABLER_ICONS_CDN + TOKENS_CSS + wrappedHtml }}
        />
      </View>

      <View style={s.navBar}>
        <Pressable
          style={[s.navBtn, activeScreenIndex === 0 && !selectedBranch && s.navBtnDisabled]}
          disabled={activeScreenIndex === 0 && !selectedBranch}
          onPress={goToPrev}
        >
          <Text style={s.navBtnText}>← Previous</Text>
        </Pressable>

        <View style={s.progressContainer}>
          <Text style={s.progressText}>
            {selectedBranch
              ? `Branch: ${selectedBranch.replace('10', 'Screen 10')}`
              : `Screen ${activeScreenIndex + 1} of ${totalSequenceScreens}`}
          </Text>
          <View style={s.progressBarTrack}>
            <View
              style={[
                s.progressBarFill,
                { width: selectedBranch ? '100%' : `${((activeScreenIndex + 1) / totalSequenceScreens) * 100}%` },
              ]}
            />
          </View>
        </View>

        <Pressable
          style={[s.navBtn, activeScreenIndex === 10 && !selectedBranch && s.navBtnDisabled]}
          disabled={activeScreenIndex === 10 && !selectedBranch}
          onPress={goToNext}
        >
          <Text style={s.navBtnText}>Next →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0E14' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0E14' },
  errorText: { color: '#FFFFFF', fontSize: Font.base },
  canvas: { flex: 1, width: '100%' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: 12,
    backgroundColor: '#171717',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF', borderRadius: Radius.md },
  navBtnDisabled: { opacity: 0.35 },
  navBtnText: { color: '#171717', fontWeight: Font.bold, fontSize: Font.sm },
  progressContainer: { alignItems: 'center', flex: 1, paddingHorizontal: 12 },
  progressText: { color: '#888780', fontSize: Font.xs, fontWeight: Font.semibold, marginBottom: 4 },
  progressBarTrack: { height: 4, width: '100%', maxWidth: 160, backgroundColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#00C853', borderRadius: 2 },
});
