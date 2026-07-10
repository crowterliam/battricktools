export const SKILL_LEVELS: { level: number; name: string }[] = [
  { level: 1, name: "Hopeless" },
  { level: 2, name: "Woeful" },
  { level: 3, name: "Feeble" },
  { level: 4, name: "Mediocre" },
  { level: 5, name: "Average" },
  { level: 6, name: "Useful" },
  { level: 7, name: "Competent" },
  { level: 8, name: "Proficient" },
  { level: 9, name: "Strong" },
  { level: 10, name: "Quality" },
  { level: 11, name: "Excellent" },
  { level: 12, name: "Outstanding" },
  { level: 13, name: "Remarkable" },
  { level: 14, name: "Brilliant" },
  { level: 15, name: "Superb" },
  { level: 16, name: "Magnificent" },
  { level: 17, name: "Elite" },
  { level: 18, name: "Wonderful" },
  { level: 19, name: "Phenomenal" },
  { level: 20, name: "Magical" },
];

export function skillName(level: number): string {
  return SKILL_LEVELS.find((s) => s.level === level)?.name ?? `Level ${level}`;
}

export function skillTier(level: number): "low" | "mid" | "high" | "max" {
  if (level <= 8) return "low";
  if (level <= 14) return "mid";
  if (level <= 19) return "high";
  return "max";
}
