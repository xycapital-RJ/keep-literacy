import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import { useIndexFundsState } from './IndexFundsStateController';
import indexFundsData from '../../data/indexFundsModule.json';
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
</style>
`;

const DONT_KNOW_FALLBACK_HTML = `
<div style="width:100%; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; text-align:center; background:#171717; color:#FFFFFF; padding:24px; border-radius:20px; box-sizing:border-box;">
  <i class="ti ti-help-circle" style="font-size:54px; color:var(--border-accent);" aria-hidden="true"></i>
  <p style="font-size:20px; font-weight:600; margin:0; line-height:1.4;">Not sure of your exact number?</p>
  <p style="font-size:14px; color:rgba(255,255,255,0.75); margin:0; max-width:260px; line-height:1.6;">That's completely fine. Most beginners start with a baseline SIP of ₹1,000/month or ₹5,000/month. You can adjust this anytime.</p>
  <button id="fallback-continue-btn" style="width:100%; height:48px; border-radius:var(--radius); background:var(--surface-2); color:var(--text-primary); border:none; font-size:14px; font-weight:600; cursor:pointer; margin-top:12px;">Use Baseline ₹2,500/mo →</button>
</div>
`;

export function IndexFundsModuleViewer() {
  const {
    activeScreenIndex,
    totalScreens,
    userAge,
    userContribution,
    showDontKnowFallback,
    goToNext,
    goToPrev,
    setUserAge,
    setUserContribution,
    triggerDontKnowFallback,
    dismissDontKnowFallback,
  } = useIndexFundsState();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeSlide = indexFundsData.slides[activeScreenIndex];
  const slideHtml = showDontKnowFallback ? DONT_KNOW_FALLBACK_HTML : activeSlide?.html || '';

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const wrapper = document.querySelector('.slide-html-wrapper');
      if (!wrapper) return;

      if (showDontKnowFallback) {
        const fallBtn = wrapper.querySelector('#fallback-continue-btn') as HTMLButtonElement;
        if (fallBtn) {
          fallBtn.onclick = (e) => {
            e.preventDefault();
            setUserContribution(2500);
            dismissDontKnowFallback();
          };
        }
        return;
      }

      // General CTA buttons handler for story slides
      const ctaBtn = wrapper.querySelector('button') as HTMLButtonElement;
      if (ctaBtn) {
        ctaBtn.onclick = (e) => {
          e.preventDefault();
          goToNext();
        };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeScreenIndex, showDontKnowFallback, userAge, userContribution]);

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
          style={[s.navBtn, activeScreenIndex === 0 && !showDontKnowFallback && s.navBtnDisabled]}
          disabled={activeScreenIndex === 0 && !showDontKnowFallback}
          onPress={goToPrev}
        >
          <Text style={s.navBtnText}>← Previous</Text>
        </Pressable>

        <View style={s.progressContainer}>
          <Text style={s.progressText}>
            {showDontKnowFallback
              ? 'Fallback Guidance'
              : `Screen ${activeScreenIndex + 1} of ${totalScreens}`}
          </Text>
          <View style={s.progressBarTrack}>
            <View
              style={[
                s.progressBarFill,
                { width: showDontKnowFallback ? '75%' : `${((activeScreenIndex + 1) / totalScreens) * 100}%` },
              ]}
            />
          </View>
        </View>

        <Pressable
          style={[
            s.navBtn,
            (activeScreenIndex === totalScreens - 1 && !showDontKnowFallback) ||
            (activeSlide?.slide_id === 'idx-s11-age' && (!userAge || userAge <= 0)) ||
            (activeSlide?.slide_id === 'idx-s12-contribution' && (!userContribution || userContribution <= 0))
              ? s.navBtnDisabled
              : null,
          ]}
          disabled={
            (activeScreenIndex === totalScreens - 1 && !showDontKnowFallback) ||
            (activeSlide?.slide_id === 'idx-s11-age' && (!userAge || userAge <= 0)) ||
            (activeSlide?.slide_id === 'idx-s12-contribution' && (!userContribution || userContribution <= 0))
          }
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
