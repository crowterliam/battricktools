export const SKILL_LEVELS: { level: number; name: string }[] = [
  { level: 0, name: "Useless" },
  { level: 1, name: "Worthless" },
  { level: 2, name: "Abysmal" },
  { level: 3, name: "Woeful" },
  { level: 4, name: "Feeble" },
  { level: 5, name: "Mediocre" },
  { level: 6, name: "Competent" },
  { level: 7, name: "Respectable" },
  { level: 8, name: "Proficient" },
  { level: 9, name: "Strong" },
  { level: 10, name: "Superb" },
  { level: 11, name: "Quality" },
  { level: 12, name: "Remarkable" },
  { level: 13, name: "Wonderful" },
  { level: 14, name: "Exceptional" },
  { level: 15, name: "Sensational" },
  { level: 16, name: "Exquisite" },
  { level: 17, name: "Masterful" },
  { level: 18, name: "Miraculous" },
  { level: 19, name: "Phenomenal" },
  { level: 20, name: "Elite" },
];

export const STAMINA_SKILL_LEVELS: { level: number; name: string }[] = [
  { level: 0, name: "Useless" },
  { level: 1, name: "Worthless" },
  { level: 2, name: "Abysmal" },
  { level: 3, name: "Woeful" },
  { level: 4, name: "Feeble" },
  { level: 5, name: "Mediocre" },
  { level: 6, name: "Competent" },
  { level: 7, name: "Respectable" },
  { level: 8, name: "Proficient" },
  { level: 9, name: "Strong" },
  { level: 10, name: "Superb" },
  { level: 11, name: "Superb*" },
];

export function skillName(level: number): string {
  const clamped = Math.max(0, Math.min(20, Math.floor(level)));
  return SKILL_LEVELS[clamped]?.name ?? `Elite +${clamped - 20}`;
}

export function staminaSkillName(level: number): string {
  const clamped = Math.max(0, Math.min(11, Math.floor(level)));
  return STAMINA_SKILL_LEVELS[clamped]?.name ?? "Superb*";
}

export function skillTier(level: number): "low" | "mid" | "high" | "max" {
  if (level <= 5) return "low";
  if (level <= 10) return "mid";
  if (level <= 18) return "high";
  return "max";
}

export const MIN_AGE = 17;
export const MAX_AGE = 35;
export const WEEKS_PER_SEASON = 16;
export const MAX_STAMINA = 11;
export const MAX_SKILL = 25;
