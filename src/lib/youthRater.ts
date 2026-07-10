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
  isPrimary: boolean;
}

export interface YouthRating {
  grade: PullGrade;
  score: number;
  rawScore: number;
  ageMultiplier: number;
  assessment: string;
  primarySkill: { name: string; level: number };
  secondaryPrimary: { name: string; level: number } | null;
  skillRatings: SkillRating[];
  recommendation: string;
  trainability: string;
}

/**
 * Base score from primary skill level.
 */
function primaryBase(level: number): number {
  if (level <= 1) return 0;
  if (level === 2) return 5;
  if (level === 3) return 10;
  if (level === 4) return 18;
  if (level === 5) return 25;
  if (level === 6) return 35;
  if (level === 7) return 45;
  if (level === 8) return 58;
  if (level === 9) return 72;
  if (level >= 10) return Math.min(95, 85 + (level - 10) * 3);
  return 0;
}

/**
 * Stamina is "arguably their most important attribute" (per game rules).
 * Affects in-game tiring, PFL management, and recovery.
 * Max level is 11 (Superb*).
 */
function staminaPoints(level: number): number {
  if (level <= 2) return 0;
  if (level === 3) return 3;
  if (level === 4) return 6;
  if (level === 5) return 9;
  if (level === 6) return 12;
  if (level === 7) return 14;
  return Math.min(18, 14 + (level - 7) * 2);
}

/**
 * Mental skill (concentration/consistency) contribution.
 * These directly affect primary role performance AND fielding/keeping.
 *
 * @param level skill level
 * @param isRoleMatching true if this skill directly boosts the player's role
 *                       (conc for batsmen, cons for bowlers)
 */
function mentalPoints(level: number, isRoleMatching: boolean): number {
  if (level <= 2) return 0;
  const base = level <= 3 ? 2 :
    level === 4 ? 5 :
    level === 5 ? 8 :
    level === 6 ? 12 :
    level === 7 ? 16 :
    level === 8 ? 19 :
    Math.min(22, 19 + (level - 8) * 2);
  return isRoleMatching ? base : Math.round(base * 0.4);
}

/**
 * Fielding matters for all players — "catches win matches."
 */
function fieldingPoints(level: number): number {
  if (level <= 2) return 0;
  if (level === 3) return 2;
  if (level === 4) return 4;
  if (level === 5) return 6;
  if (level === 6) return 7;
  return Math.min(10, 7 + (level - 6));
}

/**
 * Rate a youth pull.
 *
 * Scoring reflects actual attribute roles per game rules:
 * - Primary skill (bat/bowl/keep) is the foundation
 * - Stamina is universally critical (performance, PFL, recovery)
 * - Concentration boosts batting + fielding/keeping for everyone
 * - Consistency boosts bowling + fielding/keeping for everyone
 * - Fielding benefits all players
 *
 * Grade thresholds:
 *   85+ → S (generational)
 *   70+ → A (excellent)
 *   50+ → B (solid, worth training)
 *   30+ → C (average, borderline)
 *   10+ → D (below average)
 *   <10 → F (poor)
 */
export function rateYouthPull(input: YouthPlayerInput): YouthRating {
  const {
    age, stamina, batting, bowling, keeping, fielding,
    concentration, consistency, isBatsman, isBowler, isKeeper,
  } = input;

  const primaries: { name: string; level: number; active: boolean }[] = [
    { name: "Batting", level: batting, active: isBatsman },
    { name: "Bowling", level: bowling, active: isBowler },
  ];
  if (isKeeper) primaries.push({ name: "Keeping", level: keeping, active: true });

  const activePrimaries = primaries.filter((p) => p.active);
  const sorted = [...activePrimaries].sort((a, b) => b.level - a.level);
  const mainPrimary = sorted[0] ?? { name: "None", level: 0 };
  const secondPrimary = sorted[1] ?? null;

  let score = primaryBase(mainPrimary.level);

  score += staminaPoints(stamina);

  score += mentalPoints(concentration, isBatsman || isKeeper);
  score += mentalPoints(consistency, isBowler || isKeeper);

  score += fieldingPoints(fielding);

  if (secondPrimary && secondPrimary.level >= 7) score += 15;
  else if (secondPrimary && secondPrimary.level >= 5) score += 8;

  const ageMultiplier =
    age <= 17 ? 1.15 :
    age === 18 ? 1.05 :
    age === 19 ? 0.95 :
    age === 20 ? 0.85 :
    age === 21 ? 0.75 :
    age <= 24 ? 0.65 :
    age <= 27 ? 0.55 :
    age <= 30 ? 0.45 :
    0.35;

  const rawScore = score;
  score = Math.round(score * ageMultiplier);

  const grade: PullGrade =
    score >= 85 ? "S" :
    score >= 70 ? "A" :
    score >= 50 ? "B" :
    score >= 30 ? "C" :
    score >= 10 ? "D" : "F";

  const assessment =
    grade === "S" ? "Exceptional player — elite skills with outstanding long-term value." :
    grade === "A" ? "Excellent player — strong primary skills with good all-round attributes." :
    grade === "B" ? "Solid player — worth training or retaining. Clear potential in their primary role." :
    grade === "C" ? "Average player — serviceable but unremarkable. Consider upgrading if possible." :
    grade === "D" ? "Below-average — weak skills. Only keep if desperate for squad depth." :
    "Poor player — minimal value. Release or sell.";

  const trainability =
    age <= 17 ? `Age 17 — peak potential. 4 seasons before the age 21 freezecap. Score ×${ageMultiplier}.` :
    age === 18 ? `Age 18 — high potential. 3 seasons of training remaining. Score ×${ageMultiplier}.` :
    age === 19 ? `Age 19 — good potential. 2 seasons left. Score ×${ageMultiplier}.` :
    age === 20 ? `Age 20 — final youth season. 1 season before freezecap. Score ×${ageMultiplier}.` :
    age === 21 ? `Age 21 — freezecap hit. Minimal primary training value. Score ×${ageMultiplier}.` :
    age <= 24 ? `Age ${age} — declining. Limited training returns. Score ×${ageMultiplier}.` :
    age <= 27 ? `Age ${age} — veteran territory. Value is in current skills, not growth. Score ×${ageMultiplier}.` :
    age <= 30 ? `Age ${age} — experienced. Skills will start declining soon. Score ×${ageMultiplier}.` :
    `Age ${age} — twilight years. Expect skill deterioration. Score ×${ageMultiplier}.`;

  const recommendation =
    grade === "S" || grade === "A"
      ? "Priority asset. Allocate primary nets now and build around this player."
      : grade === "B"
        ? `Worth retaining and training as ${mainPrimary.name.toLowerCase()}. Allocate 2-3 nets if squad allows.`
        : grade === "C"
          ? `Borderline. Keep for ${mainPrimary.name.toLowerCase()} depth or sell on the transfer market.`
          : "Sell or release. Not worth the net investment.";

  const skillRatings: SkillRating[] = [
    { skill: "Batting", level: batting, name: skillName(batting), isPrimary: isBatsman },
    { skill: "Bowling", level: bowling, name: skillName(bowling), isPrimary: isBowler },
    { skill: "Keeping", level: keeping, name: skillName(keeping), isPrimary: isKeeper },
    { skill: "Concentration", level: concentration, name: skillName(concentration), isPrimary: false },
    { skill: "Consistency", level: consistency, name: skillName(consistency), isPrimary: false },
    { skill: "Stamina", level: stamina, name: skillName(stamina), isPrimary: false },
    { skill: "Fielding", level: fielding, name: skillName(fielding), isPrimary: false },
  ];

  return {
    grade,
    score,
    rawScore,
    ageMultiplier,
    assessment,
    primarySkill: mainPrimary,
    secondaryPrimary: secondPrimary,
    skillRatings,
    recommendation,
    trainability,
  };
}
