import type { UserStats } from './types';

export const XP_PER_TASK = 10;
export const XP_PER_SUGGESTED_TASK = 15; // Bonus XP for suggested tasks
const XP_FOR_NEXT_LEVEL_BASE = 50;

export function calculateXpToNextLevel(level: number): number {
  return (level * XP_FOR_NEXT_LEVEL_BASE) + XP_FOR_NEXT_LEVEL_BASE;
}

export function checkLevelUp(stats: UserStats): UserStats {
  let { xp, level, xpToNextLevel } = stats;
  let leveledUp = false;
  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level += 1;
    xpToNextLevel = calculateXpToNextLevel(level);
    leveledUp = true;
  }
  // If leveled up, ensure XP doesn't exceed current xpToNextLevel if it was exact
  if (leveledUp && xp < 0) xp = 0; 
  return { xp, level, xpToNextLevel };
}

export function getInitialUserStats(): UserStats {
  const level = 1;
  return {
    xp: 0,
    level: level,
    xpToNextLevel: calculateXpToNextLevel(level),
  };
}
