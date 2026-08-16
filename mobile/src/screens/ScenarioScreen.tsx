import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { REAL_WORLD_SCENARIOS, ScenarioOption } from '../data/scenarios';
import { Colors, Font, Radius, Space } from '../theme';

type Step = 'context' | 'explore' | 'decide' | 'result';

// ─── Knowledge Profile System ───────────────────────────────────────────────

interface ModuleRec {
  icon: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
  why: string;
  urgency: 'CRITICAL' | 'IMPORTANT' | 'RECOMMENDED';
}

interface KnowledgeProfile {
  iqScore: number;
  strengths: string[];
  gaps: string[];
  gapExplanation: string;
  modules: ModuleRec[];
  consistencyMessage: string;
}

function buildKnowledgeProfile(
  scenarioId: string,
  selected: ScenarioOption,
): KnowledgeProfile {
  const isCorrect = !!selected.isCorrectSolution;

  const profiles: Record<string, KnowledgeProfile> = {
    'scen-credit-card-trap_correct': {
      iqScore: 88,
      strengths: [
        'You recognised that 24% APR is a guaranteed negative return on idle cash',
        'You prioritised debt elimination over keeping low-yield savings',
        'You correctly linked credit utilisation to credit score improvement',
      ],
      gaps: [
        'Do you know when NOT to pay off debt? (e.g. 0% promotional periods)',
        'Can you explain grace periods, statement dates & billing cycle arbitrage?',
      ],
      gapExplanation:
        "You nailed the basics — but most people who get this right still lose thousands to traps they don't recognise. The next level is understanding the fine print that credit card companies exploit.",
      modules: [
        {
          icon: '💳',
          title: 'Credit Card Masterclass',
          lessonId: 'lesson-cc-masterclass',
          lessonTitle: 'Credit Card Masterclass',
          why: 'Deepen your edge — master statement dates, grace periods & reward arbitrage that most people never use.',
          urgency: 'RECOMMENDED',
        },
        {
          icon: '🛡️',
          title: 'Insurance Risk Shield',
          lessonId: 'lesson-insurance-basics',
          lessonTitle: 'Insurance Basics & Risk Shields',
          why: 'Protecting wealth from emergency wipeouts is just as important as building it.',
          urgency: 'IMPORTANT',
        },
      ],
      consistencyMessage:
        "🔥 You're thinking like a transactor. Come back tomorrow to master the advanced credit traps that cost people thousands every year.",
    },

    'scen-credit-card-trap_wrong': {
      iqScore: 42,
      strengths: [
        'You recognised that liquid cash has value as a buffer',
        'You thought about month-to-month cash flow needs',
      ],
      gaps: [
        'You do not yet see 24% APR as a guaranteed -24% annual return on your cash',
        'You underestimated how compounding interest magnifies debt over 12 months',
        'You confused liquidity with financial safety — they are not the same thing',
      ],
      gapExplanation:
        'Keeping $4,200 in a 0.01% savings account while paying 24% credit card interest is mathematically identical to pouring money down a drain. Every month of delay adds $70 in pure interest charges that do nothing for you.',
      modules: [
        {
          icon: '💳',
          title: 'Credit Card Masterclass',
          lessonId: 'lesson-cc-masterclass',
          lessonTitle: 'Credit Card Masterclass',
          why: 'This module will show you exactly why 24% APR is the most toxic number in your financial life — and how to eliminate it permanently.',
          urgency: 'CRITICAL',
        },
        {
          icon: '📈',
          title: 'Index Fund Engine',
          lessonId: 'lesson-index-funds',
          lessonTitle: 'Index Funds: The Boring Wealth Engine',
          why: 'Once your debt is cleared, compound growth works FOR you. Learn how to deploy freed-up cash into wealth-building assets.',
          urgency: 'IMPORTANT',
        },
      ],
      consistencyMessage:
        '⚡ This is exactly why 78% of people stay trapped in debt loops for years. Study the Credit Card module today and this mistake will never happen again.',
    },

    'scen-salary-negotiation_correct': {
      iqScore: 82,
      strengths: [
        'You valued guaranteed cash flow over speculative paper equity',
        'You correctly assessed startup failure risk before vesting',
        'You thought long-term about liquidity and investing freedom',
      ],
      gaps: [
        'Do you know how to evaluate equity when the upside IS genuinely large?',
        'Can you model vesting cliffs, strike prices and dilution mechanics?',
      ],
      gapExplanation:
        'Great call on the cash — but this decision gets harder when equity upside is real. Build the analytical framework before your next job offer so you can evaluate both sides confidently.',
      modules: [
        {
          icon: '📈',
          title: 'Index Fund Engine',
          lessonId: 'lesson-index-funds',
          lessonTitle: 'Index Funds: The Boring Wealth Engine',
          why: 'Now that you chose cash, learn how to deploy it smartly. Index fund investing beats most startup equity outcomes over a decade.',
          urgency: 'CRITICAL',
        },
        {
          icon: '🛡️',
          title: 'Insurance Risk Shield',
          lessonId: 'lesson-insurance-basics',
          lessonTitle: 'Insurance Basics & Risk Shields',
          why: 'Higher salary = higher lifestyle risk. Protect your income with proper term and health coverage before you invest.',
          urgency: 'RECOMMENDED',
        },
      ],
      consistencyMessage:
        '💰 You chose stability. Now put that extra $15k to work. Return tomorrow and learn how compound interest turns salary choices into generational wealth.',
    },

    'scen-salary-negotiation_wrong': {
      iqScore: 38,
      strengths: [
        'You were willing to take calculated risk for potential upside',
        'You recognised equity as a form of compensation worth exploring',
      ],
      gaps: [
        'You did not account for the 70%+ startup failure rate before 4-year vesting completes',
        'You ignored the $15,000 annual cash flow gap that creates financial stress and debt dependency',
        'You treated unvested paper equity as real liquid money — it is not',
      ],
      gapExplanation:
        'Taking illiquid startup equity over guaranteed cash is one of the most common financial mistakes in early careers. The equity sounds exciting, but 4 years is a very long time when 7 in 10 startups fail or dilute shares before vesting.',
      modules: [
        {
          icon: '📈',
          title: 'Index Fund Engine',
          lessonId: 'lesson-index-funds',
          lessonTitle: 'Index Funds: The Boring Wealth Engine',
          why: 'Understand how $15k/year invested in index funds at 12% CAGR beats most startup equity outcomes by year 10 — with zero lock-in risk.',
          urgency: 'CRITICAL',
        },
        {
          icon: '💳',
          title: 'Credit Card Masterclass',
          lessonId: 'lesson-cc-masterclass',
          lessonTitle: 'Credit Card Masterclass',
          why: 'Lower salary + high expenses = credit card dependency. Master credit management before equity bets create debt traps.',
          urgency: 'IMPORTANT',
        },
      ],
      consistencyMessage:
        '📉 Most people who take this path regret it by year 2. Come back every day this week to build the financial IQ that protects you from these traps.',
    },

    'scen-inflation-budget_correct': {
      iqScore: 85,
      strengths: [
        'You identified discretionary spending as the adjustable lever, not essential expenses',
        'You protected your savings rate during inflation pressure',
        'You chose a low-risk, sustainable rebalancing approach',
      ],
      gaps: [
        'Do you have a formal zero-based budget system to track every rupee?',
        'Do you know which subscription categories drain the most money silently?',
      ],
      gapExplanation:
        "Smart move. But most people who make the right call here haven't built a systematic monthly budget yet — so the next inflation spike catches them unprepared again.",
      modules: [
        {
          icon: '📈',
          title: 'Index Fund Engine',
          lessonId: 'lesson-index-funds',
          lessonTitle: 'Index Funds: The Boring Wealth Engine',
          why: 'Once you free up $300/mo in discretionary spend — invest it automatically. This is how $300 becomes ₹25 lakhs in 15 years.',
          urgency: 'CRITICAL',
        },
        {
          icon: '🛡️',
          title: 'Insurance Risk Shield',
          lessonId: 'lesson-insurance-basics',
          lessonTitle: 'Insurance Basics & Risk Shields',
          why: 'Inflation protection also means protecting your income from catastrophic health events that wipe out savings in a single month.',
          urgency: 'IMPORTANT',
        },
      ],
      consistencyMessage:
        '⚡ Solid budget discipline. Come back tomorrow to learn how to turn that $300/month of recovered spending into a 10-year wealth machine.',
    },

    'scen-inflation-budget_wrong': {
      iqScore: 31,
      strengths: [
        'You recognised the short-term discomfort of cutting lifestyle expenses',
        'You hoped for future income growth (a raise) as a path forward',
      ],
      gaps: [
        'You used debt to cover a structural monthly deficit — the most dangerous financial habit',
        'You ignored how 24% credit card interest turns a $600 balance into $1,600+ in two years',
        'You treated lifestyle maintenance as more important than financial stability',
      ],
      gapExplanation:
        'Using a credit card to cover monthly cash deficits is a trap that converts a small $600 problem into a $6,000 debt spiral within 2–3 years through compound interest. This is exactly how middle-income families lose decades of wealth accumulation.',
      modules: [
        {
          icon: '💳',
          title: 'Credit Card Masterclass',
          lessonId: 'lesson-cc-masterclass',
          lessonTitle: 'Credit Card Masterclass',
          why: 'You just used a credit card for the exact wrong reason. This module shows the debt spiral math in vivid, unavoidable detail.',
          urgency: 'CRITICAL',
        },
        {
          icon: '🛡️',
          title: 'Insurance Risk Shield',
          lessonId: 'lesson-insurance-basics',
          lessonTitle: 'Insurance Basics & Risk Shields',
          why: 'Without a proper emergency fund, every inflation spike forces you into credit card debt. Learn how to build a real financial safety net.',
          urgency: 'IMPORTANT',
        },
      ],
      consistencyMessage:
        '🚨 This pattern — using debt to maintain lifestyle — is the #1 cause of middle-class wealth destruction. Start the Credit Card module RIGHT NOW. Every day you wait costs you.',
    },
  };

  const key = `${scenarioId}_${isCorrect ? 'correct' : 'wrong'}`;
  return profiles[key] ?? {
    iqScore: isCorrect ? 75 : 45,
    strengths: isCorrect
      ? ['You made a financially sound decision', 'You understood the core trade-off']
      : ['You engaged seriously with a complex financial problem'],
    gaps: isCorrect
      ? ['Explore edge cases and advanced scenarios to sharpen further']
      : ['Review the core financial concept behind this scenario'],
    gapExplanation: isCorrect
      ? 'Good instinct. Deepen your knowledge with the recommended modules below.'
      : 'The right answer reveals a gap in your current financial knowledge. The modules below will fix it specifically.',
    modules: [
      {
        icon: '💳',
        title: 'Credit Card Masterclass',
        lessonId: 'lesson-cc-masterclass',
        lessonTitle: 'Credit Card Masterclass',
        why: 'Master the most commonly misunderstood financial instrument in the world.',
        urgency: 'RECOMMENDED',
      },
    ],
    consistencyMessage: '📚 Every scenario you complete sharpens your financial judgment. Come back tomorrow.',
  };
}

// ─── Screen Component ────────────────────────────────────────────────────────

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scenario'>;
  route: RouteProp<RootStackParamList, 'Scenario'>;
}

export function ScenarioScreen({ navigation, route }: Props) {
  const { scenarioId } = route.params;
  const scenario = REAL_WORLD_SCENARIOS.find((s) => s.id === scenarioId) ?? REAL_WORLD_SCENARIOS[0];

  const [step, setStep] = useState<Step>('context');
  const [sliderVal, setSliderVal] = useState(scenario.sliderConfig?.defaultValue ?? 1000);
  const [selected, setSelected] = useState<ScenarioOption | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const slider = scenario.sliderConfig;
  const calcNW = slider ? slider.calculateNetWorth(sliderVal) : 0;
  const calcCredit = slider ? slider.calculateCreditScore(sliderVal) : 720;
  const calcSaved = slider ? slider.calculateInterestSaved(sliderVal) : 0;

  const STEPS: Step[] = slider
    ? ['context', 'explore', 'decide', 'result']
    : ['context', 'decide', 'result'];
  const stepIndex = STEPS.indexOf(step);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const restart = () => {
    setStep('context');
    setSelected(null);
    setSliderVal(scenario.sliderConfig?.defaultValue ?? 1000);
  };

  const diffColor =
    scenario.difficulty === 'Beginner'
      ? '#2d8a4e'
      : scenario.difficulty === 'Intermediate'
      ? '#c98a1f'
      : '#791F1F';

  const urgencyColor = (u: ModuleRec['urgency']) =>
    u === 'CRITICAL' ? '#791F1F' : u === 'IMPORTANT' ? '#c98a1f' : '#2d8a4e';
  const urgencyBg = (u: ModuleRec['urgency']) =>
    u === 'CRITICAL'
      ? 'rgba(121,31,31,0.12)'
      : u === 'IMPORTANT'
      ? 'rgba(201,138,31,0.12)'
      : 'rgba(45,138,78,0.10)';

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Home')}>
            <Text style={s.backLogo}>keep</Text>
          </Pressable>
        </View>
        <View style={s.headerCenter}>
          <Text style={s.categoryText}>{scenario.category}</Text>
        </View>
        <View style={[s.diffBadge, { backgroundColor: diffColor + '22', borderColor: diffColor + '55' }]}>
          <Text style={[s.diffText, { color: diffColor }]}>{scenario.difficulty}</Text>
        </View>
      </View>

      {/* ── Step Progress Bar ── */}
      <View style={s.stepBar}>
        {STEPS.map((st, i) => (
          <View
            key={st}
            style={[s.stepDot, i <= stepIndex && s.stepDotActive, i < stepIndex && s.stepDotDone]}
          />
        ))}
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, isMobile && { paddingHorizontal: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════════════ STEP 1: CONTEXT ══════════════ */}
        {step === 'context' && (
          <View style={s.stepView}>
            <View style={s.scenarioBigCard}>
              <Text style={s.bigLabel}>REAL-WORLD DILEMMA</Text>
              <Text style={s.bigTitle}>{scenario.title}</Text>
              <Text style={s.tagline}>{scenario.tagline}</Text>
            </View>

            <View style={s.contextBlock}>
              <Text style={s.blockLabel}>📍 YOUR SITUATION</Text>
              <Text style={s.blockBody}>{scenario.contextDescription}</Text>
            </View>

            <View style={s.financialBaseline}>
              <Text style={s.blockLabel}>💼 YOUR STARTING POSITION</Text>
              <View style={s.baselineRow}>
                <View style={s.baselineItem}>
                  <Text style={s.baselineVal}>${scenario.initialCash.toLocaleString()}</Text>
                  <Text style={s.baselineLbl}>Liquid Cash</Text>
                </View>
                <View style={s.baselineDivider} />
                <View style={s.baselineItem}>
                  <Text style={[s.baselineVal, { color: '#791F1F' }]}>
                    ${scenario.initialDebt.toLocaleString()}
                  </Text>
                  <Text style={s.baselineLbl}>Debt</Text>
                </View>
                <View style={s.baselineDivider} />
                <View style={s.baselineItem}>
                  <Text style={s.baselineVal}>${scenario.initialNetWorth.toLocaleString()}</Text>
                  <Text style={s.baselineLbl}>Net Worth</Text>
                </View>
              </View>
            </View>

            <View style={s.questionCard}>
              <Text style={s.questionLabel}>❓ THE QUESTION</Text>
              <Text style={s.questionText}>{scenario.problemStatement}</Text>
            </View>

            <Pressable style={s.ctaBtn} onPress={goNext}>
              <Text style={s.ctaBtnText}>
                {slider ? 'Run the Numbers →' : 'See Your Options →'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* ══════════════ STEP 2: EXPLORE ══════════════ */}
        {step === 'explore' && slider && (
          <View style={s.stepView}>
            <Text style={s.stepHeading}>Run the Numbers</Text>
            <Text style={s.stepSub}>
              Adjust below and watch your outcome change in real time — this is compounding, live.
            </Text>

            <View style={s.sliderCard}>
              <View style={s.sliderHeader}>
                <Text style={s.sliderLabel}>{slider.label}</Text>
                <Text style={s.sliderVal}>
                  {slider.unit}{sliderVal.toLocaleString()}
                </Text>
              </View>
              <View style={s.sliderControls}>
                <Pressable
                  style={s.stepperBtn}
                  onPress={() => setSliderVal((v) => Math.max(slider.min, v - slider.step))}
                >
                  <Text style={s.stepperText}>−</Text>
                </Pressable>
                <View style={s.sliderTrack}>
                  <View
                    style={[
                      s.sliderFill,
                      {
                        width: `${((sliderVal - slider.min) / (slider.max - slider.min)) * 100}%` as any,
                      },
                    ]}
                  />
                </View>
                <Pressable
                  style={s.stepperBtn}
                  onPress={() => setSliderVal((v) => Math.min(slider.max, v + slider.step))}
                >
                  <Text style={s.stepperText}>+</Text>
                </Pressable>
              </View>
              <Text style={s.sliderRange}>
                {slider.unit}{slider.min.toLocaleString()} → {slider.unit}{slider.max.toLocaleString()}
              </Text>
            </View>

            <View style={s.resultCards}>
              <View style={s.resultCard}>
                <Text style={s.resultCardIcon}>📈</Text>
                <Text style={s.resultCardVal}>+${calcNW.toLocaleString()}</Text>
                <Text style={s.resultCardLbl}>Net Worth Gain</Text>
              </View>
              <View style={s.resultCard}>
                <Text style={s.resultCardIcon}>💰</Text>
                <Text style={s.resultCardVal}>${calcSaved.toLocaleString()}</Text>
                <Text style={s.resultCardLbl}>Money Saved</Text>
              </View>
              <View style={s.resultCard}>
                <Text style={s.resultCardIcon}>⭐</Text>
                <Text style={s.resultCardVal}>{calcCredit}</Text>
                <Text style={s.resultCardLbl}>Credit Score</Text>
              </View>
            </View>

            <View style={s.insightBox}>
              <Text style={s.insightTitle}>💡 Notice something?</Text>
              <Text style={s.insightBody}>
                Even small changes create dramatically different outcomes. This is compounding — it works FOR
                and AGAINST you depending on your choice.
              </Text>
            </View>

            <Pressable style={s.ctaBtn} onPress={goNext}>
              <Text style={s.ctaBtnText}>Make Your Decision →</Text>
            </Pressable>
          </View>
        )}

        {/* ══════════════ STEP 3: DECIDE ══════════════ */}
        {step === 'decide' && (
          <View style={s.stepView}>
            <Text style={s.stepHeading}>Make Your Call</Text>
            <Text style={s.stepSub}>
              Pick the strategy you'd actually use. No penalty for being wrong — that's how real learning happens.
            </Text>

            <View style={s.optionsList}>
              {scenario.options.map((opt) => {
                const isSel = selected?.id === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[s.optionCard, isSel && s.optionCardSelected]}
                    onPress={() => setSelected(opt)}
                  >
                    <View style={s.optionHeader}>
                      <View style={[s.radio, isSel && s.radioActive]} />
                      <Text style={[s.optionTitle, isSel && s.optionTitleActive]}>
                        {opt.title}
                      </Text>
                      <View
                        style={[
                          s.riskPill,
                          opt.riskScore === 'LOW' && s.riskLow,
                          opt.riskScore === 'MEDIUM' && s.riskMed,
                          opt.riskScore === 'HIGH' && s.riskHigh,
                        ]}
                      >
                        <Text style={s.riskText}>{opt.riskScore}</Text>
                      </View>
                    </View>
                    <Text style={s.optionSub}>{opt.subtitle}</Text>
                    {isSel && <Text style={s.impactText}>{opt.impactText}</Text>}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[s.ctaBtn, !selected && s.ctaDisabled]}
              disabled={!selected}
              onPress={goNext}
            >
              <Text style={s.ctaBtnText}>Reveal the Verdict →</Text>
            </Pressable>
          </View>
        )}

        {/* ══════════════ STEP 4: RESULT + COACHING ══════════════ */}
        {step === 'result' && selected && (
          <ResultCoachingView
            scenario={scenario}
            selected={selected}
            scenarioId={scenarioId}
            navigation={navigation}
            onRestart={restart}
            urgencyColor={urgencyColor}
            urgencyBg={urgencyBg}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Result + Coaching view pulled into its own component to stay clean ──────

function ResultCoachingView({
  scenario,
  selected,
  scenarioId,
  navigation,
  onRestart,
  urgencyColor,
  urgencyBg,
}: {
  scenario: (typeof REAL_WORLD_SCENARIOS)[0];
  selected: ScenarioOption;
  scenarioId: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scenario'>;
  onRestart: () => void;
  urgencyColor: (u: ModuleRec['urgency']) => string;
  urgencyBg: (u: ModuleRec['urgency']) => string;
}) {

  const profile = buildKnowledgeProfile(scenarioId, selected);

  return (
    <View style={s.stepView}>
      {/* Verdict Banner */}
      <View style={[s.verdictBanner, selected.isCorrectSolution ? s.verdictCorrect : s.verdictWrong]}>
        <Text style={s.verdictEmoji}>{selected.isCorrectSolution ? '✅' : '❌'}</Text>
        <Text style={s.verdictTitle}>
          {selected.isCorrectSolution ? 'Optimal Strategy!' : 'Risky Move!'}
        </Text>
        <Text style={s.verdictSub}>{selected.title}</Text>
      </View>

      {/* Financial IQ Score */}
      <View style={s.iqCard}>
        <View style={s.iqTop}>
          <View>
            <Text style={s.iqLabel}>YOUR FINANCIAL IQ SCORE</Text>
            <Text style={s.iqSubLabel}>Based on this decision</Text>
          </View>
          <Text
            style={[
              s.iqScore,
              profile.iqScore >= 70
                ? s.textGreen
                : profile.iqScore >= 50
                ? { color: '#c98a1f' }
                : s.textRed,
            ]}
          >
            {profile.iqScore}
            <Text style={s.iqSlash}>/100</Text>
          </Text>
        </View>
        <View style={s.iqBar}>
          <View
            style={[
              s.iqFill,
              {
                width: `${profile.iqScore}%` as any,
                backgroundColor:
                  profile.iqScore >= 70 ? '#2d8a4e' : profile.iqScore >= 50 ? '#c98a1f' : '#791F1F',
              },
            ]}
          />
        </View>
        <Text style={s.iqTier}>
          {profile.iqScore >= 80
            ? '🏆 Financial Strategist'
            : profile.iqScore >= 60
            ? '📊 Developing Awareness'
            : profile.iqScore >= 40
            ? '⚠️ Knowledge Gap Detected'
            : '🚨 Critical Blind Spot Identified'}
        </Text>
      </View>

      {/* Impact Grid */}
      <View style={s.impactGrid}>
        <View style={s.impactCard}>
          <Text style={s.impactCardIcon}>💰</Text>
          <Text style={[s.impactCardVal, selected.netWorthChange >= 0 ? s.textGreen : s.textRed]}>
            {selected.netWorthChange >= 0 ? '+' : ''}${selected.netWorthChange.toLocaleString()}
          </Text>
          <Text style={s.impactCardLbl}>Net Worth</Text>
        </View>
        <View style={s.impactCard}>
          <Text style={s.impactCardIcon}>⭐</Text>
          <Text style={[s.impactCardVal, selected.creditScoreChange >= 0 ? s.textGreen : s.textRed]}>
            {selected.creditScoreChange >= 0 ? '+' : ''}{selected.creditScoreChange} pts
          </Text>
          <Text style={s.impactCardLbl}>Credit Score</Text>
        </View>
        <View style={s.impactCard}>
          <Text style={s.impactCardIcon}>📊</Text>
          <Text style={[s.impactCardVal, selected.cashFlowChange >= 0 ? s.textGreen : s.textRed]}>
            {selected.cashFlowChange >= 0 ? '+' : ''}${selected.cashFlowChange}/mo
          </Text>
          <Text style={s.impactCardLbl}>Cash Flow</Text>
        </View>
      </View>

      {/* What You Got Right */}
      <View style={s.analysisCard}>
        <Text style={s.analysisLabel}>✅ WHAT YOU GOT RIGHT</Text>
        {profile.strengths.map((str, i) => (
          <View key={i} style={s.analysisRow}>
            <View style={[s.analysisDot, { backgroundColor: '#2d8a4e' }]} />
            <Text style={s.analysisText}>{str}</Text>
          </View>
        ))}
      </View>

      {/* Where You Fell Short / What to Strengthen */}
      {profile.gaps.length > 0 && (
        <View style={[s.analysisCard, { borderColor: selected.isCorrectSolution ? 'rgba(201,138,31,0.4)' : 'rgba(121,31,31,0.4)' }]}>
          <Text style={[s.analysisLabel, { color: selected.isCorrectSolution ? '#c98a1f' : '#791F1F' }]}>
            {selected.isCorrectSolution ? '⚡ WHAT TO STRENGTHEN NEXT' : '❌ WHERE YOU FELL SHORT'}
          </Text>
          {profile.gaps.map((gap, i) => (
            <View key={i} style={s.analysisRow}>
              <View style={[s.analysisDot, { backgroundColor: selected.isCorrectSolution ? '#c98a1f' : '#791F1F' }]} />
              <Text style={s.analysisText}>{gap}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Blind Spot Explanation */}
      <View style={s.gapCard}>
        <Text style={s.gapLabel}>🧠 YOUR FINANCIAL BLIND SPOT</Text>
        <Text style={s.gapBody}>{profile.gapExplanation}</Text>
      </View>

      {/* Why it was right/wrong */}
      <View style={s.explanationCard}>
        <Text style={s.explanationLabel}>
          WHY {selected.isCorrectSolution ? 'THIS WORKS' : 'THIS IS RISKY'}:
        </Text>
        <Text style={s.explanationBody}>{selected.feedback}</Text>
      </View>

      {/* Better choice if wrong */}
      {!selected.isCorrectSolution && (
        <View style={s.compareBlock}>
          <Text style={s.compareLabel}>THE OPTIMAL CHOICE WOULD HAVE BEEN:</Text>
          {scenario.options
            .filter((o) => o.isCorrectSolution)
            .map((o) => (
              <View key={o.id} style={s.compareCard}>
                <Text style={s.compareTitle}>{o.title}</Text>
                <Text style={s.compareSub}>{o.feedback}</Text>
              </View>
            ))}
        </View>
      )}

      {/* ── Module Recommendations ── */}
      <View style={s.recSection}>
        <Text style={s.recSectionTitle}>
          {selected.isCorrectSolution ? '🚀 LEVEL UP YOUR KNOWLEDGE' : '📚 FIX YOUR KNOWLEDGE GAPS'}
        </Text>
        <Text style={s.recSectionSub}>
          {selected.isCorrectSolution
            ? "You got this right — now go deeper. These modules build on what you already understand."
            : "Your score reveals specific knowledge gaps. Start with CRITICAL modules to prevent real financial losses."}
        </Text>

        {profile.modules.map((mod) => (
          <Pressable
            key={mod.lessonId}
            style={[
              s.recCard,
              {
                borderColor: urgencyColor(mod.urgency) + '55',
                backgroundColor: urgencyBg(mod.urgency),
              },
            ]}
            onPress={() =>
              navigation.navigate('Lesson', {
                lessonId: mod.lessonId,
                lessonTitle: mod.lessonTitle,
              })
            }
          >
            <View style={s.recCardTop}>
              <View style={s.recCardLeft}>
                <Text style={s.recCardIcon}>{mod.icon}</Text>
                <Text style={s.recCardTitle}>{mod.title}</Text>
              </View>
              <View
                style={[
                  s.recUrgencyBadge,
                  {
                    backgroundColor: urgencyColor(mod.urgency) + '22',
                    borderColor: urgencyColor(mod.urgency) + '66',
                  },
                ]}
              >
                <Text style={[s.recUrgencyText, { color: urgencyColor(mod.urgency) }]}>
                  {mod.urgency}
                </Text>
              </View>
            </View>
            <Text style={s.recCardWhy}>{mod.why}</Text>
            <Text style={[s.recCardCta, { color: urgencyColor(mod.urgency) }]}>
              Start Module →
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Key Takeaway */}
      <View style={s.takeawayCard}>
        <Text style={s.takeawayLabel}>💡 KEY LESSON TO REMEMBER</Text>
        <Text style={s.takeawayBody}>{selected.takeaway}</Text>
      </View>

      {/* ── Consistency / Daily Return Strip ── */}
      <View style={s.consistencyStrip}>
        <View style={s.consistencyTop}>
          <Text style={s.consistencyIcon}>🔥</Text>
          <Text style={s.consistencyHeading}>Build Your Financial IQ — Daily</Text>
        </View>
        <Text style={s.consistencyMsg}>{profile.consistencyMessage}</Text>
        <View style={s.streakRow}>
          {['Today', '+1', '+2', '+3', '+4', '+5', '+6'].map((label, i) => (
            <View key={label} style={[s.streakDay, i > 0 && s.streakDayPending]}>
              <Text style={i === 0 ? s.streakDayDot : s.streakDayDotPending}>
                {i === 0 ? '●' : '○'}
              </Text>
              <Text style={i === 0 ? s.streakDayLbl : s.streakDayLblPending}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={s.streakMotivation}>
          Complete 1 module or scenario daily → earn 7-day streak badge 🏅
        </Text>
      </View>


      <View style={s.resultActions}>
        <Pressable style={s.retryBtn} onPress={onRestart}>
          <Text style={s.retryBtnText}>Try Again</Text>
        </Pressable>
        <Pressable style={s.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={s.doneBtnText}>← Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 64 },
  backArrow: { fontSize: 20, color: Colors.white, fontWeight: Font.bold },
  backLogo: { fontSize: Font.base, fontWeight: Font.black, color: Colors.white, letterSpacing: -0.5 },
  headerCenter: { flex: 1, alignItems: 'center' },
  categoryText: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1.2 },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    minWidth: 64,
    alignItems: 'center',
  },
  diffText: { fontSize: 10, fontWeight: Font.bold },

  stepBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Space.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  stepDotActive: { backgroundColor: Colors.white },
  stepDotDone: { backgroundColor: 'rgba(255,255,255,0.45)' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Space.lg, paddingTop: Space.xl, paddingBottom: 56 },
  stepView: { gap: 20 },

  // Context step
  scenarioBigCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.xl,
    padding: Space.lg,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    gap: 8,
  },
  bigLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1.4 },
  bigTitle: { fontSize: Font.xl, fontWeight: Font.black, color: Colors.white, lineHeight: 28 },
  tagline: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 20 },

  contextBlock: {
    backgroundColor: Colors.surface,
    padding: Space.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  blockLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1.2 },
  blockBody: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 22 },

  financialBaseline: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.md,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    gap: 10,
  },
  baselineRow: { flexDirection: 'row' },
  baselineItem: { flex: 1, alignItems: 'center', gap: 4 },
  baselineVal: { fontSize: Font.base, fontWeight: Font.bold, color: Colors.white },
  baselineLbl: { fontSize: 10, color: Colors.textFaint, letterSpacing: 0.5 },
  baselineDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Space.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  questionLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1 },
  questionText: { fontSize: Font.base, fontWeight: Font.bold, color: Colors.white, lineHeight: 24 },

  ctaBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaDisabled: { opacity: 0.35 },
  ctaBtnText: { color: Colors.black, fontWeight: Font.bold, fontSize: Font.base },

  // Explore step
  stepHeading: { fontSize: Font.xl, fontWeight: Font.black, color: Colors.white },
  stepSub: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 22 },

  sliderCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    gap: 16,
  },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderLabel: { fontSize: Font.xs, fontWeight: Font.semibold, color: Colors.textMuted, flex: 1 },
  sliderVal: { fontSize: Font.lg, fontWeight: Font.black, color: Colors.white },
  sliderControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepperBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
  },
  stepperText: { fontSize: 24, fontWeight: Font.bold, color: Colors.black, lineHeight: 26 },
  sliderTrack: {
    flex: 1, height: 8, backgroundColor: Colors.surface,
    borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
  },
  sliderFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 4 },
  sliderRange: { fontSize: 11, color: Colors.textFaint, textAlign: 'center' },

  resultCards: { flexDirection: 'row', gap: 10 },
  resultCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: 14, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border,
  },
  resultCardIcon: { fontSize: 22 },
  resultCardVal: { fontSize: Font.sm, fontWeight: Font.bold, color: Colors.white },
  resultCardLbl: { fontSize: 10, color: Colors.textFaint, textAlign: 'center' },

  insightBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Space.md, borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  insightTitle: { fontSize: Font.sm, fontWeight: Font.bold, color: Colors.white },
  insightBody: { fontSize: Font.xs, color: Colors.textMuted, lineHeight: 20 },

  // Decide step
  optionsList: { gap: 14 },
  optionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Space.md, borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  optionCardSelected: { borderColor: Colors.white, backgroundColor: Colors.surfaceUp },
  optionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.textFaint },
  radioActive: { borderColor: Colors.white, backgroundColor: Colors.white },
  optionTitle: { flex: 1, fontSize: Font.base, fontWeight: Font.bold, color: Colors.textMuted },
  optionTitleActive: { color: Colors.white },
  riskPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  riskLow: { backgroundColor: 'rgba(45,138,78,0.2)', borderColor: '#2d8a4e' },
  riskMed: { backgroundColor: 'rgba(201,138,31,0.2)', borderColor: '#c98a1f' },
  riskHigh: { backgroundColor: 'rgba(121,31,31,0.2)', borderColor: '#791F1F' },
  riskText: { fontSize: 9, fontWeight: Font.bold, color: Colors.textMuted, letterSpacing: 0.5 },
  optionSub: { fontSize: Font.xs, color: Colors.textFaint, paddingLeft: 28, lineHeight: 18 },
  impactText: { fontSize: Font.xs, color: Colors.textMuted, paddingLeft: 28, fontStyle: 'italic', lineHeight: 18 },

  // Result step
  verdictBanner: {
    borderRadius: Radius.xl, padding: Space.lg,
    alignItems: 'center', gap: 8, borderWidth: 1,
  },
  verdictCorrect: { backgroundColor: 'rgba(45,138,78,0.15)', borderColor: 'rgba(45,138,78,0.5)' },
  verdictWrong: { backgroundColor: 'rgba(121,31,31,0.15)', borderColor: 'rgba(121,31,31,0.5)' },
  verdictEmoji: { fontSize: 40 },
  verdictTitle: { fontSize: Font.xl, fontWeight: Font.black, color: Colors.white },
  verdictSub: { fontSize: Font.sm, color: Colors.textMuted, textAlign: 'center' },

  // IQ Card
  iqCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: Radius.lg,
    padding: Space.md, borderWidth: 1, borderColor: Colors.borderUp, gap: 12,
  },
  iqTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iqLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1.2 },
  iqSubLabel: { fontSize: Font.xs, color: Colors.textFaint, marginTop: 2 },
  iqScore: { fontSize: 40, fontWeight: Font.black, lineHeight: 44 },
  iqSlash: { fontSize: Font.base, fontWeight: Font.semibold, color: Colors.textFaint },
  iqBar: {
    height: 8, backgroundColor: Colors.surface,
    borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border,
  },
  iqFill: { height: '100%', borderRadius: 4 },
  iqTier: { fontSize: Font.xs, fontWeight: Font.bold, color: Colors.textMuted },

  // Impact grid
  impactGrid: { flexDirection: 'row', gap: 10 },
  impactCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: 14, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border,
  },
  impactCardIcon: { fontSize: 20 },
  impactCardVal: { fontSize: Font.sm, fontWeight: Font.black },
  impactCardLbl: { fontSize: 10, color: Colors.textFaint, textAlign: 'center' },

  // Analysis cards
  analysisCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Space.md, borderWidth: 1, borderColor: Colors.border, gap: 10,
  },
  analysisLabel: {
    fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1,
  },
  analysisList: { gap: 8 },
  analysisRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  analysisDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  analysisText: { flex: 1, fontSize: Font.xs, color: Colors.textMuted, lineHeight: 20 },

  // Blind spot / gap card
  gapCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: Radius.md,
    padding: Space.md, borderWidth: 1, borderColor: Colors.borderUp,
    borderLeftWidth: 3, borderLeftColor: Colors.white, gap: 8,
  },
  gapLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.white, letterSpacing: 1 },
  gapBody: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 22 },

  // Explanation
  explanationCard: {
    backgroundColor: Colors.surfaceCard, borderRadius: Radius.md,
    padding: Space.md, borderWidth: 1, borderColor: Colors.borderUp, gap: 8,
  },
  explanationLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1 },
  explanationBody: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 22 },

  // Compare
  compareBlock: { gap: 10 },
  compareLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.textFaint, letterSpacing: 1 },
  compareCard: {
    backgroundColor: 'rgba(45,138,78,0.1)', borderRadius: Radius.md,
    padding: Space.md, borderWidth: 1, borderColor: 'rgba(45,138,78,0.3)', gap: 4,
  },
  compareTitle: { fontSize: Font.sm, fontWeight: Font.bold, color: Colors.white },
  compareSub: { fontSize: Font.xs, color: Colors.textMuted, lineHeight: 18 },

  // Module Recommendations
  recSection: { gap: 12 },
  recSectionTitle: {
    fontSize: Font.sm, fontWeight: Font.black, color: Colors.white, letterSpacing: 0.5,
  },
  recSectionSub: { fontSize: Font.xs, color: Colors.textMuted, lineHeight: 20, marginTop: -4 },
  recCard: {
    borderRadius: Radius.lg, padding: Space.md,
    borderWidth: 1, gap: 10,
  },
  recCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  recCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  recCardIcon: { fontSize: 28 },
  recCardTitle: { fontSize: Font.base, fontWeight: Font.bold, color: Colors.white, flex: 1 },
  recUrgencyBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full, borderWidth: 1,
  },
  recUrgencyText: { fontSize: 9, fontWeight: Font.black, letterSpacing: 0.8 },
  recCardWhy: { fontSize: Font.xs, color: Colors.textMuted, lineHeight: 20 },
  recCardCta: { fontSize: Font.sm, fontWeight: Font.bold },

  // Key takeaway
  takeawayCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Space.md, borderLeftWidth: 3, borderLeftColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  takeawayLabel: { fontSize: 10, fontWeight: Font.bold, color: Colors.white, letterSpacing: 0.8 },
  takeawayBody: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 20 },

  // Consistency strip
  consistencyStrip: {
    backgroundColor: Colors.surfaceCard, borderRadius: Radius.xl,
    padding: Space.lg, borderWidth: 1, borderColor: Colors.borderUp, gap: 14,
  },
  consistencyTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  consistencyIcon: { fontSize: 28 },
  consistencyHeading: { fontSize: Font.base, fontWeight: Font.bold, color: Colors.white, flex: 1 },
  consistencyMsg: { fontSize: Font.sm, color: Colors.textMuted, lineHeight: 22 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDay: { alignItems: 'center', gap: 4 },
  streakDayPending: { opacity: 0.4 },
  streakDayDot: { fontSize: 16, color: Colors.white },
  streakDayDotPending: { fontSize: 16, color: Colors.textFaint },
  streakDayLbl: { fontSize: 9, fontWeight: Font.bold, color: Colors.white },
  streakDayLblPending: { fontSize: 9, color: Colors.textFaint },
  streakMotivation: {
    fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 16,
  },

  // XP + actions
  xpBadge: {
    alignSelf: 'center', backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderUp,
  },
  xpBadgeText: { fontSize: Font.base, fontWeight: Font.bold, color: Colors.white },
  resultActions: { flexDirection: 'row', gap: 10 },
  retryBtn: {
    flex: 1, paddingVertical: 14, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  retryBtnText: { fontSize: Font.sm, fontWeight: Font.semibold, color: Colors.textMuted },
  doneBtn: {
    flex: 2, paddingVertical: 14, borderRadius: Radius.md,
    backgroundColor: Colors.white, alignItems: 'center',
  },
  doneBtnText: { color: Colors.black, fontWeight: Font.bold, fontSize: Font.sm },

  textGreen: { color: '#2d8a4e' },
  textRed: { color: '#791F1F' },
});
