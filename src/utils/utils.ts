export const today = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const uuid = () =>
  `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export const lastDays = (n: number) => {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    arr.push(`${y}-${m}-${day}`);
  }
  return arr;
};

export const expToNextLevel = (level: number) => 50 + level * 50;
