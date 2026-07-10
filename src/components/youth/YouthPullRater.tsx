"use client";

import { useMemo, useState } from "react";
import { rateYouthPull, type YouthRating } from "@/lib/youthRater";
import { SKILL_LEVELS, skillName } from "@/lib/skills";

const gradeConfig = {
  S: { label: "S", color: "text-accent", bg: "bg-accent/15", border: "border-accent/40" },
  A: { label: "A", color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  B: { label: "B", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  C: { label: "C", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  D: { label: "D", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" },
  F: { label: "F", color: "text-danger", bg: "bg-danger/15", border: "border-danger/40" },
};

const SKILL_FIELDS = [
  { key: "batting", label: "Batting" },
  { key: "bowling", label: "Bowling" },
  { key: "keeping", label: "Keeping" },
  { key: "concentration", label: "Concentration" },
  { key: "consistency", label: "Consistency" },
  { key: "stamina", label: "Stamina" },
  { key: "fielding", label: "Fielding" },
] as const;

export default function YouthPullRater() {
  const [age, setAge] = useState(17);
  const [skills, setSkills] = useState({
    batting: 6, bowling: 1, keeping: 0, concentration: 5,
    consistency: 3, stamina: 5, fielding: 0,
  });
  const [isBatsman, setIsBatsman] = useState(true);
  const [isBowler, setIsBowler] = useState(false);
  const [isKeeper, setIsKeeper] = useState(false);

  const rating: YouthRating = useMemo(
    () => rateYouthPull({ age, ...skills, isBatsman, isBowler, isKeeper }),
    [age, skills, isBatsman, isBowler, isKeeper],
  );

  const gc = gradeConfig[rating.grade];

  function updateSkill(key: string, value: number) {
    setSkills((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* ===== INPUTS ===== */}
      <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Player Age</label>
          <div className="flex gap-2">
            {[17, 18, 19, 20].map((a) => (
              <button
                key={a}
                onClick={() => setAge(a)}
                className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-all ${
                  age === a ? "border-accent bg-accent-dim text-accent" : "border-border bg-background text-muted hover:border-accent/40"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Player Type</label>
          <div className="flex gap-2">
            {[
              { key: "isBatsman", label: "Batsman", val: isBatsman, set: setIsBatsman },
              { key: "isBowler", label: "Bowler", val: isBowler, set: setIsBowler },
              { key: "isKeeper", label: "Keeper", val: isKeeper, set: setIsKeeper },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => t.set(!t.val)}
                className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-all ${
                  t.val ? "border-accent bg-accent-dim text-accent" : "border-border bg-background text-muted hover:border-accent/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {SKILL_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-muted">{label}</span>
                <span className="font-mono text-sm text-accent">{skillName(skills[key])}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={11}
                  value={skills[key]}
                  onChange={(e) => updateSkill(key, Number(e.target.value))}
                  className="flex-1"
                />
                <select
                  value={skills[key]}
                  onChange={(e) => updateSkill(key, Number(e.target.value))}
                  className="w-32 rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
                >
                  {SKILL_LEVELS.filter((s) => s.level <= 11).map((s) => (
                    <option key={s.level} value={s.level}>
                      {s.level} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      <div className="space-y-4">
        {/* Grade */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Pull Quality</p>
              <p className="mt-1 text-3xl font-black text-foreground">{rating.percentage.toFixed(0)}%</p>
            </div>
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 ${gc.bg} ${gc.border}`}>
              <span className={`text-4xl font-black ${gc.color}`}>{gc.label}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">{rating.assessment}</p>
        </div>

        {/* Recommendation */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h4 className="mb-2 font-semibold">Recommendation</h4>
          <p className="text-sm text-foreground">{rating.recommendation}</p>
          <div className="mt-3 border-t border-border pt-3">
            <h4 className="mb-1 font-semibold">Trainability</h4>
            <p className="text-sm text-muted">{rating.trainability}</p>
          </div>
        </div>

        {/* Skill breakdown */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h4 className="mb-3 font-semibold">Skill Breakdown</h4>
          <div className="space-y-2">
            {[...rating.skillRatings]
              .sort((a, b) => b.score - a.score)
              .map((sr) => (
                <div key={sr.skill} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-muted">{sr.skill}</span>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-background">
                      <div
                        className={`h-2 rounded-full transition-all ${sr.skill === rating.primarySkill.name ? "bg-accent" : "bg-accent/40"}`}
                        style={{ width: `${(sr.level / 11) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-24 text-right text-xs font-mono text-muted">
                    {sr.name} ({sr.level})
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
