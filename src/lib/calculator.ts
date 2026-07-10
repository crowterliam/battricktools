import { ageAbsorption, type FormulaConstants } from "./formulas";
import {
  netStackingPower,
  getSimpleWeeks,
  type TrainingType,
  type WeeksResult,
} from "./trainingData";
import { getPrimaryWeeks, getSecondaryWeeks, type InterpolatedResult } from "./gameData";
import { skillName, skillTier, WEEKS_PER_SEASON } from "./skills";
import {
  evaluateStrategy,
  type Recommendation,
  type StrategyEvaluation,
} from "./strategy";

export interface CalculatorInput {
  age: number;
  level: number;
  nets: number;
  trainingType: TrainingType;
  traineeCount: number;
  generational: boolean;
  constants: FormulaConstants;
  currentWeek: number;
}

export interface SeasonProjection {
  age: number;
  weeks: number;
  weeksPerPop: number;
  pops: number;
  cumulativePops: number;
  projectedLevel: number;
}

export interface TrainingTimeline {
  weeksRemainingThisSeason: number;
  totalWeeksRemaining: number;
  seasons: SeasonProjection[];
  totalPops: number;
  projectedLevelAtFreeze: number;
  pastFreeze: boolean;
}

export interface CalculatorResult {
  singleNet: InterpolatedResult | WeeksResult;
  estimatedWeeks: number;
  ageAbsorptionPct: number;
  netPowerValue: number;
  netEfficiencyPct: number;
  levelName: string;
  tier: string;
  strategy: StrategyEvaluation;
  recommendation: Recommendation;
  breakdown: BreakdownRow[];
  usesSkillLevel: boolean;
  timeline: TrainingTimeline;
}

export interface BreakdownRow {
  label: string;
  value: string;
  tone: "positive" | "neutral" | "warning" | "danger";
}

function getWeeksForAge(
  trainingType: TrainingType,
  age: number,
  level: number,
  nets: number,
): number {
  const power = netStackingPower(nets);
  let base: number;

  if (trainingType === "primary") {
    base = getPrimaryWeeks(age, Math.floor(level)).weeks;
  } else if (trainingType === "secondary") {
    base = getSecondaryWeeks(age, Math.floor(level)).weeks;
  } else {
    const r = getSimpleWeeks(trainingType, age, nets);
    base = r.weeks;
  }

  return base > 0 ? base / power : 0;
}

export function buildTimeline(
  trainingType: TrainingType,
  age: number,
  level: number,
  nets: number,
  currentWeek: number,
  generational: boolean,
): TrainingTimeline {
  const freezeAge = generational ? 99 : 21;
  const weeksRemainingThisSeason = Math.max(0, 17 - currentWeek);

  if (age >= freezeAge) {
    return {
      weeksRemainingThisSeason,
      totalWeeksRemaining: 0,
      seasons: [],
      totalPops: 0,
      projectedLevelAtFreeze: level,
      pastFreeze: true,
    };
  }

  const seasons: SeasonProjection[] = [];
  let cumulativePops = 0;
  let currentLevel = level;
  let totalWeeks = 0;

  const firstSeasonWeeks = weeksRemainingThisSeason;
  if (firstSeasonWeeks > 0) {
    const wpp = getWeeksForAge(trainingType, age, currentLevel, nets);
    const pops = wpp > 0 ? firstSeasonWeeks / wpp : 0;
    cumulativePops += pops;
    currentLevel += pops;
    totalWeeks += firstSeasonWeeks;
    seasons.push({
      age,
      weeks: firstSeasonWeeks,
      weeksPerPop: wpp,
      pops,
      cumulativePops,
      projectedLevel: currentLevel,
    });
  }

  for (let a = age + 1; a < freezeAge; a++) {
    const wpp = getWeeksForAge(trainingType, a, currentLevel, nets);
    if (wpp <= 0) break;
    const pops = WEEKS_PER_SEASON / wpp;
    cumulativePops += pops;
    currentLevel += pops;
    totalWeeks += WEEKS_PER_SEASON;
    seasons.push({
      age: a,
      weeks: WEEKS_PER_SEASON,
      weeksPerPop: wpp,
      pops,
      cumulativePops,
      projectedLevel: currentLevel,
    });
  }

  return {
    weeksRemainingThisSeason,
    totalWeeksRemaining: totalWeeks,
    seasons,
    totalPops: cumulativePops,
    projectedLevelAtFreeze: currentLevel,
    pastFreeze: false,
  };
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const { age, level, nets, trainingType, traineeCount, generational, constants, currentWeek } =
    input;

  let singleNet: InterpolatedResult | WeeksResult;
  let usesSkillLevel: boolean;

  if (trainingType === "primary") {
    singleNet = getPrimaryWeeks(age, level);
    usesSkillLevel = true;
  } else if (trainingType === "secondary") {
    singleNet = getSecondaryWeeks(age, level);
    usesSkillLevel = true;
  } else {
    singleNet = getSimpleWeeks(trainingType, age, nets);
    usesSkillLevel = false;
  }

  const power = netStackingPower(nets);
  const efficiency = power / nets;
  const absorption = ageAbsorption(age, constants.ageSteepness, constants.ageCliff);

  const baseWeeks = "weeks" in singleNet ? singleNet.weeks : 0;
  const estimatedWeeks = baseWeeks > 0 ? baseWeeks / power : 0;

  const strategy = evaluateStrategy({
    age,
    nets,
    netType: trainingType === "secondary" ? "secondary" : "primary",
    traineeCount,
    generational,
  });

  const tier = skillTier(level);
  const timeline = buildTimeline(trainingType, age, level, nets, currentWeek, generational);

  const absorptionTone: BreakdownRow["tone"] =
    absorption > 0.8 ? "positive" : absorption > 0.45 ? "warning" : "danger";

  const efficiencyTone: BreakdownRow["tone"] =
    nets <= 2 ? "positive" : nets === 3 ? "warning" : "danger";

  const breakdown: BreakdownRow[] = [
    {
      label: "Single-net baseline",
      value: baseWeeks > 0 ? `${baseWeeks.toFixed(1)} weeks` : "N/A",
      tone: "neutral",
    },
    {
      label: `Net power (${nets} net${nets > 1 ? "s" : ""})`,
      value: `${power.toFixed(2)}×`,
      tone: efficiencyTone,
    },
    {
      label: "Per-net efficiency",
      value: `${(efficiency * 100).toFixed(0)}%`,
      tone: efficiencyTone,
    },
    {
      label: "Age absorption (modelled)",
      value: `${(absorption * 100).toFixed(0)}%`,
      tone: absorptionTone,
    },
  ];

  return {
    singleNet,
    estimatedWeeks,
    ageAbsorptionPct: absorption * 100,
    netPowerValue: power,
    netEfficiencyPct: efficiency * 100,
    levelName: skillName(level),
    tier,
    strategy,
    recommendation: strategy.recommendation,
    breakdown,
    usesSkillLevel,
    timeline,
  };
}
