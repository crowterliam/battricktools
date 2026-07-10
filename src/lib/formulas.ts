export interface FormulaConstants {
  base: number;
  thresholdMultiplier: number;
  ageSteepness: number;
  ageCliff: number;
  netDecay: number;
}

/**
 * Default constants calibrated against community data.
 *
 * IMPORTANT CONTEXT: Battrick overhauled training in Season 57 (2021).
 * Before S57, training was SUPER LINEAR — every year of age added exactly
 * one extra week, regardless of skill level (the old Hattrick scheme).
 * Since S57:
 *   - Age effect is non-linear (relatively uniform 17–23, gradual slowdown
 *     to late 20s, then steep decline)
 *   - Skill-level effect is non-linear (exponentially harder at high levels)
 *   - Skill decreases (plopping) start later and vary by skill level
 *
 * netDecay (Formula C, c) is fitted to community net-stacking data (~0.68).
 * The stacking mechanic itself was unchanged by the S57 overhaul.
 */
export const DEFAULT_CONSTANTS: FormulaConstants = {
  base: 1.0,
  thresholdMultiplier: 1.1,
  ageSteepness: 0.55,
  ageCliff: 21.5,
  netDecay: 0.68,
};

/**
 * Formula A — Skill Level Threshold Expansion (Target Curve)
 *
 *   T(L) = a * b^L
 *
 * VALIDATED by the Season 57 overhaul, which made higher skill levels
 * explicitly harder to train: "training speeds will no longer be linear
 * across the entire skill range... from mediocre to competent will be a
 * lot quicker than from sensational to exquisite."
 *
 * Community data confirms this — e.g., age 23: level 13=15 weeks vs
 * level 19=27 weeks.
 */
export function targetPoints(
  level: number,
  base = DEFAULT_CONSTANTS.base,
  thresholdMultiplier = DEFAULT_CONSTANTS.thresholdMultiplier,
): number {
  return base * Math.pow(thresholdMultiplier, level);
}

/**
 * Formula B — Age Degradation Factor (Absorption Multiplier)
 *
 *   alpha(A) = 1 / (1 + e^(k * (A - A_cliff)))
 *
 * VALIDATED as a model by the S57 overhaul, which replaced the old linear
 * "+1 week per year" scheme with a curve that is "pretty uniform from 17
 * to around 23 then slow down a bit till late 20s, then very difficult."
 * The sigmoid approximates this non-linear progression.
 */
export function ageAbsorption(
  age: number,
  ageSteepness = DEFAULT_CONSTANTS.ageSteepness,
  ageCliff = DEFAULT_CONSTANTS.ageCliff,
): number {
  return 1 / (1 + Math.exp(ageSteepness * (age - ageCliff)));
}

/**
 * Formula C — Net Stacking Decay (Logarithmic Diminishing Returns)
 *
 *   M(N) = 1 + ln(N) * c
 *
 * Constant c fitted to community data (~0.68). Per-net efficiency:
 *   N=1: 100%  N=2: 75%  N=3: 59%  N=4: 47%
 *
 * The game rules confirm: "the effectiveness of the sessions will reduce
 * with every duplication... A fourth training session would only provide
 * negligible benefit."
 */
export function netPower(
  nets: number,
  netDecay = DEFAULT_CONSTANTS.netDecay,
): number {
  if (nets <= 1) return 1.0;
  return 1 + Math.log(nets) * netDecay;
}

export function netEfficiency(
  nets: number,
  netDecay = DEFAULT_CONSTANTS.netDecay,
): number {
  return netPower(nets, netDecay) / nets;
}

/**
 * Empirical net power from community data (training-calc source).
 *   N=1: 1.00×  N=2: 1.50×  N=3: 1.76×  N=4: 1.88×
 */
export const EMPIRICAL_NET_POWER: Record<number, { power: number; efficiency: number }> = {
  1: { power: 1.0, efficiency: 1.0 },
  2: { power: 1.5, efficiency: 0.75 },
  3: { power: 1.76, efficiency: 0.587 },
  4: { power: 1.88, efficiency: 0.47 },
};
