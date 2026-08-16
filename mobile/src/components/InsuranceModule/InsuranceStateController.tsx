import React, { createContext, useContext, useState } from 'react';

export interface QuizScore {
  selectedOption: number;
  isCorrect: boolean;
  score: number;
  explanation?: string;
}

export type AnswerState = 'Yes' | 'No' | null;

export interface InsuranceStateContextType {
  activeScreenIndex: number;
  totalScreens: number;
  userInputs: Record<string, any>;
  quizScores: Record<string, QuizScore>;
  corporateLeashAnswer: AnswerState;
  earlyLockAnswer: AnswerState;
  showProtectionStatusSlide: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  goToScreen: (index: number) => void;
  recordInput: (key: string, value: any) => void;
  recordQuizScore: (key: string, scoreData: QuizScore) => void;
  setCorporateLeashAnswer: (val: AnswerState) => void;
  setEarlyLockAnswer: (val: AnswerState) => void;
  dismissProtectionStatusSlide: () => void;
  resetModule: () => void;
}

const InsuranceStateContext = createContext<InsuranceStateContextType | undefined>(undefined);

export const TOTAL_INSURANCE_SCREENS = 16;

export function InsuranceStateProvider({ children }: { children: React.ReactNode }) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, any>>({});
  const [quizScores, setQuizScores] = useState<Record<string, QuizScore>>({});
  const [corporateLeashAnswer, setCorporateLeashAnswerState] = useState<AnswerState>(null);
  const [earlyLockAnswer, setEarlyLockAnswerState] = useState<AnswerState>(null);
  const [showProtectionStatusSlide, setShowProtectionStatusSlide] = useState<boolean>(false);

  const setCorporateLeashAnswer = (val: AnswerState) => {
    setCorporateLeashAnswerState(val);
    setUserInputs((prev) => ({ ...prev, corporateLeashAnswer: val }));
  };

  const setEarlyLockAnswer = (val: AnswerState) => {
    setEarlyLockAnswerState(val);
    setUserInputs((prev) => ({ ...prev, earlyLockAnswer: val }));
  };

  const goToNext = () => {
    // Post Screen 13 (index 12): check if we need to show the Dynamic Protection Status Slide before Screen 14 (index 13)
    if (activeScreenIndex === 12 && !showProtectionStatusSlide) {
      setShowProtectionStatusSlide(true);
      return;
    }

    if (showProtectionStatusSlide) {
      setShowProtectionStatusSlide(false);
      setActiveScreenIndex(13); // Continue to Screen 14
      return;
    }

    setActiveScreenIndex((prev) => Math.min(prev + 1, TOTAL_INSURANCE_SCREENS - 1));
  };

  const goToPrev = () => {
    if (showProtectionStatusSlide) {
      setShowProtectionStatusSlide(false);
      setActiveScreenIndex(12); // Go back to Screen 13
      return;
    }
    setActiveScreenIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToScreen = (index: number) => {
    setShowProtectionStatusSlide(false);
    if (index >= 0 && index < TOTAL_INSURANCE_SCREENS) {
      setActiveScreenIndex(index);
    }
  };

  const dismissProtectionStatusSlide = () => {
    setShowProtectionStatusSlide(false);
    setActiveScreenIndex(13);
  };

  const recordInput = (key: string, value: any) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
  };

  const recordQuizScore = (key: string, scoreData: QuizScore) => {
    setQuizScores((prev) => ({ ...prev, [key]: scoreData }));
  };

  const resetModule = () => {
    setActiveScreenIndex(0);
    setUserInputs({});
    setQuizScores({});
    setCorporateLeashAnswerState(null);
    setEarlyLockAnswerState(null);
    setShowProtectionStatusSlide(false);
  };

  return (
    <InsuranceStateContext.Provider
      value={{
        activeScreenIndex,
        totalScreens: TOTAL_INSURANCE_SCREENS,
        userInputs,
        quizScores,
        corporateLeashAnswer,
        earlyLockAnswer,
        showProtectionStatusSlide,
        goToNext,
        goToPrev,
        goToScreen,
        recordInput,
        recordQuizScore,
        setCorporateLeashAnswer,
        setEarlyLockAnswer,
        dismissProtectionStatusSlide,
        resetModule,
      }}
    >
      {children}
    </InsuranceStateContext.Provider>
  );
}

export function useInsuranceState() {
  const context = useContext(InsuranceStateContext);
  if (!context) {
    throw new Error('useInsuranceState must be used within an InsuranceStateProvider');
  }
  return context;
}
