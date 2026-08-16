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

      // --- Convert static display boxes to interactive input elements (ONLY ON INPUT SLIDES) ---
      const isInputSlide = activeSlide?.slide_id === 'idx-s10-pivot' || activeSlide?.slide_id === 'idx-s11-age';
      if (isInputSlide) {
        const staticBox = wrapper.querySelector('.s2, div[style*="border"]');
        if (staticBox && !staticBox.querySelector('input')) {
          const span = staticBox.querySelector('span');
          const defaultVal = span ? span.textContent?.replace(/[^0-9]/g, '') : '';
          const initialVal = defaultVal || (activeSlide?.slide_id === 'idx-s10-pivot' ? '24' : '5000');

          staticBox.innerHTML = '';
          (staticBox as HTMLElement).style.display = 'flex';
          (staticBox as HTMLElement).style.alignItems = 'center';
          (staticBox as HTMLElement).style.justifyContent = 'center';

          const inp = document.createElement('input');
          inp.type = 'number';
          inp.inputMode = 'numeric';
          inp.value = initialVal;
          inp.style.fontSize = '28px';
          inp.style.fontWeight = '700';
          inp.style.fontFamily = 'Georgia, serif';
          inp.style.border = 'none';
          inp.style.outline = 'none';
          inp.style.background = 'transparent';
          inp.style.textAlign = 'center';
          inp.style.width = '120px';
          inp.style.color = 'var(--text-primary, #171717)';

          staticBox.appendChild(inp);
        }
      }

      // --- Screen 11: Age Input (Slide index 11, slide_id idx-s10-pivot) ---
      if (activeSlide?.slide_id === 'idx-s10-pivot') {
        const input = wrapper.querySelector('input') as HTMLInputElement;
        const continueBtn = wrapper.querySelector('button') as HTMLButtonElement;

        if (input && !userAge) {
          const num = parseFloat(input.value);
          if (!isNaN(num)) setUserAge(num);
        }

        if (input) {
          input.oninput = (e) => {
            const target = e.target as HTMLInputElement;
            const num = parseFloat(target.value);
            if (!isNaN(num)) setUserAge(num);
          };
        }

        if (continueBtn) {
          continueBtn.style.opacity = '1';
          continueBtn.style.pointerEvents = 'auto';
          continueBtn.style.cursor = 'pointer';
          continueBtn.onclick = (e) => {
            e.preventDefault();
            goToNext();
          };
        }
      }

      // --- Screen 12: Contribution Input (Slide index 12, slide_id idx-s11-age) ---
      if (activeSlide?.slide_id === 'idx-s11-age') {
        const input = wrapper.querySelector('input') as HTMLInputElement;
        const continueBtn = wrapper.querySelector('button') as HTMLButtonElement;
        const dontKnowBtn = wrapper.querySelector('.dont-know, button:nth-of-type(2)') as HTMLButtonElement;

        if (input && !userContribution) {
          const num = parseFloat(input.value);
          if (!isNaN(num)) setUserContribution(num);
        }

        if (input) {
          input.oninput = (e) => {
            const target = e.target as HTMLInputElement;
            const num = parseFloat(target.value);
            if (!isNaN(num)) setUserContribution(num);
          };
        }

        if (continueBtn) {
          continueBtn.style.opacity = '1';
          continueBtn.style.pointerEvents = 'auto';
          continueBtn.style.cursor = 'pointer';
          continueBtn.onclick = (e) => {
            e.preventDefault();
            goToNext();
          };
        }

        if (dontKnowBtn) {
          dontKnowBtn.onclick = (e) => {
            e.preventDefault();
            triggerDontKnowFallback();
          };
        }
      }

      // --- Dynamic calculation & text updating across timeline & reveal slides (connected to userAge) ---
      const ageVal = userAge && userAge > 0 && userAge < 100 ? userAge : 20;
      const monthlyVal = userContribution && userContribution > 0 ? userContribution : 5000;

      // Sync to window.__KEEP_STATE__ for unified engine access
      if (!(window as any).__KEEP_STATE__) (window as any).__KEEP_STATE__ = {};
      (window as any).__KEEP_STATE__.userAge = ageVal;
      (window as any).__KEEP_STATE__.userContribution = monthlyVal;

      const targetAgeVal = ageVal + 20;
      const yearsVal = 20;
      const monthsVal = yearsVal * 12;

      const rate = 0.12 / 12; // 12% annual return on Nifty 50
      const fvVal = monthlyVal * ((Math.pow(1 + rate, monthsVal) - 1) / rate) * (1 + rate);
      const investedVal = monthlyVal * monthsVal;
      const gainedVal = fvVal - investedVal;

      const formatLakhs = (val: number) => {
        if (val >= 10000000) {
          return `₹${(val / 10000000).toFixed(2)} Cr`;
        } else if (val >= 100000) {
          return `₹${(val / 100000).toFixed(1)} Lakhs`;
        } else {
          return `₹${Math.round(val).toLocaleString('en-IN')}`;
        }
      };

      const formattedInvested = formatLakhs(investedVal);
      const formattedProjected = formatLakhs(fvVal);
      const formattedReturns = formatLakhs(gainedVal);
      const formattedMonthly = `₹${monthlyVal.toLocaleString('en-IN')}`;
      const multVal = (fvVal / investedVal).toFixed(1);

      // 1. Screen 13: Timeline & Meaningful Pie Chart (idx-s13-timeline)
      if (activeSlide?.slide_id === 'idx-s13-timeline') {
        const titleEl = wrapper.querySelector('#s13-title');
        if (titleEl) titleEl.textContent = `Let's project your savings from age ${ageVal} to ${targetAgeVal}.`;

        const subEl = wrapper.querySelector('#s13-sub');
        if (subEl) subEl.textContent = `20 years of compounding @ 12% p.a. (${formattedMonthly}/mo)`;

        const assumpEl = wrapper.querySelector('#s13-assumption');
        if (assumpEl) assumpEl.textContent = `⚡ Assuming 12% Annual Interest Rate on ${formattedMonthly}/month`;

        const multEl = wrapper.querySelector('#s13-mult');
        if (multEl) multEl.textContent = `${multVal}x`;

        const yearsEl = wrapper.querySelector('#s13-years');
        if (yearsEl) yearsEl.textContent = `20 Years`;

        const startAgeEl = wrapper.querySelector('#s13-start-age');
        if (startAgeEl) startAgeEl.textContent = `Age ${ageVal}`;

        const endAgeEl = wrapper.querySelector('#s13-end-age');
        if (endAgeEl) endAgeEl.textContent = `Age ${targetAgeVal}`;

        const invEl = wrapper.querySelector('#s13-invested');
        if (invEl) invEl.textContent = formattedInvested;

        const retEl = wrapper.querySelector('#s13-returns');
        if (retEl) retEl.textContent = `+${formattedReturns}`;

        const targetLbl = wrapper.querySelector('#s13-target-age-lbl');
        if (targetLbl) targetLbl.textContent = `${targetAgeVal}`;

        const totEl = wrapper.querySelector('#s13-total');
        if (totEl) totEl.textContent = formattedProjected;

        // Dynamic Pie SVG Slice Arc adjustment
        const returnsCircle = wrapper.querySelector('.donut-returns');
        if (returnsCircle) {
          const returnsRatio = gainedVal / fvVal; // e.g. ~0.76
          const arcLength = Math.round(returnsRatio * 238); // 238 is approx 95% arc
          (returnsCircle as HTMLElement).style.strokeDasharray = `${arcLength} 251`;
        }
      }

      // General CTA buttons handler
      const ctaBtn = wrapper.querySelector('button') as HTMLButtonElement;
      if (ctaBtn && activeSlide?.slide_id !== 'idx-s10-pivot' && activeSlide?.slide_id !== 'idx-s11-age') {
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
