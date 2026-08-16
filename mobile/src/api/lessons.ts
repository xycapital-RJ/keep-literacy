import { LessonWithSlides } from '../types/course';
import insuranceData from '../data/insuranceModule.json';
import creditCardData from '../data/creditCardModule.json';
import indexFundsData from '../data/indexFundsModule.json';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// Helper to map JSON slide data into typed Slide objects
function mapSlides(slides: any[], lessonId: string) {
  return slides.map((s: any) => {
    const base = {
      id: s.slide_id,
      lessonId,
      order: s.slide_number,
      title: s.title ?? s.description ?? '',
      body: s.description ?? '',
    };

    // Quiz slide
    if (s.type === 'QUIZ' || s.slide_id_type === 'QUIZ') {
      return {
        ...base,
        type: 'QUIZ' as const,
        question: s.question,
        options: s.options,
        correctOption: s.correctOption,
        explanation: s.explanation,
      };
    }

    // HTML animated slide
    if (s.html) {
      return {
        ...base,
        type: 'TEXT' as const,
        html: s.html,
      };
    }

    // Plain text slide
    return {
      ...base,
      type: 'TEXT' as const,
    };
  });
}

const INSURANCE_SLIDES = mapSlides(insuranceData.slides as any[], 'lesson-insurance-basics');
const CREDIT_CARD_SLIDES = mapSlides(creditCardData.slides as any[], 'lesson-cc-masterclass');
const INDEX_FUNDS_SLIDES = mapSlides(indexFundsData.slides as any[], 'lesson-index-funds');

const MOCK_LESSONS: Record<string, LessonWithSlides> = {
  'lesson-insurance-basics': {
    id: 'lesson-insurance-basics',
    moduleId: 'mod-2',
    title: 'Insurance Basics & Risk Shields',
    description: 'Why insurance is a financial shield, not an investment.',
    order: 1,
    xpReward: 50,
    slides: INSURANCE_SLIDES,
  },
  'lesson-cc-masterclass': {
    id: 'lesson-cc-masterclass',
    moduleId: 'mod-1',
    title: 'Credit Card Masterclass',
    description: 'Understand the real cost—and benefit—of credit cards.',
    order: 1,
    xpReward: 50,
    slides: CREDIT_CARD_SLIDES,
  },
  'lesson-index-funds': {
    id: 'lesson-index-funds',
    moduleId: 'mod-3',
    title: 'Index Funds: The Boring Wealth Engine',
    description: 'Why passive index investing beats active speculation.',
    order: 1,
    xpReward: 60,
    slides: INDEX_FUNDS_SLIDES,
  },
};

export async function fetchLesson(id: string): Promise<LessonWithSlides> {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return MOCK_LESSONS[id] ?? MOCK_LESSONS['lesson-insurance-basics'];
  }
}
