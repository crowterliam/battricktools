import { skillName } from "./skills";

export interface YouthPlayerInput {
  age: number;
  stamina: number;
  batting: number;
  bowling: number;
  keeping: number;
  fielding: number;
  concentration: number;
  consistency: number;
  isBatsman: boolean;
  isBowler: boolean;
  isKeeper: boolean;
}

export type PullGrade = "S" | "A" | "B" | "C" | "D" | "F";

export interface SkillRating {
  skill: string;
  level: number;
  name: string;
  score: number;
  weight: number;
}

export interface YouthRating {
  grade: PullGrade;
  totalScore: number;
  maxScore: number;
  percentage: number;
  assessment: string;
  primarySkill: { name: string; level: number };
  skillRatings: SkillRating[];
  recommendation: string;
  trainability: string;
}

/**
 * Rate a youth pull based on skill levels, weighted by importance.
 *
 * Weights reflect community consensus:
 * - Primary skill (batting/bowling): dominant factor
 * - Keeping: critical if keeper, minor otherwise
 * - Secondary (conc/cons): significant for long-term value
 * - Stamina: important for longevity
 * - Fielding: minor bonus
 */
export function rateYouthPull(input: YouthPlayerInput): YouthRating {
  const { age, stamina, batting, bowling, keeping, fielding, concentration, consistency, isBatsman, isBowler, isKeeper } = input;

  const skillRatings: SkillRating[] = [];

  const primaryBat = isBatsman ? 3.0 : isBowler ? 1.0 : 0.5;
  const primaryBowl = isBowler ? 3.0 : isBatsman ? 1.0 : 0.5;
  const keepWeight = isKeeper ? 2.5 : 0.3;

  skillRatings.push({ skill: "Batting", level: batting, name: skillName(batting), score: batting * primaryBat, weight: primaryBat });
  skillRatings.push({ skill: "Bowling", level: bowling, name: skillName(bowling), score: bowling * primaryBowl, weight: primaryBowl });
  skillRatings.push({ skill: "Keeping", level: keeping, name: skillName(keeping), score: keeping * keepWeight, weight: keepWeight });
  skillRatings.push({ skill: "Concentration", level: concentration, name: skillName(concentration), score: concentration * 1.5, weight: 1.5 });
  skillRatings.push({ skill: "Consistency", level: consistency, name: skillName(consistency), score: consistency * 1.5, weight: 1.5 });
  skillRatings.push({ skill: "Stamina", level: stamina, name: skillName(stamina), score: stamina * 1.0, weight: 1.0 });
  skillRatings.push({ skill: "Fielding", level: fielding, name: skillName(fielding), score: fielding * 0.5, weight: 0.5 });

  const totalScore = skillRatings.reduce((sum, s) => sum + s.score, 0);
  const maxWeight = skillRatings.reduce((sum, s) => sum + s.weight, 0);
  const maxScore = maxWeight * 20;
  const percentage = (totalScore / maxScore) * 100;

  const grade: PullGrade =
    percentage >= 70 ? "S" :
    percentage >= 55 ? "A" :
    percentage >= 42 ? "B" :
    percentage >= 30 ? "C" :
    percentage >= 20 ? "D" : "F";

  const primarySkillLevel = Math.max(
    isBatsman ? batting : 0,
    isBowler ? bowling : 0,
  );
  const primarySkillName = isBatsman && isBowler
    ? (batting >= bowling ? "Batting" : "Bowling")
    : isBatsman ? "Batting"
    : isBowler ? "Bowling"
    : "None";

  const assessment =
    grade === "S" ? "Generational pull — elite talent with outstanding skills for their age." :
    grade === "A" ? "Excellent pull — strong primary skills and good secondaries. A definite keeper." :
    grade === "B" ? "Solid pull — worth training. Has clear potential in their primary role." :
    grade === "C" ? "Average pull — trainable but unremarkable. Consider listing if squad is full." :
    grade === "D" ? "Below-average pull — weak skills. Only train if desperate for depth." :
    "Poor pull — minimal talent. List or release.";

  const ageBonus = age <= 17 ? "Maximum training window (4+ seasons of youth training ahead)." :
    age === 18 ? "Good training window remaining." :
    age === 19 ? "Limited training window — prioritize key skills." :
    "Minimal training window — most growth already happened.";

  const recommendation =
    grade === "S" || grade === "A" ? "Train immediately. Allocate primary nets now — this is a future star." :
    grade === "B" ? `Train as ${primarySkillName.toLowerCase()}. Worth 2-3 nets if squad allows.` :
    grade === "C" ? `Borderline. Train only if you need ${primarySkillName.toLowerCase()} depth, otherwise list for transfer.` :
    "List for transfer or release. Not worth the net investment.";

  return {
    grade,
    totalScore,
    maxScore,
    percentage,
    assessment,
    primarySkill: { name: primarySkillName, level: primarySkillLevel },
    skillRatings,
    recommendation,
    trainability: ageBonus,
  };
}
