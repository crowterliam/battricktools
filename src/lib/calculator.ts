import { ageAbsorption, netEfficiency, netPower, type FormulaConstants } from "./formulas";
import { interpolateWeeks, type InterpolatedTiming } from "./popTimings";
import { skillName, skillTier } from "./skills";
import { evaluateStrategy, type Recommendation, type StrategyEvaluation, type NetType } from "./strategy";

export interface CalculatorInput {
  age: number;
  level: number;
  nets: number;
  netType: NetType;
  traineeCount: number;
  generational: boolean;
  constants: FormulaConstants;
}

export interface CalculatorResult {
  singleNetWeeks: InterpolatedTiming;
  estimatedWeeks: number;
  ageAbsorptionPct: number;
  netPowerValue: number;
  netEfficiencyPct: number;
  perNetPower: number;
  levelName: string;
  tier: string;
  strategy: StrategyEvaluation;
  recommendation: Recommendation;
  breakdown: BreakdownRow[];
}

export interface BreakdownRow {
  label: string;
  value: string;
  tone: "positive" | "neutral" | "warning" | "danger";
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const { age, level, nets, netType, traineeCount, generational, constants } = input;

  const singleNet = interpolateWeeks(age, level);
  const power = netPower(nets, constants.netDecay);
  const efficiency = netEfficiency(nets, constants.netDecay);
  const absorption = ageAbsorption(age, constants.ageSteepness, constants.ageCliff);

  const secondaryFactor = netType === "secondary" ? 2.0 : 1.0;
  const estimatedWeeks = (singleNet.weeks * secondaryFactor) / power;

  const strategy = evaluateStrategy({ age, nets, netType, traineeCount, generational });

  const tier = skillTier(level);

  const absorptionTone: BreakdownRow["tone"] =
    absorption > 0.8 ? "positive" : absorption > 0.45 ? "warning" : "danger";

  const efficiencyTone: BreakdownRow["tone"] =
    nets <= 3 ? "positive" : "warning";

  const breakdown: BreakdownRow[] = [
    {
      label: "Single-net baseline",
      value: `${singleNet.weeks.toFixed(1)} weeks`,
      tone: "neutral",
    },
    {
      label: "Age absorption",
      value: `${(absorption * 100).toFixed(0)}%`,
      tone: absorptionTone,
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
  ];

  return {
    singleNetWeeks: singleNet,
    estimatedWeeks,
    ageAbsorptionPct: absorption * 100,
    netPowerValue: power,
    netEfficiencyPct: efficiency * 100,
    perNetPower: power / nets,
    levelName: skillName(level),
    tier,
    strategy,
    recommendation: strategy.recommendation,
    breakdown,
  };
}
