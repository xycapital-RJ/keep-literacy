export interface ScenarioOption {
  id: string;
  title: string;
  subtitle: string;
  impactText: string;
  netWorthChange: number;
  cashFlowChange: number;
  creditScoreChange: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  feedback: string;
  takeaway: string;
  isCorrectSolution?: boolean;
}

export interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  calculateNetWorth: (val: number) => number;
  calculateCreditScore: (val: number) => number;
  calculateInterestSaved: (val: number) => number;
}

export interface FinancialScenario {
  id: string;
  category: 'DEBT & CREDIT' | 'BUDGET & INFLATION' | 'INVESTING' | 'REAL ESTATE' | 'TAX & SALARY';
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  initialCash: number;
  initialDebt: number;
  initialNetWorth: number;
  contextDescription: string;
  problemStatement: string;
  options: ScenarioOption[];
  sliderConfig?: SliderConfig;
}

export const REAL_WORLD_SCENARIOS: FinancialScenario[] = [
  {
    id: 'scen-credit-card-trap',
    category: 'DEBT & CREDIT',
    title: 'The 24% Credit Card Trap',
    tagline: 'Pay minimum or wipe out high-interest credit card debt?',
    difficulty: 'Beginner',
    initialCash: 4200,
    initialDebt: 3500,
    initialNetWorth: 700,
    contextDescription: 'You owe $3,500 on a credit card carrying a 24% APR ($70/mo in pure interest fees). You have $4,200 saved in checking earning 0.01%.',
    problemStatement: 'What payoff strategy creates the highest net worth and credit score over 12 months?',
    sliderConfig: {
      label: 'Drag Monthly Extra Payoff Amount',
      min: 100,
      max: 3500,
      step: 100,
      defaultValue: 1500,
      unit: '$',
      calculateNetWorth: (val) => Math.round(val * 0.24),
      calculateCreditScore: (val) => Math.min(800, 650 + Math.round((val / 3500) * 110)),
      calculateInterestSaved: (val) => Math.round((val / 3500) * 840),
    },
    options: [
      {
        id: 'opt-min-pay',
        title: 'Pay Only $100 Minimum',
        subtitle: 'Keep all $4,200 cash as safety buffer',
        impactText: 'You lose $840/year in interest charges alone.',
        netWorthChange: -840,
        cashFlowChange: -100,
        creditScoreChange: -15,
        riskScore: 'HIGH',
        feedback: 'FALSE STRATEGY! Paying only the minimum keeps your cash liquid but costs you $840 in compound interest over 12 months. High utilization lowers your credit score.',
        takeaway: 'High interest rate debt (>10%) acts like a guaranteed negative return on your money.',
        isCorrectSolution: false,
      },
      {
        id: 'opt-pay-full',
        title: 'Lump-Sum Payoff ($3,500)',
        subtitle: 'Eliminate 100% of debt today, keeping $700 liquid cash',
        impactText: 'Saves $840 in annual interest & boosts credit score instantly.',
        netWorthChange: +840,
        cashFlowChange: +70,
        creditScoreChange: +45,
        riskScore: 'LOW',
        feedback: 'TRUE & OPTIMAL MOVE! Eliminating 24% interest gives you an immediate guaranteed 24% risk-free return. Credit utilization drops to 0%, causing an instant credit score jump.',
        takeaway: 'Paying off 24% credit card debt is mathematically identical to finding a guaranteed 24% investment return.',
        isCorrectSolution: true,
      },
      {
        id: 'opt-half-pay',
        title: 'Hybrid Split ($2,000 Payoff + $2,200 Buffer)',
        subtitle: 'Balance debt reduction while retaining a $2,200 emergency fund',
        impactText: 'Cuts monthly interest in half ($35/mo)',
        netWorthChange: +420,
        cashFlowChange: +35,
        creditScoreChange: +20,
        riskScore: 'MEDIUM',
        feedback: 'BALANCED STRATEGY! You cut interest drag in half while retaining a solid cash buffer for unexpected emergencies.',
        takeaway: 'If liquidity gives you peace of mind, partial payoffs cut compound interest toxicity while maintaining emergency security.',
        isCorrectSolution: false,
      },
    ],
  },
  {
    id: 'scen-salary-negotiation',
    category: 'TAX & SALARY',
    title: 'Salary vs Stock Equity Negotiation',
    tagline: '$95k Guaranteed Cash vs $80k Base + $30k Equity Options?',
    difficulty: 'Intermediate',
    initialCash: 10000,
    initialDebt: 0,
    initialNetWorth: 10000,
    contextDescription: 'You received two job offers: Option A is $95,000 all-cash salary. Option B is $80,000 base salary + $30,000 in startup equity stock options vesting over 4 years.',
    problemStatement: 'Which offer structure yields higher long-term risk-adjusted wealth?',
    sliderConfig: {
      label: 'Estimate Startup Equity Growth Multiplier',
      min: 0,
      max: 5,
      step: 0.5,
      defaultValue: 2,
      unit: 'x',
      calculateNetWorth: (val) => Math.round(80000 + 7500 * val - 95000),
      calculateCreditScore: () => 740,
      calculateInterestSaved: (val) => Math.round(7500 * val),
    },
    options: [
      {
        id: 'opt-pure-cash',
        title: 'Choose $95k Pure Cash',
        subtitle: '100% guaranteed liquidity, immediate cash flow',
        impactText: 'Guaranteed cash for rent, emergency fund & index fund investing.',
        netWorthChange: +15000,
        cashFlowChange: +1250,
        creditScoreChange: +10,
        riskScore: 'LOW',
        feedback: 'TRUE & STABLE MOVE! Cash provides guaranteed liquidity. You can invest the extra $15k cash into broad index funds without illiquid stock lockups.',
        takeaway: 'Early in your career, guaranteed cash flow that you control beats speculative unvested startup equity.',
        isCorrectSolution: true,
      },
      {
        id: 'opt-equity-gambit',
        title: 'Choose $80k Base + $30k Equity',
        subtitle: 'Betting on startup valuation growth',
        impactText: 'High risk — 70% of early startups fail before vesting.',
        netWorthChange: -5000,
        cashFlowChange: -250,
        creditScoreChange: 0,
        riskScore: 'HIGH',
        feedback: 'HIGH RISK CHOICE! Over 70% of early startups fail or dilute equity before 4-year vesting completes. Your cash flow is $15k lower each year.',
        takeaway: 'Never count illiquid paper stock options as guaranteed compensation until options are exercised and liquid.',
        isCorrectSolution: false,
      },
    ],
  },
  {
    id: 'scen-inflation-budget',
    category: 'BUDGET & INFLATION',
    title: 'The Inflation Squeeze',
    tagline: 'Rent & grocery prices jumped 12%. Rebalance your monthly cash flow.',
    difficulty: 'Intermediate',
    initialCash: 3000,
    initialDebt: 0,
    initialNetWorth: 3000,
    contextDescription: 'Your monthly take-home salary is $3,800. Due to inflation, your essential living expenses increased to $3,350/mo. You currently spend $500/mo on dining & subscriptions.',
    problemStatement: 'You are now running a monthly cash deficit of -$50/month. How do you rebalance?',
    sliderConfig: {
      label: 'Monthly Discretionary Expense Cut',
      min: 50,
      max: 500,
      step: 50,
      defaultValue: 250,
      unit: '$',
      calculateNetWorth: (val) => val * 12,
      calculateCreditScore: (val) => Math.min(800, 700 + Math.round(val / 10)),
      calculateInterestSaved: (val) => val * 12,
    },
    options: [
      {
        id: 'opt-cut-subs',
        title: 'Trim Subscriptions & Dining out by $300',
        subtitle: 'Audit monthly recurring charges & eat out less',
        impactText: 'Positive cash flow of +$250/mo maintained for savings.',
        netWorthChange: +3000,
        cashFlowChange: +250,
        creditScoreChange: +10,
        riskScore: 'LOW',
        feedback: 'TRUE & RESILIENT STRATEGY! Trimming non-essential discretionary spend protects your savings rate without increasing your financial risk.',
        takeaway: 'Audit recurring subscriptions and dining expenses every quarter—they quietly drain long-term wealth.',
        isCorrectSolution: true,
      },
      {
        id: 'opt-use-credit',
        title: 'Cover Deficit with Credit Card',
        subtitle: 'Maintain lifestyle and hope for a raise next year',
        impactText: 'Accumulates $600+ rolling debt in 1 year.',
        netWorthChange: -750,
        cashFlowChange: -50,
        creditScoreChange: -30,
        riskScore: 'HIGH',
        feedback: 'FALSE STRATEGY! Using debt to subsidize structural lifestyle deficits leads to compounding interest traps.',
        takeaway: 'Never use credit cards to cover chronic cash deficits.',
        isCorrectSolution: false,
      },
    ],
  },
];
