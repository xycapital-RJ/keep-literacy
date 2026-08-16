import { Course, CourseWithModules } from '../types/course';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-101',
    title: 'Financial Literacy 101',
    slug: 'financial-literacy-101',
    description: 'Master personal finance essentials—credit cards, interest rates, emergency funds, and inflation survival.',
    difficulty: 'BEGINNER',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'course-102',
    title: 'Index Funds & Wealth Engine',
    slug: 'index-funds-wealth',
    description: 'Understand passive NIFTY 50 / S&P 500 index investing, compound interest math, and long-term asset allocation.',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
    imageUrl: null,
  },
  {
    id: 'course-103',
    title: 'Credit Score Recovery & Debt Avalanche',
    slug: 'credit-score-recovery',
    description: 'Repair a low credit score, eliminate high-interest debt, and optimize card utilization ratios.',
    difficulty: 'ADVANCED',
    isPublished: true,
    imageUrl: null,
  },
];

const MOCK_COURSE_DETAILS: Record<string, CourseWithModules> = {
  'course-101': {
    id: 'course-101',
    title: 'Financial Literacy 101',
    slug: 'financial-literacy-101',
    description: 'Master personal finance essentials—credit cards, interest rates, emergency funds, and inflation survival.',
    difficulty: 'BEGINNER',
    isPublished: true,
    imageUrl: null,
    modules: [
      {
        id: 'mod-1',
        courseId: 'course-101',
        title: 'Credit Cards & Interest Traps',
        description: 'Transactors vs Revolvers and how 24% interest acts as a toxic drag.',
        order: 1,
        lessons: [
          {
            id: 'lesson-cc-masterclass',
            moduleId: 'mod-1',
            title: 'Credit Card Masterclass',
            description: 'Understand the real cost—and benefit—of credit cards.',
            order: 1,
            xpReward: 50,
          },
        ],
      },
      {
        id: 'mod-2',
        courseId: 'course-101',
        title: 'Risk Transfer & Insurance Shields',
        description: 'Protecting your wealth against catastrophic health expenses.',
        order: 2,
        lessons: [
          {
            id: 'lesson-insurance-basics',
            moduleId: 'mod-2',
            title: 'Insurance Basics',
            description: 'Why insurance is a financial shield, not an investment.',
            order: 1,
            xpReward: 40,
          },
        ],
      },
    ],
  },
  'course-102': {
    id: 'course-102',
    title: 'Index Funds & Wealth Engine',
    slug: 'index-funds-wealth',
    description: 'Understand passive NIFTY 50 / S&P 500 index investing, compound interest math, and long-term asset allocation.',
    difficulty: 'INTERMEDIATE',
    isPublished: true,
    imageUrl: null,
    modules: [
      {
        id: 'mod-3',
        courseId: 'course-102',
        title: 'The Self-Cleaning Index Engine',
        description: 'Why passive index funds outperform 76%+ of active fund managers over 10 years.',
        order: 1,
        lessons: [
          {
            id: 'lesson-index-funds',
            moduleId: 'mod-3',
            title: 'Index Funds: The Boring Wealth Engine',
            description: 'Why passive index investing beats active speculation.',
            order: 1,
            xpReward: 60,
          },
        ],
      },
    ],
  },
};

export async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return MOCK_COURSES;
  }
}

export async function fetchCourse(id: string): Promise<CourseWithModules> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return MOCK_COURSE_DETAILS[id] ?? MOCK_COURSE_DETAILS['course-101'];
  }
}
