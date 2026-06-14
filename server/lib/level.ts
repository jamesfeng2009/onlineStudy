export function addExpAndLevelUp(
  currentLevel: number,
  currentExp: number,
  gainedExp: number
): { level: number; exp: number } {
  let exp = currentExp + gainedExp;
  let level = currentLevel;
  while (exp >= expToNextLevel(level)) {
    exp -= expToNextLevel(level);
    level += 1;
  }
  return { level, exp };
}

function expToNextLevel(level: number): number {
  return 50 + level * 50;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function computeStreakFromLastActive(lastActive: Date, currentStreak: number): {
  streak: number;
  lastActive: Date;
} {
  const today = startOfDay(new Date());
  const yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  const la = startOfDay(lastActive);

  if (la.getTime() === today.getTime()) {
    return { streak: currentStreak, lastActive: new Date() };
  }
  if (la.getTime() === yest.getTime()) {
    return { streak: currentStreak + 1, lastActive: new Date() };
  }
  return { streak: 1, lastActive: new Date() };
}
