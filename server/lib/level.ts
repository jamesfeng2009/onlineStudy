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

const STREAK_TIMEZONE = "Asia/Shanghai";

function dateStr(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STREAK_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

export function computeStreakFromLastActive(lastActive: Date, currentStreak: number): {
  streak: number;
  lastActive: Date;
} {
  const todayStr = dateStr(new Date());
  const yestStr = dateStr(addDays(new Date(), -1));
  const laStr = dateStr(lastActive);

  if (laStr === todayStr) {
    return { streak: currentStreak, lastActive: new Date() };
  }
  if (laStr === yestStr) {
    return { streak: currentStreak + 1, lastActive: new Date() };
  }
  return { streak: 1, lastActive: new Date() };
}
