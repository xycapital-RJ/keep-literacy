import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import { useInsuranceState } from './InsuranceStateController';
import insuranceData from '../../data/insuranceModule.json';
import { Font, Radius, Space } from '../../theme';

const TABLER_ICONS_CDN = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">`;

const RAW_TOKENS_CSS = `
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

  .sr-only, .statusbar {
    display: none !important;
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

  .keep-btn-selected {
    border: 2px solid var(--text-accent, #0C447C) !important;
    background: var(--bg-accent, #E6F1FB) !important;
    color: var(--text-accent, #0C447C) !important;
    font-weight: 700 !important;
    opacity: 1 !important;
  }
  .keep-btn-dimmed {
    border: 1.5px solid var(--border, #E5E4DE) !important;
    background: var(--surface-1, #F5F5F3) !important;
    color: var(--text-secondary, #5F5E5A) !important;
    opacity: 0.5 !important;
  }
</style>
`;

export function InsuranceModuleViewer() {
  const {
    activeScreenIndex,
    totalScreens,
    corporateLeashAnswer,
    earlyLockAnswer,
    showProtectionStatusSlide,
    goToNext,
    goToPrev,
    setCorporateLeashAnswer,
    setEarlyLockAnswer,
    dismissProtectionStatusSlide,
    recordQuizScore,
  } = useInsuranceState();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Protection Status Slide Generator (Post-Screen 13)
  const getProtectionStatusSlideHtml = () => {
    const isCorpYes = corporateLeashAnswer === 'Yes';
    const isEarlyYes = earlyLockAnswer === 'Yes';

    let heading = '';
    let body = '';
    let buttonText = '';
    let badgeText = '';
    let bgBadge = 'var(--bg-danger)';
    let colorBadge = 'var(--text-danger)';
    let iconColor = 'var(--border-strong)';
    let crackSvg = '';

    if (isCorpYes && isEarlyYes) {
      // Case A (Yes / Yes)
      heading = 'Your Protection Matrix: Strong Foundation';
      body = 'You have leveraged corporate benefits while securing an early lock on your personal coverage. Your base is highly protected against sudden job transitions or health anomalies.';
      buttonText = 'Optimize My Tranches';
      badgeText = 'STRONG FOUNDATION';
      bgBadge = 'var(--bg-success)';
      colorBadge = 'var(--text-success)';
      iconColor = 'var(--text-success)';
    } else if (isCorpYes || isEarlyYes) {
      // Case B (Mixed)
      heading = 'Your Protection Matrix: Partial Exposure';
      body = 'You have a foothold, but a gap remains. Relying solely on corporate cover leaves you vulnerable to job loss, while having personal cover without maximizing employer benefits leaves money on the table.';
      buttonText = 'Patch the Firewall';
      badgeText = 'PARTIAL EXPOSURE';
      bgBadge = 'var(--bg-warning)';
      colorBadge = 'var(--text-warning)';
      iconColor = 'var(--text-warning)';
      crackSvg = `<svg class="crack" width="64" height="64" viewBox="0 0 64 64" style="position:absolute;">
        <path d="M32 8 L28 22 L34 28 L28 50" stroke="var(--text-warning)" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>`;
    } else {
      // Case C (No / No)
      heading = 'Your Protection Matrix: Critical Vulnerability';
      body = 'Your current setup leaves your wealth highly exposed. Without corporate leverage or personal baseline locks, any health or life shock directly drains your savings and investments.';
      buttonText = 'Build Defensive Baseline';
      badgeText = 'CRITICAL VULNERABILITY';
      bgBadge = 'var(--bg-danger)';
      colorBadge = 'var(--text-danger)';
      iconColor = 'var(--border-strong)';
      crackSvg = `<svg class="crack" width="64" height="64" viewBox="0 0 64 64" style="position:absolute;">
        <path d="M32 8 L26 26 L36 30 L24 56" stroke="var(--text-danger)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>`;
    }

    return `
<style>
@keyframes drift { 0% { opacity:0; transform:translateY(14px);} 100% { opacity:1; transform:translateY(0);} }
@keyframes alertFlash { 0%, 100% { opacity:0.6;} 50% { opacity:1;} }
@keyframes crackPulse { 0%, 100% { opacity:0.7;} 50% { opacity:1;} }
.seq1 { animation: drift 0.5s ease 0.1s both; }
.seq2 { animation: drift 0.5s ease 0.4s both; }
.alert-badge { animation: alertFlash 1.4s ease-in-out 0.2s infinite; }
.crack { animation: crackPulse 1.4s ease-in-out 0.4s infinite; }
</style>
<div style="width:100%; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; text-align:center; background:var(--surface-2, #FFFFFF); padding:22px; border-radius:20px; box-sizing:border-box;">

  <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; text-align:center;">

    <div class="alert-badge" style="display:flex; align-items:center; gap:6px; background:${bgBadge}; border-radius:8px; padding:6px 12px;">
      <i class="ti ti-shield-exclamation" style="font-size:15px; color:${colorBadge};" aria-hidden="true"></i>
      <span style="font-size:11.5px; font-weight:600; color:${colorBadge};">${badgeText}</span>
    </div>

    <p class="seq1" style="font-size:17px; font-weight:500; margin:0; max-width:270px; line-height:1.4; color:var(--text-primary);">${heading}</p>

    <div style="position:relative; width:100px; height:100px; display:flex; align-items:center; justify-content:center;">
      <i class="ti ti-shield-check" style="font-size:64px; color:${iconColor};" aria-hidden="true"></i>
      ${crackSvg}
    </div>

    <p class="seq2" style="font-size:13.5px; color:var(--text-secondary); margin:0; max-width:270px; line-height:1.6;">${body}</p>

  </div>

  <button id="protection-status-continue-btn" style="width:100%; height:48px; border-radius:var(--radius); background:var(--fill-primary); color:var(--on-primary); border:none; font-size:14px; font-weight:600; cursor:pointer;">${buttonText} →</button>
</div>
`;
  };

  const activeSlide = insuranceData.slides[activeScreenIndex];
  const slideHtml = showProtectionStatusSlide ? getProtectionStatusSlideHtml() : activeSlide?.html;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      const wrapper = document.querySelector('.slide-html-wrapper');
      if (!wrapper) return;

      // Handle Continue button on dynamic Protection Status slide
      if (showProtectionStatusSlide) {
        const contBtn = wrapper.querySelector('#protection-status-continue-btn') as HTMLButtonElement;
        if (contBtn) {
          contBtn.onclick = (e) => {
            e.preventDefault();
            dismissProtectionStatusSlide();
          };
        }
        return;
      }

      // --- Screen 12: Corporate Leash (Screen Index 11) ---
      if (activeScreenIndex === 11) {
        const buttons = wrapper.querySelectorAll('button');
        if (buttons.length >= 2) {
          const yesBtn = buttons[0] as HTMLButtonElement;
          const noBtn = buttons[1] as HTMLButtonElement;
          const nextBtn = buttons[2] as HTMLButtonElement;

          if (yesBtn) { yesBtn.style.pointerEvents = 'auto'; yesBtn.style.cursor = 'pointer'; }
          if (noBtn) { noBtn.style.pointerEvents = 'auto'; noBtn.style.cursor = 'pointer'; }
          if (nextBtn) { nextBtn.style.pointerEvents = 'auto'; nextBtn.style.cursor = 'pointer'; }

          if (corporateLeashAnswer === 'Yes') {
            yesBtn.className = 'keep-btn-selected';
            noBtn.className = 'keep-btn-dimmed';
            if (nextBtn) nextBtn.style.opacity = '1';
          } else if (corporateLeashAnswer === 'No') {
            noBtn.className = 'keep-btn-selected';
            yesBtn.className = 'keep-btn-dimmed';
            if (nextBtn) nextBtn.style.opacity = '1';
          } else {
            if (nextBtn) nextBtn.style.opacity = '0.5';
          }

          const handleYes = (e: Event) => {
            e.preventDefault();
            setCorporateLeashAnswer('Yes');
            yesBtn.className = 'keep-btn-selected';
            noBtn.className = 'keep-btn-dimmed';
            if (nextBtn) nextBtn.style.opacity = '1';
          };

          const handleNo = (e: Event) => {
            e.preventDefault();
            setCorporateLeashAnswer('No');
            noBtn.className = 'keep-btn-selected';
            yesBtn.className = 'keep-btn-dimmed';
            if (nextBtn) nextBtn.style.opacity = '1';
          };

          yesBtn.onclick = handleYes;
          noBtn.onclick = handleNo;

          if (nextBtn) {
            nextBtn.onclick = (e) => {
              e.preventDefault();
              if (corporateLeashAnswer) {
                goToNext();
              } else {
                alert('Please select Yes or No to proceed.');
              }
            };
          }
        }
      }

      // --- Screen 13: Early Lock (Screen Index 12) ---
      if (activeScreenIndex === 12) {
        const buttons = wrapper.querySelectorAll('button');
        if (buttons.length >= 2) {
          const yesBtn = buttons[0] as HTMLButtonElement;
          const noBtn = buttons[1] as HTMLButtonElement;
          const analyzeBtn = buttons[2] as HTMLButtonElement;

          if (yesBtn) { yesBtn.style.pointerEvents = 'auto'; yesBtn.style.cursor = 'pointer'; }
          if (noBtn) { noBtn.style.pointerEvents = 'auto'; noBtn.style.cursor = 'pointer'; }
          if (analyzeBtn) { analyzeBtn.style.pointerEvents = 'auto'; analyzeBtn.style.cursor = 'pointer'; }

          if (earlyLockAnswer === 'Yes') {
            yesBtn.className = 'keep-btn-selected';
            noBtn.className = 'keep-btn-dimmed';
            if (analyzeBtn) analyzeBtn.style.opacity = '1';
          } else if (earlyLockAnswer === 'No') {
            noBtn.className = 'keep-btn-selected';
            yesBtn.className = 'keep-btn-dimmed';
            if (analyzeBtn) analyzeBtn.style.opacity = '1';
          } else {
            if (analyzeBtn) analyzeBtn.style.opacity = '0.5';
          }

          const handleYes = (e: Event) => {
            e.preventDefault();
            setEarlyLockAnswer('Yes');
            yesBtn.className = 'keep-btn-selected';
            noBtn.className = 'keep-btn-dimmed';
            if (analyzeBtn) analyzeBtn.style.opacity = '1';
          };

          const handleNo = (e: Event) => {
            e.preventDefault();
            setEarlyLockAnswer('No');
            noBtn.className = 'keep-btn-selected';
            yesBtn.className = 'keep-btn-dimmed';
            if (analyzeBtn) analyzeBtn.style.opacity = '1';
          };

          yesBtn.onclick = handleYes;
          noBtn.onclick = handleNo;

          if (analyzeBtn) {
            analyzeBtn.onclick = (e) => {
              e.preventDefault();
              if (earlyLockAnswer) {
                goToNext();
              } else {
                alert('Please select Yes or No to proceed.');
              }
            };
          }
        }
      }

      // --- Screen 11: Risk Audit Button ---
      if (activeScreenIndex === 10) {
        const auditBtn = wrapper.querySelector('button') as HTMLButtonElement;
        if (auditBtn) {
          auditBtn.onclick = (e) => {
            e.preventDefault();
            goToNext();
          };
        }
      }

      // --- Screen 16: Action Choice ---
      if (activeScreenIndex === 15) {
        const learnBtn = wrapper.querySelector('.seq3') as HTMLButtonElement;
        const skipBtn = wrapper.querySelector('.seq4') as HTMLButtonElement;
        if (learnBtn) {
          learnBtn.onclick = (e) => {
            e.preventDefault();
            recordQuizScore('final_action', { selectedOption: 0, isCorrect: true, score: 100 });
            alert('Great choice! Protecting your health & term baseline is rule #1.');
          };
        }
        if (skipBtn) {
          skipBtn.onclick = (e) => {
            e.preventDefault();
            recordQuizScore('final_action', { selectedOption: 1, isCorrect: false, score: 0 });
            alert('Remember: Never play offense when your defense has open gaps.');
          };
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeScreenIndex, showProtectionStatusSlide, corporateLeashAnswer, earlyLockAnswer]);

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
          dangerouslySetInnerHTML={{ __html: TABLER_ICONS_CDN + RAW_TOKENS_CSS + wrappedHtml }}
        />
      </View>

      <View style={s.navBar}>
        <Pressable
          style={[s.navBtn, activeScreenIndex === 0 && !showProtectionStatusSlide && s.navBtnDisabled]}
          disabled={activeScreenIndex === 0 && !showProtectionStatusSlide}
          onPress={goToPrev}
        >
          <Text style={s.navBtnText}>← Previous</Text>
        </Pressable>

        <View style={s.progressContainer}>
          <Text style={s.progressText}>
            {showProtectionStatusSlide
              ? 'Protection Status'
              : `Screen ${activeScreenIndex + 1} of ${totalScreens}`}
          </Text>
          <View style={s.progressBarTrack}>
            <View
              style={[
                s.progressBarFill,
                { width: showProtectionStatusSlide ? '82%' : `${((activeScreenIndex + 1) / totalScreens) * 100}%` },
              ]}
            />
          </View>
        </View>

        <Pressable
          style={[
            s.navBtn,
            (activeScreenIndex === totalScreens - 1 && !showProtectionStatusSlide) ||
            (activeScreenIndex === 11 && !corporateLeashAnswer) ||
            (activeScreenIndex === 12 && !earlyLockAnswer)
              ? s.navBtnDisabled
              : null,
          ]}
          disabled={
            (activeScreenIndex === totalScreens - 1 && !showProtectionStatusSlide) ||
            (activeScreenIndex === 11 && !corporateLeashAnswer) ||
            (activeScreenIndex === 12 && !earlyLockAnswer)
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
