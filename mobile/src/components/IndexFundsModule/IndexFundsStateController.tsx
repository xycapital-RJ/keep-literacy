import React, { createContext, useContext, useState } from 'react';

export interface IndexFundsStateContextType {
  activeScreenIndex: number;
  totalScreens: number;
  userAge: number | null;
  userContribution: number | null;
  showDontKnowFallback: boolean;
  userInputs: Record<string, any>;
  quizScores: Record<string, any>;
  goToNext: () => void;
  goToPrev: () => void;
  goToScreen: (index: number) => void;
  setUserAge: (age: number | null) => void;
  setUserContribution: (amount: number | null) => void;
  triggerDontKnowFallback: () => void;
  dismissDontKnowFallback: () => void;
  recordInput: (key: string, value: any) => void;
  resetModule: () => void;
}

const IndexFundsStateContext = createContext<IndexFundsStateContextType | undefined>(undefined);

export const TOTAL_INDEX_FUND_SCREENS = 16;

export function IndexFundsStateProvider({ children }: { children: React.ReactNode }) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [userAge, setUserAgeState] = useState<number | null>(null);
  const [userContribution, setUserContributionState] = useState<number | null>(null);
  const [showDontKnowFallback, setShowDontKnowFallback] = useState<boolean>(false);
  const [userInputs, setUserInputs] = useState<Record<string, any>>({});
  const [quizScores, setQuizScores] = useState<Record<string, any>>({});

  const setUserAge = (age: number | null) => {
    setUserAgeState(age);
    setUserInputs((prev) => ({ ...prev, age }));
  };

  const setUserContribution = (amount: number | null) => {
    setUserContributionState(amount);
    setUserInputs((prev) => ({ ...prev, contribution: amount }));
  };

  const triggerDontKnowFallback = () => {
    setShowDontKnowFallback(true);
  };

  const dismissDontKnowFallback = () => {
    setShowDontKnowFallback(false);
  };

  const goToNext = () => {
    if (showDontKnowFallback) {
      setShowDontKnowFallback(false);
      return;
    }
    setActiveScreenIndex((prev) => Math.min(prev + 1, TOTAL_INDEX_FUND_SCREENS - 1));
  };

  const goToPrev = () => {
    if (showDontKnowFallback) {
      setShowDontKnowFallback(false);
      return;
    }
    setActiveScreenIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToScreen = (index: number) => {
    setShowDontKnowFallback(false);
    if (index >= 0 && index < TOTAL_INDEX_FUND_SCREENS) {
      setActiveScreenIndex(index);
    }
  };

  const recordInput = (key: string, value: any) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
  };

  const resetModule = () => {
    setActiveScreenIndex(0);
    setUserAgeState(null);
    setUserContributionState(null);
    setShowDontKnowFallback(false);
    setUserInputs({});
    setQuizScores({});
  };

  return (
    <IndexFundsStateContext.Provider
      value={{
        activeScreenIndex,
        totalScreens: TOTAL_INDEX_FUND_SCREENS,
        userAge,
        userContribution,
        showDontKnowFallback,
        userInputs,
        quizScores,
        goToNext,
        goToPrev,
        goToScreen,
        setUserAge,
        setUserContribution,
        triggerDontKnowFallback,
        dismissDontKnowFallback,
        recordInput,
        resetModule,
      }}
    >
      {children}
    </IndexFundsStateContext.Provider>
  );
}

export function useIndexFundsState() {
  const context = useContext(IndexFundsStateContext);
  if (!context) {
    throw new Error('useIndexFundsState must be used within an IndexFundsStateProvider');
  }
  return context;
}
