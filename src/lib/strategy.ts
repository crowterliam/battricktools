export type NetType = "primary" | "secondary";
export type Recommendation = "train" | "caution" | "stop";

export interface StrategyInput {
  age: number;
  nets: number;
  netType: NetType;
  traineeCount: number;
  generational?: boolean;
}

export interface RuleResult {
  id: string;
  title: string;
  passed: boolean;
  message: string;
}

export interface StrategyEvaluation {
  rules: RuleResult[];
  recommendation: Recommendation;
  summary: string;
}

/**
 * Rule 1 — The Age 21 Freezecap:
 * Cut all primary nets on players aged 21+ unless they are a
 * generational talent finishing an elite milestone pop.
 */
function evaluateAgeFreezecap(input: StrategyInput): RuleResult {
  const { age, netType, generational } = input;

  if (netType === "secondary") {
    return {
      id: "age-freezecap",
      title: "Age 21 Freezecap",
      passed: true,
      message: "Freezecap applies to primary nets only — secondary training is fine.",
    };
  }

  if (age < 21) {
    return {
      id: "age-freezecap",
      title: "Age 21 Freezecap",
      passed: true,
      message: `Player is ${age} — well within the optimal training window (17–20).`,
    };
  }

  if (age === 21) {
    return {
      id: "age-freezecap",
      title: "Age 21 Freezecap",
      passed: false,
      message:
        "Player has hit the freezecap. Only continue for generational players finishing an elite milestone pop.",
    };
  }

  if (generational) {
    return {
      id: "age-freezecap",
      title: "Age 21 Freezecap",
      passed: true,
      message:
        "Freezecap reached, but flagged as generational — continue only to finish the current milestone pop.",
    };
  }

  return {
    id: "age-freezecap",
    title: "Age 21 Freezecap",
    passed: false,
    message: `Player is ${age} and past the freezecap. Cut primary nets immediately.`,
  };
}

/**
 * Rule 2 — The Mono-Training Cap:
 * Maintain a maximum of 2–3 youth trainees simultaneously per season.
 */
function evaluateMonoTrainingCap(input: StrategyInput): RuleResult {
  const { traineeCount } = input;

  if (traineeCount <= 3) {
    return {
      id: "mono-training",
      title: "Mono-Training Cap",
      passed: true,
      message: `${traineeCount} trainee${traineeCount === 1 ? "" : "s"} — within the recommended 2–3 player cap.`,
    };
  }

  return {
    id: "mono-training",
    title: "Mono-Training Cap",
    passed: false,
    message: `${traineeCount} trainees exceeds the 3-player cap. Spreading nets this thin ruins efficiency.`,
  };
}

/**
 * Rule 3 — The Target Pipeline:
 * Run 3 primary nets + 1 secondary net, with 10 coaches and 3–5 sports psychologists.
 */
function evaluatePipeline(input: StrategyInput): RuleResult {
  const { netType, nets } = input;

  if (netType === "primary" && nets > 3) {
    return {
      id: "pipeline",
      title: "Target Pipeline",
      passed: false,
      message:
        "More than 3 primary nets on a single player is inefficient over-stacking. Redistribute to the pipeline.",
    };
  }

  return {
    id: "pipeline",
    title: "Target Pipeline",
    passed: true,
    message: `Allocation looks healthy. Ideal pipeline: 3 primary nets + 1 secondary, 10 coaches, 3–5 sports psychologists.`,
  };
}

export function evaluateStrategy(input: StrategyInput): StrategyEvaluation {
  const rules = [
    evaluateAgeFreezecap(input),
    evaluateMonoTrainingCap(input),
    evaluatePipeline(input),
  ];

  const failures = rules.filter((r) => !r.passed);
  const recommendation: Recommendation =
    failures.length === 0 ? "train" : failures.length === 1 ? "caution" : "stop";

  const summary =
    recommendation === "train"
      ? "All strategic rules pass — this player is a good training target."
      : recommendation === "caution"
        ? "One rule flag — proceed with caution or adjust your setup."
        : "Multiple rule violations — training this player is strongly discouraged.";

  return { rules, recommendation, summary };
}
