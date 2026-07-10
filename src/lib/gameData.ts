/**
 * Community-sourced training pop-timing data.
 *
 * Source: Battrick Rules page (Section 9 — Nets), originally compiled by
 * the community (Kris Hateley / RPubs and others). These are real-world
 * observed mean weeks-to-pop, NOT the game engine's internal formulas.
 *
 * The game engine's actual training algorithm is undisclosed. These tables
 * represent the best available community consensus from crowdsourced
 * observation data.
 *
 * Training rate DOES vary by both age and skill level — younger players
 * train technical skills faster, and higher skill levels take longer to pop.
 */

export interface PopDataPoint {
  age: number;
  level: number;
  weeks: number;
}

/**
 * Primary skill table (batting / bowling) — mean weeks to pop, 1 net.
 * Rows: ages 17–27. Columns: skill levels 2–20.
 * 0 / missing values omitted (no community data for that cell).
 */
export const PRIMARY_DATA: PopDataPoint[] = [
  // Age 17
  { age: 17, level: 2, weeks: 2.33 },
  { age: 17, level: 3, weeks: 5.5 },
  { age: 17, level: 4, weeks: 6 },
  { age: 17, level: 7, weeks: 9.8 },
  { age: 17, level: 8, weeks: 10.23 },
  { age: 17, level: 9, weeks: 10.5 },
  // Age 18
  { age: 18, level: 2, weeks: 2 },
  { age: 18, level: 4, weeks: 7 },
  { age: 18, level: 5, weeks: 8 },
  { age: 18, level: 6, weeks: 9 },
  { age: 18, level: 7, weeks: 10.5 },
  { age: 18, level: 8, weeks: 10.17 },
  { age: 18, level: 9, weeks: 10.58 },
  { age: 18, level: 10, weeks: 10.67 },
  { age: 18, level: 11, weeks: 10.96 },
  { age: 18, level: 12, weeks: 10.88 },
  // Age 19
  { age: 19, level: 8, weeks: 10 },
  { age: 19, level: 9, weeks: 10.43 },
  { age: 19, level: 10, weeks: 11.23 },
  { age: 19, level: 11, weeks: 10.78 },
  { age: 19, level: 12, weeks: 11.6 },
  { age: 19, level: 13, weeks: 11.44 },
  // Age 20
  { age: 20, level: 8, weeks: 11 },
  { age: 20, level: 10, weeks: 11 },
  { age: 20, level: 11, weeks: 11.2 },
  { age: 20, level: 12, weeks: 11.4 },
  { age: 20, level: 13, weeks: 11.22 },
  { age: 20, level: 14, weeks: 11.78 },
  { age: 20, level: 15, weeks: 12.1 },
  { age: 20, level: 16, weeks: 12.5 },
  // Age 21
  { age: 21, level: 3, weeks: 6 },
  { age: 21, level: 4, weeks: 9 },
  { age: 21, level: 6, weeks: 11 },
  { age: 21, level: 10, weeks: 12 },
  { age: 21, level: 11, weeks: 12 },
  { age: 21, level: 12, weeks: 12.33 },
  { age: 21, level: 13, weeks: 11.67 },
  { age: 21, level: 14, weeks: 12.25 },
  { age: 21, level: 15, weeks: 12.25 },
  { age: 21, level: 16, weeks: 13.72 },
  { age: 21, level: 17, weeks: 13.5 },
  { age: 21, level: 18, weeks: 15 },
  // Age 22
  { age: 22, level: 5, weeks: 10 },
  { age: 22, level: 6, weeks: 12 },
  { age: 22, level: 7, weeks: 12.5 },
  { age: 22, level: 13, weeks: 13.6 },
  { age: 22, level: 14, weeks: 13.6 },
  { age: 22, level: 15, weeks: 14 },
  { age: 22, level: 16, weeks: 14.38 },
  { age: 22, level: 17, weeks: 17.25 },
  { age: 22, level: 18, weeks: 21 },
  // Age 23
  { age: 23, level: 6, weeks: 12 },
  { age: 23, level: 7, weeks: 15 },
  { age: 23, level: 8, weeks: 16 },
  { age: 23, level: 13, weeks: 15 },
  { age: 23, level: 14, weeks: 14 },
  { age: 23, level: 15, weeks: 15.67 },
  { age: 23, level: 16, weeks: 17.5 },
  { age: 23, level: 17, weeks: 18 },
  { age: 23, level: 18, weeks: 21.75 },
  { age: 23, level: 19, weeks: 27 },
  // Age 24
  { age: 24, level: 13, weeks: 17 },
  { age: 24, level: 15, weeks: 20 },
  { age: 24, level: 16, weeks: 19.67 },
  { age: 24, level: 17, weeks: 21.67 },
  { age: 24, level: 18, weeks: 26.75 },
  { age: 24, level: 19, weeks: 35.5 },
  // Age 25
  { age: 25, level: 6, weeks: 17 },
  { age: 25, level: 13, weeks: 22 },
  { age: 25, level: 14, weeks: 21 },
  { age: 25, level: 15, weeks: 26 },
  { age: 25, level: 17, weeks: 23.67 },
  { age: 25, level: 19, weeks: 22 },
  // Age 26
  { age: 26, level: 16, weeks: 28.5 },
  { age: 26, level: 17, weeks: 26 },
  { age: 26, level: 19, weeks: 40.5 },
  // Age 27
  { age: 27, level: 19, weeks: 46.5 },
];

/**
 * Secondary skill table (concentration / consistency) — mean weeks to pop.
 * Note: secondary training gets FASTER with age (older players improve
 * mental skills quicker), the opposite of primary training.
 */
export const SECONDARY_DATA: PopDataPoint[] = [
  // Age 17
  { age: 17, level: 10, weeks: 19.5 },
  // Age 18
  { age: 18, level: 4, weeks: 16.5 },
  { age: 18, level: 5, weeks: 17.2 },
  { age: 18, level: 6, weeks: 14.44 },
  { age: 18, level: 7, weeks: 17.17 },
  { age: 18, level: 8, weeks: 18 },
  { age: 18, level: 9, weeks: 18 },
  // Age 19
  { age: 19, level: 4, weeks: 15.5 },
  { age: 19, level: 5, weeks: 16 },
  { age: 19, level: 6, weeks: 15 },
  { age: 19, level: 7, weeks: 14.67 },
  { age: 19, level: 8, weeks: 14 },
  { age: 19, level: 10, weeks: 16 },
  // Age 20
  { age: 20, level: 6, weeks: 12.5 },
  { age: 20, level: 7, weeks: 13.17 },
  { age: 20, level: 8, weeks: 13.5 },
  { age: 20, level: 9, weeks: 12.62 },
  { age: 20, level: 10, weeks: 15 },
  { age: 20, level: 11, weeks: 12.5 },
  { age: 20, level: 12, weeks: 13 },
  // Age 21
  { age: 21, level: 4, weeks: 12 },
  { age: 21, level: 7, weeks: 12 },
  { age: 21, level: 8, weeks: 12.1 },
  { age: 21, level: 9, weeks: 12.25 },
  { age: 21, level: 10, weeks: 12.5 },
  { age: 21, level: 11, weeks: 16.5 },
  // Age 22
  { age: 22, level: 4, weeks: 11 },
  { age: 22, level: 9, weeks: 10 },
  { age: 22, level: 10, weeks: 11.17 },
  { age: 22, level: 11, weeks: 11.25 },
  { age: 22, level: 12, weeks: 15 },
  { age: 22, level: 13, weeks: 10.5 },
  { age: 22, level: 14, weeks: 11 },
  { age: 22, level: 15, weeks: 12 },
  // Age 23
  { age: 23, level: 5, weeks: 10.5 },
  { age: 23, level: 10, weeks: 11 },
  { age: 23, level: 11, weeks: 11.75 },
  { age: 23, level: 12, weeks: 10.5 },
  { age: 23, level: 13, weeks: 8.5 },
  { age: 23, level: 14, weeks: 10.25 },
  { age: 23, level: 15, weeks: 10.5 },
  { age: 23, level: 16, weeks: 9 },
  { age: 23, level: 17, weeks: 10.5 },
  // Age 24
  { age: 24, level: 5, weeks: 10 },
  { age: 24, level: 13, weeks: 10.5 },
  { age: 24, level: 14, weeks: 12.38 },
  { age: 24, level: 15, weeks: 9.5 },
  { age: 24, level: 16, weeks: 12.1 },
  { age: 24, level: 17, weeks: 9.62 },
  { age: 24, level: 18, weeks: 9 },
  { age: 24, level: 19, weeks: 8.25 },
  { age: 24, level: 20, weeks: 10 },
  // Age 25
  { age: 25, level: 15, weeks: 9 },
  { age: 25, level: 16, weeks: 9 },
  { age: 25, level: 17, weeks: 9 },
  { age: 25, level: 18, weeks: 9 },
  // Age 26
  { age: 26, level: 17, weeks: 9 },
  // Age 27
  { age: 27, level: 18, weeks: 8 },
];

export const PRIMARY_AGES = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
export const PRIMARY_LEVELS = Array.from({ length: 19 }, (_, i) => i + 2);
export const SECONDARY_LEVELS = Array.from({ length: 17 }, (_, i) => i + 4);

export interface InterpolatedResult {
  weeks: number;
  source: "exact" | "interpolated" | "extrapolated";
  confidence: "high" | "medium" | "low";
  nearestPoint?: PopDataPoint;
}

/**
 * Inverse-distance-weighted interpolation over sparse 2D community data.
 * Finds nearby observed points and weights them by distance in (age, level) space.
 */
export function interpolatePop(
  data: PopDataPoint[],
  age: number,
  level: number,
  levelWeight = 0.5,
  power = 2.5,
): InterpolatedResult {
  const exact = data.find((p) => p.age === age && p.level === level);
  if (exact) {
    return { weeks: exact.weeks, source: "exact", confidence: "high", nearestPoint: exact };
  }

  let weightedSum = 0;
  let weightSum = 0;
  let minDist = Infinity;
  let nearest: PopDataPoint | undefined;

  for (const point of data) {
    const dAge = point.age - age;
    const dLevel = (point.level - level) * levelWeight;
    const dist = Math.sqrt(dAge * dAge + dLevel * dLevel);

    if (dist < 0.01) {
      return { weeks: point.weeks, source: "exact", confidence: "high", nearestPoint: point };
    }

    if (dist < minDist) {
      minDist = dist;
      nearest = point;
    }

    const weight = 1 / Math.pow(dist, power);
    weightedSum += weight * point.weeks;
    weightSum += weight;
  }

  const weeks = weightedSum / weightSum;
  const inDataRange =
    age >= 17 && age <= 27 && level >= 2 && level <= 20;

  const confidence: InterpolatedResult["confidence"] =
    minDist < 2 ? "high" : minDist < 5 ? "medium" : "low";

  return {
    weeks,
    source: inDataRange ? "interpolated" : "extrapolated",
    confidence,
    nearestPoint: nearest,
  };
}

export function getPrimaryWeeks(age: number, level: number): InterpolatedResult {
  return interpolatePop(PRIMARY_DATA, age, level);
}

export function getSecondaryWeeks(age: number, level: number): InterpolatedResult {
  return interpolatePop(SECONDARY_DATA, age, level, 0.5, 2.0);
}
