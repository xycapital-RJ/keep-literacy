import React, { createContext, useContext, useState } from 'react';

export type BranchChoice = '10a-no-income' | '10b-yes-input' | '10c-no-card-yet' | null;

export interface CreditCardStateContextType {
  activeScreenIndex: number;
  totalSequenceScreens: number;
  selectedBranch: BranchChoice;
  userCreditLimit: number | null;
  userInputs: Record<string, any>;
  quizScores: Record<string, any>;
  goToNext: () => void;
  goToPrev: () => void;
  goToScreen: (index: number) => void;
  selectBranch: (choice: BranchChoice) => void;
  setUserCreditLimit: (val: number) => void;
  recordInput: (key: string, value: any) => void;
  resetModule: () => void;
}

const CreditCardStateContext = createContext<CreditCardStateContextType | undefined>(undefined);

export function CreditCardStateProvider({ children }: { children: React.ReactNode }) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [selectedBranch, setSelectedBranch] = useState<BranchChoice>(null);
  const [userCreditLimit, setUserCreditLimit] = useState<number | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, any>>({});
  const [quizScores, setQuizScores] = useState<Record<string, any>>({});

  const sequenceScreenIds = [
    'screen-1a-script',
    'screen-1b-ad-crack',
    'screen-2-ghost-protocol',
    'screen-3-trust-test',
    'screen-4-debit-math',
    'screen-5-shield',
    'screen-6-borrowed-time',
    'screen-7-two-users',
    'screen-8-the-goal',
    'screen-9-pivot',
    'screen-10-branch',
  ];

  const totalSequenceScreens = sequenceScreenIds.length;

  const goToNext = () => {
    // If at Screen 10 (index 10) and branch chosen, route to branch screen
    if (activeScreenIndex === 10 && selectedBranch) {
      // Branch navigation handled in viewer
      return;
    }
    setActiveScreenIndex((prev) => Math.min(prev + 1, totalSequenceScreens - 1));
  };

  const goToPrev = () => {
    if (selectedBranch) {
      setSelectedBranch(null);
      setActiveScreenIndex(10);
      return;
    }
    setActiveScreenIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToScreen = (index: number) => {
    setSelectedBranch(null);
    if (index >= 0 && index < totalSequenceScreens) {
      setActiveScreenIndex(index);
    }
  };

  const selectBranch = (choice: BranchChoice) => {
    setSelectedBranch(choice);
  };

  const recordInput = (key: string, value: any) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
  };

  const resetModule = () => {
    setActiveScreenIndex(0);
    setSelectedBranch(null);
    setUserCreditLimit(null);
    setUserInputs({});
    setQuizScores({});
  };

  return (
    <CreditCardStateContext.Provider
      value={{
        activeScreenIndex,
        totalSequenceScreens,
        selectedBranch,
        userCreditLimit,
        userInputs,
        quizScores,
        goToNext,
        goToPrev,
        goToScreen,
        selectBranch,
        setUserCreditLimit,
        recordInput,
        resetModule,
      }}
    >
      {children}
    </CreditCardStateContext.Provider>
  );
}

export function useCreditCardState() {
  const context = useContext(CreditCardStateContext);
  if (!context) {
    throw new Error('useCreditCardState must be used within a CreditCardStateProvider');
  }
  return context;
}
