export interface PopTimingEntry {
  age: number;
  level: number;
  weeks: number;
}

/**
 * Crowdsourced single-net pop timings (mean weeks).
 * Source: Battrick Training Times Analysis (RPubs).
 */
export const POP_TIMINGS: PopTimingEntry[] = [
  { age: 17, level: 7, weeks: 9.8 },
  { age: 18, level: 7, weeks: 10.5 },
  { age: 18, level: 12, weeks: 10.88 },
  { age: 19, level: 12, weeks: 11.6 },
  { age: 20, level: 7, weeks: 11.0 },
  { age: 20, level: 12, weeks: 11.4 },
  { age: 21, level: 12, weeks: 12.33 },
  { age: 22, level: 7, weeks: 12.5 },
  { age: 22, level: 19, weeks: 21.0 },
  { age: 23, level: 7, weeks: 15.0 },
  { age: 23, level: 19, weeks: 21.75 },
  { age: 23, level: 20, weeks: 27.0 },
  { age: 24, level: 19, weeks: 26.75 },
  { age: 24, level: 20, weeks: 35.5 },
  { age: 26, level: 20, weeks: 40.5 },
  { age: 27, level: 20, weeks: 46.5 },
];

export const TABLE_AGES = [17, 18, 19, 20, 21, 22, 23, 24, 26, 27];
export const TABLE_LEVELS = [7, 12, 19, 20];

export function getTableValue(age: number, level: number): number | null {
  const entry = POP_TIMINGS.find((e) => e.age === age && e.level === level);
  return entry ? entry.weeks : null;
}

export interface InterpolatedTiming {
  weeks: number;
  source: "exact" | "interpolated" | "extrapolated";
  confidence: "high" | "medium" | "low";
}

/**
 * Interpolate single-net pop weeks for any (age, level) using
 * inverse-distance weighting over the crowdsourced data points.
 */
export function interpolateWeeks(age: number, level: number): InterpolatedTiming {
  const exact = getTableValue(age, level);
  if (exact !== null) {
    return { weeks: exact, source: "exact", confidence: "high" };
  }

  const levelWeight = 0.45;
  const power = 2.5;

  let weightedSum = 0;
  let weightSum = 0;
  let minDist = Infinity;

  for (const entry of POP_TIMINGS) {
    const dAge = entry.age - age;
    const dLevel = (entry.level - level) * levelWeight;
    const dist = Math.sqrt(dAge * dAge + dLevel * dLevel);

    minDist = Math.min(minDist, dist);

    const weight = 1 / Math.pow(dist, power);
    weightedSum += weight * entry.weeks;
    weightSum += weight;
  }

  const weeks = weightedSum / weightSum;
  const inTableRange =
    age >= TABLE_AGES[0] &&
    age <= TABLE_AGES[TABLE_AGES.length - 1] &&
    level >= TABLE_LEVELS[0] &&
    level <= TABLE_LEVELS[TABLE_LEVELS.length - 1];

  const confidence: InterpolatedTiming["confidence"] =
    minDist < 2 ? "high" : minDist < 5 ? "medium" : "low";

  return {
    weeks,
    source: inTableRange ? "interpolated" : "extrapolated",
    confidence,
  };
}
