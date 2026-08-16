export type SlideType = 'TEXT' | 'QUIZ' | 'VIDEO' | 'IMAGE';

export interface Slide {
  id: string;
  lessonId: string;
  order: number;
  type: SlideType;
  title?: string | null;
  body?: string | null;
  mediaUrl?: string | null;
  question?: string | null;
  options?: string[] | null;
  correctOption?: number | null;
  explanation?: string | null;
}
