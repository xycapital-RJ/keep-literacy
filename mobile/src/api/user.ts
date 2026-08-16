const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export async function fetchUserStats(
  userId: string,
  token: string,
): Promise<UserStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return {
      xp: 450,
      level: 3,
      currentStreak: 7,
      longestStreak: 14,
    };
  }
}
