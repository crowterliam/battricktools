/**
 * Net stacking ratios and keeping/fielding/stamina timing data.
 *
 * Net stacking ratios derived from community data (training-calc source).
 * Keeping/fielding/stamina data from training-calc — these types only have
 * age-dependent timing (no community skill-level data exists for them).
 *
 * For primary and secondary skills, use gameData.ts which has full
 * age × skill-level community tables.
 */

export type TrainingType =
  | "primary"
  | "secondary"
  | "keeping"
  | "fielding"
  | "stamina";

export const AGES_17_TO_35 = Array.from({ length: 19 }, (_, i) => i + 17);

/**
 * Empirical net stacking power ratios from community data.
 * Each additional net of the same type provides diminishing returns.
 *
 *   N=1: 1.00× (100% per net)  N=2: 1.50× (75%)
 *   N=3: 1.76× (59%)            N=4: 1.88× (47%)
 *
 * To get multi-net weeks: single_net_weeks / power_ratio
 */
export const NET_POWER: Record<number, number> = {
  1: 1.0,
  2: 1.5,
  3: 1.76,
  4: 1.88,
};

export function netStackingPower(nets: number): number {
  return NET_POWER[Math.min(nets, 4)] ?? NET_POWER[4];
}

export function netEfficiency(nets: number): number {
  return netStackingPower(nets) / nets;
}

/**
 * Keeping training times (weeks per pop, single net) — age dependent only.
 * Source: training-calc community data.
 */
const KEEPING_TIMES: Record<number, number[]> = {
  1: [7.4, 8.6, 9.9, 11.2, 12.5, 13.8, 15.1, 16.4, 17.7, 19.0, 20.3, 21.6, 22.9, 24.2, 25.5, 26.8, 28.1, 29.4, 30.7],
  2: [4.9, 7.3, 8.2, 9.2, 10.3, 11.4, 12.5, 13.6, 14.7, 15.7, 17.0, 18.3, 19.6, 20.9, 22.2, 23.5, 24.8, 26.1, 27.1],
};

/**
 * Fielding training times (weeks per pop, single net) — age dependent only.
 */
const FIELDING_TIMES: Record<number, number[]> = {
  1: [6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7, 13.8, 14.9, 16.0, 17.1, 18.2, 19.3, 20.4, 21.5, 22.6, 23.7, 24.8, 25.9],
  2: [4.2, 5.3, 6.4, 7.5, 8.6, 9.7, 10.8, 11.9, 13.1, 14.1, 15.2, 16.3, 17.4, 18.5, 19.6, 20.7, 21.8, 22.9, 24.0],
};

/**
 * Stamina training times (weeks per pop, single net) — constant until age 33.
 */
const STAMINA_TIMES: Record<number, number[]> = {
  1: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9.5, 11.1, 14.9],
  2: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5.3, 5.7, 6.6],
};

export const NET_LIMITS: Record<TrainingType, number> = {
  primary: 4,
  secondary: 3,
  keeping: 2,
  fielding: 2,
  stamina: 2,
};

export const TRAINING_TYPE_LABELS: Record<TrainingType, string> = {
  primary: "Primary (Batting / Bowling)",
  secondary: "Secondary (Concentration / Consistency)",
  keeping: "Wicket Keeping",
  fielding: "Fielding (Individual)",
  stamina: "Stamina (Individual)",
};

export interface WeeksResult {
  weeks: number;
  source: "exact" | "interpolated" | "unavailable";
  note?: string;
}

export function getSimpleWeeks(
  type: "keeping" | "fielding" | "stamina",
  age: number,
  nets: number,
): WeeksResult {
  const tables = { keeping: KEEPING_TIMES, fielding: FIELDING_TIMES, stamina: STAMINA_TIMES };
  const table = tables[type];
  const ageIdx = age - 17;
  const arr = table[nets];

  if (!arr) {
    return { weeks: 0, source: "unavailable", note: `No data for ${nets} nets.` };
  }
  if (ageIdx >= 0 && ageIdx < arr.length) {
    return { weeks: arr[ageIdx], source: "exact" };
  }
  if (arr.length > 0) {
    return { weeks: arr[arr.length - 1], source: "interpolated", note: `Clamped to age ${17 + arr.length - 1}.` };
  }
  return { weeks: 0, source: "unavailable" };
}
