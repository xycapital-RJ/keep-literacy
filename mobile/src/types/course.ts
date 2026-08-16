import { Slide } from './slide';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  order: number;
  xpReward: number;
}

export interface LessonWithSlides extends Lesson {
  slides: Slide[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: CourseModule[];
}
