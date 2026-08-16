import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Font, Radius, Space } from '../theme';
import type { FinancialScenario, ScenarioOption } from '../data/scenarios';

interface Props {
  visible: boolean;
  scenario: FinancialScenario | null;
  onClose: () => void;
  onSolve: (xpEarned: number) => void;
}

export function InteractiveScenarioModal({ visible, scenario, onClose, onSolve }: Props) {
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sliderVal, setSliderVal] = useState<number>(scenario?.sliderConfig?.defaultValue ?? 1000);

  if (!scenario) return null;

  const handleSelect = (option: ScenarioOption) => {
    if (submitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
    onSolve(150);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleDone = () => {
    handleReset();
    onClose();
  };

  const slider = scenario.sliderConfig;
  const calculatedNW = slider ? slider.calculateNetWorth(sliderVal) : 0;
  const calculatedCredit = slider ? slider.calculateCreditScore(sliderVal) : 720;
  const calculatedSaved = slider ? slider.calculateInterestSaved(sliderVal) : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleDone}
    >
      <View style={s.overlay}>
        <View style={s.modalContainer}>
          {/* Header */}
          <View style={s.header}>
            <View>
              <View style={s.categoryBadge}>
                <Text style={s.categoryText}>{scenario.category}</Text>
              </View>
              <Text style={s.title}>{scenario.title}</Text>
            </View>
            <Pressable style={s.closeBtn} onPress={handleDone}>
              <Text style={s.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={s.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Real Life Context */}
            <View style={s.contextCard}>
              <Text style={s.contextLabel}>REAL-WORLD DILEMMA</Text>
              <Text style={s.contextText}>{scenario.contextDescription}</Text>
            </View>

            {/* Problem Statement */}
            <Text style={s.problemTitle}>{scenario.problemStatement}</Text>

            {/* Interactive Slider Simulation Widget if present */}
            {slider ? (
              <View style={s.sliderCard}>
                <View style={s.sliderHeader}>
                  <Text style={s.sliderLabel}>{slider.label}</Text>
                  <Text style={s.sliderValText}>
                    {slider.unit}{sliderVal.toLocaleString()}
                  </Text>
                </View>

                {/* Slider Control Buttons */}
                <View style={s.sliderControlRow}>
                  <Pressable
                    style={s.stepBtn}
                    onPress={() => setSliderVal((v) => Math.max(slider.min, v - slider.step))}
                  >
                    <Text style={s.stepBtnText}>–</Text>
                  </Pressable>
                  
                  <View style={s.sliderTrackContainer}>
                    <View style={s.sliderTrackFill} />
                    <Text style={s.sliderHintText}>
                      Min: {slider.unit}{slider.min} · Max: {slider.unit}{slider.max}
                    </Text>
                  </View>

                  <Pressable
                    style={s.stepBtn}
                    onPress={() => setSliderVal((v) => Math.min(slider.max, v + slider.step))}
                  >
                    <Text style={s.stepBtnText}>+</Text>
                  </Pressable>
                </View>

                {/* Real-time Recalculation Results Bar */}
                <View style={s.calcResultGrid}>
                  <View style={s.calcBox}>
                    <Text style={s.calcVal}>+${calculatedNW.toLocaleString()}</Text>
                    <Text style={s.calcLbl}>Net Worth Gain</Text>
                  </View>
                  <View style={s.calcDivider} />
                  <View style={s.calcBox}>
                    <Text style={s.calcVal}>${calculatedSaved.toLocaleString()}</Text>
                    <Text style={s.calcLbl}>Money Saved</Text>
                  </View>
                  <View style={s.calcDivider} />
                  <View style={s.calcBox}>
                    <Text style={s.calcVal}>{calculatedCredit} pts</Text>
                    <Text style={s.calcLbl}>Est. Credit Score</Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Initial Financial Baseline */}
            <View style={s.statsBar}>
              <View style={s.statItem}>
                <Text style={s.statVal}>${scenario.initialCash.toLocaleString()}</Text>
                <Text style={s.statLbl}>Liquid Cash</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statVal}>${scenario.initialDebt.toLocaleString()}</Text>
                <Text style={s.statLbl}>Current Debt</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statVal}>${scenario.initialNetWorth.toLocaleString()}</Text>
                <Text style={s.statLbl}>Net Worth</Text>
              </View>
            </View>

            {/* Options List */}
            <View style={s.optionsWrap}>
              {scenario.options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      s.optionCard,
                      isSelected && s.optionCardSelected,
                    ]}
                    onPress={() => handleSelect(opt)}
                  >
                    <View style={s.optionHeader}>
                      <View style={[s.radioCircle, isSelected && s.radioCircleActive]} />
                      <Text style={[s.optionTitle, isSelected && s.optionTitleActive]}>
                        {opt.title}
                      </Text>
                    </View>
                    <Text style={s.optionSub}>{opt.subtitle}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Simulation Feedback after Submission */}
            {submitted && selectedOption ? (
              <View style={s.resultBox}>
                {/* True / False Verdict Banner */}
                <View style={[
                  s.verdictBanner,
                  selectedOption.isCorrectSolution ? s.verdictTrue : s.verdictFalse
                ]}>
                  <Text style={s.verdictBadgeText}>
                    {selectedOption.isCorrectSolution ? '✓ TRUE / OPTIMAL CHOICE' : '✕ RISKY / FALSE STRATEGY'}
                  </Text>
                </View>

                <View style={s.impactRow}>
                  <View style={s.impactBadge}>
                    <Text style={s.impactTitle}>Net Worth Impact</Text>
                    <Text style={[
                      s.impactValue,
                      selectedOption.netWorthChange >= 0 ? s.textPos : s.textNeg
                    ]}>
                      {selectedOption.netWorthChange >= 0 ? '+' : ''}${selectedOption.netWorthChange}
                    </Text>
                  </View>

                  <View style={s.impactBadge}>
                    <Text style={s.impactTitle}>Credit Score Impact</Text>
                    <Text style={[
                      s.impactValue,
                      selectedOption.creditScoreChange >= 0 ? s.textPos : s.textNeg
                    ]}>
                      {selectedOption.creditScoreChange >= 0 ? '+' : ''}{selectedOption.creditScoreChange} pts
                    </Text>
                  </View>
                </View>

                {/* Explanation of Why it is True or False */}
                <View style={s.reasoningCard}>
                  <Text style={s.reasoningHeader}>WHY THIS IS {selectedOption.isCorrectSolution ? 'TRUE' : 'FALSE'}:</Text>
                  <Text style={s.feedbackText}>{selectedOption.feedback}</Text>
                </View>

                <View style={s.takeawayBox}>
                  <Text style={s.takeawayTitle}>💡 KEY FINANCIAL LESSON</Text>
                  <Text style={s.takeawayText}>{selectedOption.takeaway}</Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Footer Action Button */}
          <View style={s.footer}>
            {!submitted ? (
              <Pressable
                style={[s.primaryBtn, !selectedOption && s.btnDisabled]}
                disabled={!selectedOption}
                onPress={handleSubmit}
              >
                <Text style={s.primaryBtnText}>Run Real-Life Simulation →</Text>
              </Pressable>
            ) : (
              <View style={s.doneRow}>
                <Pressable style={s.retryBtn} onPress={handleReset}>
                  <Text style={s.retryBtnText}>Try Other Choice</Text>
                </Pressable>
                <Pressable style={s.finishBtn} onPress={handleDone}>
                  <Text style={s.finishBtnText}>Claim +150 XP & Continue</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    maxHeight: '94%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Space.lg,
    paddingTop: Space.lg,
    paddingBottom: Space.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.surfaceUp,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  title: {
    fontSize: Font.lg,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  closeBtn: {
    padding: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
  closeText: {
    color: Colors.textMuted,
    fontSize: Font.md,
    fontWeight: Font.bold,
  },
  scrollBody: {
    paddingHorizontal: Space.lg,
    paddingVertical: Space.md,
  },
  contextCard: {
    backgroundColor: Colors.surface,
    padding: Space.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Space.md,
  },
  contextLabel: {
    fontSize: Font.xs,
    fontWeight: Font.bold,
    color: Colors.textFaint,
    letterSpacing: 1,
    marginBottom: 4,
  },
  contextText: {
    fontSize: Font.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  problemTitle: {
    fontSize: Font.md,
    fontWeight: Font.bold,
    color: Colors.white,
    marginBottom: Space.md,
  },
  sliderCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    marginBottom: Space.md,
    gap: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: Font.xs,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  sliderValText: {
    fontSize: Font.md,
    fontWeight: Font.black,
    color: Colors.white,
  },
  sliderControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    fontWeight: Font.bold,
    color: Colors.black,
    lineHeight: 24,
  },
  sliderTrackContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  sliderTrackFill: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  sliderHintText: {
    fontSize: 10,
    color: Colors.textFaint,
  },
  calcResultGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  calcBox: {
    flex: 1,
    alignItems: 'center',
  },
  calcVal: {
    fontSize: Font.sm,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  calcLbl: {
    fontSize: 9,
    color: Colors.textFaint,
    marginTop: 2,
  },
  calcDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Space.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: Font.base,
    fontWeight: Font.bold,
    color: Colors.white,
  },
  statLbl: {
    fontSize: 10,
    color: Colors.textFaint,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  optionsWrap: {
    gap: 12,
    marginBottom: Space.lg,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    padding: Space.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionCardSelected: {
    borderColor: Colors.white,
    backgroundColor: Colors.surfaceUp,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.textFaint,
  },
  radioCircleActive: {
    borderColor: Colors.white,
    backgroundColor: Colors.white,
  },
  optionTitle: {
    fontSize: Font.base,
    fontWeight: Font.bold,
    color: Colors.textMuted,
  },
  optionTitleActive: {
    color: Colors.white,
  },
  optionSub: {
    fontSize: Font.xs,
    color: Colors.textFaint,
    paddingLeft: 26,
  },
  resultBox: {
    backgroundColor: Colors.surfaceCard,
    padding: Space.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    marginTop: Space.sm,
    marginBottom: Space.xl,
    gap: 12,
  },
  verdictBanner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  verdictTrue: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  verdictFalse: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  verdictBadgeText: {
    fontSize: Font.xs,
    fontWeight: Font.black,
    color: Colors.white,
    letterSpacing: 1,
  },
  impactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  impactBadge: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  impactTitle: {
    fontSize: 10,
    color: Colors.textFaint,
  },
  impactValue: {
    fontSize: Font.base,
    fontWeight: Font.bold,
    marginTop: 2,
  },
  textPos: { color: Colors.white },
  textNeg: { color: Colors.danger },
  reasoningCard: {
    backgroundColor: Colors.surface,
    padding: Space.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  reasoningHeader: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: Colors.white,
    letterSpacing: 0.8,
  },
  feedbackText: {
    fontSize: Font.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  takeawayBox: {
    backgroundColor: Colors.surface,
    padding: Space.sm,
    borderRadius: Radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.white,
  },
  takeawayTitle: {
    fontSize: 10,
    fontWeight: Font.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  takeawayText: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  primaryBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.35,
  },
  primaryBtnText: {
    color: Colors.black,
    fontWeight: Font.bold,
    fontSize: Font.base,
  },
  doneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  retryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderUp,
    alignItems: 'center',
  },
  retryBtnText: {
    color: Colors.textMuted,
    fontSize: Font.sm,
    fontWeight: Font.semibold,
  },
  finishBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  finishBtnText: {
    color: Colors.black,
    fontSize: Font.sm,
    fontWeight: Font.bold,
  },
});
