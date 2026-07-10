export interface FormulaConstants {
  base: number;
  thresholdMultiplier: number;
  ageSteepness: number;
  ageCliff: number;
  netDecay: number;
}

export const DEFAULT_CONSTANTS: FormulaConstants = {
  base: 1.0,
  thresholdMultiplier: 1.1,
  ageSteepness: 0.55,
  ageCliff: 21.5,
  netDecay: 0.95,
};

/**
 * Formula A — Skill Level Threshold Expansion (Target Curve)
 *
 *   T(L) = a * b^L
 *
 * The baseline training points required to cross into skill level L.
 * Points grow exponentially; high-tier pops demand vastly more input.
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
 * Returns a value in (0, 1] representing the fraction of training a
 * player of age A can absorb per session.  Near 1.0 for ages 17-19,
 * drops through an inflection around 20-21, then steeply declines 22+.
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
 * Total "net power" of stacking N identical nets on one player.
 * Efficiency-per-net drops logarithmically: 3 nets is the sweet spot.
 */
export function netPower(
  nets: number,
  netDecay = DEFAULT_CONSTANTS.netDecay,
): number {
  if (nets <= 1) return 1.0;
  return 1 + Math.log(nets) * netDecay;
}

/** Per-net efficiency when N nets are stacked: M(N) / N. */
export function netEfficiency(
  nets: number,
  netDecay = DEFAULT_CONSTANTS.netDecay,
): number {
  return netPower(nets, netDecay) / nets;
}
