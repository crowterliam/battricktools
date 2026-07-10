/**
 * Youth Academy ITS (Intensive Training Session) allocation data.
 *
 * Source: Wombat's ITS Allocation Guide — a famous community lookup table.
 * Two contributors (Wombat and zinc) tracked how many ITS sessions are
 * needed to reach a specific internal skill level at ages 17–20.
 *
 * The "sublevel" is the precise internal decimal value of the skill
 * (e.g., 6.50 = Competent at the halfway mark). ITS needed increases
 * with both skill level and age.
 *
 * Game rules: max 12 ITS per skill, limited by academy condition and age.
 * ITS cost £2,000 each (max 10/week, max 100 stored).
 */

export interface ItsDataPoint {
  internalLevel: number;
  condition: string;
  source: "wombat" | "zinc";
  itsByAge: { 17: number; 18: number; 19: number; 20: number };
}

export const ITS_DATA: ItsDataPoint[] = [
  { internalLevel: 1.0, condition: "Worthless", source: "wombat", itsByAge: { 17: 10, 18: 12, 19: 14, 20: 16 } },
  { internalLevel: 1.89, condition: "Worthless", source: "wombat", itsByAge: { 17: 14, 18: 15, 19: 18, 20: 20 } },
  { internalLevel: 2.78, condition: "Abysmal", source: "wombat", itsByAge: { 17: 17, 18: 19, 19: 21, 20: 25 } },
  { internalLevel: 2.9, condition: "Abysmal", source: "zinc", itsByAge: { 17: 18, 18: 19, 19: 22, 20: 25 } },
  { internalLevel: 3.67, condition: "Woeful", source: "wombat", itsByAge: { 17: 20, 18: 22, 19: 25, 20: 29 } },
  { internalLevel: 3.8, condition: "Woeful", source: "zinc", itsByAge: { 17: 21, 18: 23, 19: 25, 20: 29 } },
  { internalLevel: 4.56, condition: "Feeble", source: "wombat", itsByAge: { 17: 23, 18: 25, 19: 28, 20: 32 } },
  { internalLevel: 4.7, condition: "Feeble", source: "zinc", itsByAge: { 17: 24, 18: 26, 19: 28, 20: 33 } },
  { internalLevel: 5.45, condition: "Mediocre", source: "wombat", itsByAge: { 17: 26, 18: 28, 19: 31, 20: 36 } },
  { internalLevel: 5.6, condition: "Mediocre", source: "zinc", itsByAge: { 17: 26, 18: 28, 19: 31, 20: 36 } },
  { internalLevel: 6.34, condition: "Competent", source: "wombat", itsByAge: { 17: 28, 18: 31, 19: 34, 20: 39 } },
  { internalLevel: 6.5, condition: "Competent", source: "zinc", itsByAge: { 17: 29, 18: 31, 19: 34, 20: 39 } },
  { internalLevel: 7.23, condition: "Respectable", source: "wombat", itsByAge: { 17: 30, 18: 33, 19: 36, 20: 41 } },
  { internalLevel: 7.4, condition: "Respectable", source: "zinc", itsByAge: { 17: 31, 18: 33, 19: 36, 20: 42 } },
  { internalLevel: 8.12, condition: "Proficient", source: "wombat", itsByAge: { 17: 32, 18: 35, 19: 38, 20: 44 } },
  { internalLevel: 8.3, condition: "Proficient", source: "zinc", itsByAge: { 17: 32, 18: 35, 19: 38, 20: 44 } },
  { internalLevel: 9.01, condition: "Strong", source: "wombat", itsByAge: { 17: 34, 18: 37, 19: 40, 20: 46 } },
  { internalLevel: 9.2, condition: "Strong", source: "zinc", itsByAge: { 17: 34, 18: 37, 19: 40, 20: 46 } },
  { internalLevel: 9.9, condition: "Strong", source: "wombat", itsByAge: { 17: 35, 18: 38, 19: 42, 20: 48 } },
  { internalLevel: 10.1, condition: "Superb", source: "zinc", itsByAge: { 17: 35, 18: 38, 19: 42, 20: 48 } },
  { internalLevel: 10.79, condition: "Superb", source: "wombat", itsByAge: { 17: 35, 18: 39, 19: 43, 20: 49 } },
];

export type YouthAge = 17 | 18 | 19 | 20;

/**
 * Linear interpolation between two ITS data points for a given age.
 * Merges Wombat and zinc data by averaging where both exist at the same
 * internal level (they're very close).
 */
export function getItsNeeded(internalLevel: number, age: YouthAge): number {
  const sorted = [...ITS_DATA].sort((a, b) => a.internalLevel - b.internalLevel);

  if (internalLevel <= sorted[0].internalLevel) {
    return sorted[0].itsByAge[age];
  }
  if (internalLevel >= sorted[sorted.length - 1].internalLevel) {
    return sorted[sorted.length - 1].itsByAge[age];
  }

  let lower = sorted[0];
  let upper = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].internalLevel <= internalLevel && sorted[i + 1].internalLevel >= internalLevel) {
      lower = sorted[i];
      upper = sorted[i + 1];
      break;
    }
  }

  const t = (internalLevel - lower.internalLevel) / (upper.internalLevel - lower.internalLevel);
  return Math.round(lower.itsByAge[age] + t * (upper.itsByAge[age] - lower.itsByAge[age]));
}

/**
 * Reverse lookup: given a budget of ITS and an age, what's the highest
 * achievable internal skill level?
 */
export function getMaxLevel(itsBudget: number, age: YouthAge): { internalLevel: number; condition: string; sublevel: number } {
  const sorted = [...ITS_DATA].sort((a, b) => a.internalLevel - b.internalLevel);

  let best = sorted[0];
  for (const point of sorted) {
    if (point.itsByAge[age] <= itsBudget) {
      best = point;
    } else {
      const t = (itsBudget - best.itsByAge[age]) / (point.itsByAge[age] - best.itsByAge[age]);
      const interpLevel = best.internalLevel + t * (point.internalLevel - best.internalLevel);
      return {
        internalLevel: interpLevel,
        condition: skillCondition(interpLevel),
        sublevel: interpLevel - Math.floor(interpLevel),
      };
    }
  }

  return {
    internalLevel: best.internalLevel,
    condition: best.condition,
    sublevel: best.internalLevel - Math.floor(best.internalLevel),
  };
}

export function skillCondition(internalLevel: number): string {
  const conditions = [
    "Useless", "Worthless", "Abysmal", "Woeful", "Feeble",
    "Mediocre", "Competent", "Respectable", "Proficient", "Strong",
    "Superb",
  ];
  const idx = Math.max(0, Math.min(10, Math.floor(internalLevel)));
  return conditions[idx];
}

export const MAX_ITS_PER_SKILL = 12;
export const MAX_ITS_STORED = 100;
export const ITS_COST = 2000;
export const MAX_ITS_PER_WEEK = 10;
