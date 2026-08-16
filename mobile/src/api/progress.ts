const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface SaveProgressPayload {
  userId: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score?: number;
}

export interface GamificationResult {
  xpEarned: number;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export interface SaveProgressResult {
  gamification?: GamificationResult;
}

export interface AttemptResult {
  isCorrect: boolean;
  selectedOption: number;
  correctOption: number;
  explanation: string | null;
}

export async function saveLessonProgress(
  lessonId: string,
  payload: SaveProgressPayload,
): Promise<SaveProgressResult> {
  const response = await fetch(
    `${API_BASE_URL}/lessons/${lessonId}/progress`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to save progress (${response.status})`);
  }

  return response.json() as Promise<SaveProgressResult>;
}

export async function recordSlideAttempt(
  slideId: string,
  userId: string,
  selectedOption: number,
): Promise<AttemptResult> {
  const response = await fetch(`${API_BASE_URL}/slides/${slideId}/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, selectedOption }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to record attempt (${response.status})`);
  }

  return response.json() as Promise<AttemptResult>;
}
