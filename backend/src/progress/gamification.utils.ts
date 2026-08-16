/**
 * Gamification domain utilities.
 * Pure functions — no dependencies, fully testable in isolation.
 */

/** Computes player level from total XP. Formula: floor(sqrt(xp / 100)) + 1 */
export function computeLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/** Returns true when two dates fall on different UTC calendar days */
export function isDifferentDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() !== b.getUTCFullYear() ||
    a.getUTCMonth() !== b.getUTCMonth() ||
    a.getUTCDate() !== b.getUTCDate()
  );
}
