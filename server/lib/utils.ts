export const clamp = (n: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, n));
