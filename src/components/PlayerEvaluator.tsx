"use client";

import { useMemo, useState } from "react";
import { rateYouthPull, type YouthRating } from "@/lib/youthRater";
import { SKILL_LEVELS, STAMINA_SKILL_LEVELS, skillName } from "@/lib/skills";
import { buildTimeline } from "@/lib/calculator";
import type { TrainingType } from "@/lib/trainingData";

const gradeConfig = {
  S: { label: "S", color: "text-accent", bg: "bg-accent/15", border: "border-accent/40" },
  A: { label: "A", color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  B: { label: "B", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  C: { label: "C", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  D: { label: "D", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" },
  F: { label: "F", color: "text-danger", bg: "bg-danger/15", border: "border-danger/40" },
};

const SKILL_GROUPS = [
  { label: null, skills: [{ key: "stamina", label: "Stamina", max: 11 }] },
  { label: "Batting", skills: [
    { key: "batting", label: "Batting", max: 20 },
    { key: "concentration", label: "Concentration", max: 20 },
  ]},
  { label: "Bowling", skills: [
    { key: "bowling", label: "Bowling", max: 20 },
    { key: "consistency", label: "Consistency", max: 20 },
  ]},
  { label: "Fielding", skills: [
    { key: "keeping", label: "Wicket Keeping", max: 20 },
    { key: "fielding", label: "Fielding", max: 20 },
  ]},
] as const;

export default function PlayerEvaluator() {
  const [age, setAge] = useState(17);
  const [skills, setSkills] = useState({
    batting: 6, bowling: 1, keeping: 0, concentration: 5,
    consistency: 3, stamina: 5, fielding: 0,
  });
  const [isBatsman, setIsBatsman] = useState(true);
  const [isBowler, setIsBowler] = useState(false);
  const [isKeeper, setIsKeeper] = useState(false);
  const [nets, setNets] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);

  const rating: YouthRating = useMemo(
    () => rateYouthPull({ age, ...skills, isBatsman, isBowler, isKeeper }),
    [age, skills, isBatsman, isBowler, isKeeper],
  );

  const primaryLevel = Math.max(
    isBatsman ? skills.batting : 0,
    isBowler ? skills.bowling : 0,
    isKeeper ? skills.keeping : 0,
  );
  const trainingType: TrainingType = isKeeper && !isBatsman && !isBowler
    ? "keeping"
    : "primary";

  const timeline = useMemo(
    () => buildTimeline(trainingType, age, primaryLevel, nets, currentWeek, false),
    [trainingType, age, primaryLevel, nets, currentWeek],
  );

  const gc = gradeConfig[rating.grade];

  function updateSkill(key: string, value: number) {
    setSkills((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section id="evaluator" className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Player Evaluator</h2>
        <p className="text-muted">
          Rate any player — youth pulls, transfer targets, or your own squad — and see projected growth.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* ===== INPUTS ===== */}
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Player Age</label>
              <span className="font-mono text-sm text-accent">{age}</span>
            </div>
            <input
              type="range"
              min={17}
              max={35}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>17</span>
              <span className={age >= 21 ? "text-yellow-400" : ""}>21 (freezecap)</span>
              <span>35</span>
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

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted">Primary Nets</label>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNets(n)}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-semibold transition-all ${
                      nets === n ? "border-accent bg-accent-dim text-accent" : "border-border bg-background text-muted hover:border-accent/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted">Season Week (1–16)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={currentWeek}
                  onChange={(e) => setCurrentWeek(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-10 text-center font-mono text-sm text-accent">{currentWeek}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {SKILL_GROUPS.map((group, gi) => (
              <div key={gi}>
                {group.label && (
                  <p className="mb-1 mt-3 text-xs font-bold uppercase tracking-wider text-muted/50">
                    {group.label}
                  </p>
                )}
                {group.skills.map(({ key, label, max }) => {
                  const isStamina = key === "stamina";
                  const levels = isStamina ? STAMINA_SKILL_LEVELS : SKILL_LEVELS;
                  return (
                    <div key={key} className="flex items-center gap-3 py-1.5">
                      <span className="w-28 flex-shrink-0 text-sm text-muted">{label}</span>
                      <input
                        type="range"
                        min={0}
                        max={max}
                        value={skills[key]}
                        onChange={(e) => updateSkill(key, Number(e.target.value))}
                        className="flex-1"
                      />
                      <select
                        value={skills[key]}
                        onChange={(e) => updateSkill(key, Number(e.target.value))}
                        className="w-32 flex-shrink-0 rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent"
                      >
                        {levels.map((s) => (
                          <option key={s.level} value={s.level}>
                            {s.level} — {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
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
                <p className="text-sm text-muted">Player Rating</p>
                <p className="mt-1 text-3xl font-black text-foreground">{rating.score} pts</p>
                {rating.ageMultiplier !== 1 && (
                  <p className="text-xs text-muted/60">
                    {rating.rawScore} base × {rating.ageMultiplier} age adjustment
                  </p>
                )}
              </div>
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 ${gc.bg} ${gc.border}`}>
                <span className={`text-4xl font-black ${gc.color}`}>{gc.label}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">{rating.assessment}</p>
            {rating.secondaryPrimary && (
              <p className="mt-2 text-xs text-muted/70">
                Primary: {rating.primarySkill.name} ({skillName(rating.primarySkill.level)}) ·
                Secondary: {rating.secondaryPrimary.name} ({skillName(rating.secondaryPrimary.level)})
              </p>
            )}
            {!rating.secondaryPrimary && (
              <p className="mt-2 text-xs text-muted/70">
                Primary: {rating.primarySkill.name} ({skillName(rating.primarySkill.level)})
              </p>
            )}
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
                .sort((a, b) => b.level - a.level)
                .map((sr) => {
                  const barMax = sr.skill === "Stamina" ? 11 : 20;
                  return (
                  <div key={sr.skill} className="flex items-center gap-3">
                    <span className="w-28 text-sm text-muted">{sr.skill}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-background">
                        <div
                          className={`h-2 rounded-full transition-all ${sr.isPrimary ? "bg-accent" : "bg-accent/40"}`}
                          style={{ width: `${(sr.level / barMax) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-28 text-right text-xs font-mono text-muted">
                      {sr.name} ({sr.level})
                    </span>
                  </div>
                  );
                })}
            </div>
          </div>

          {/* Training Timeline */}
          {!timeline.pastFreeze && timeline.seasons.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold">Training Projection</h4>
                <span className="text-xs text-muted">
                  {nets} net{nets > 1 ? "s" : ""} · {timeline.totalWeeksRemaining} weeks to freezecap
                </span>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-background/50 p-2.5">
                  <p className="text-xs text-muted">This season</p>
                  <p className="text-base font-bold text-foreground">
                    {timeline.weeksRemainingThisSeason}<span className="text-xs font-normal text-muted"> wks</span>
                  </p>
                </div>
                <div className="rounded-lg bg-background/50 p-2.5">
                  <p className="text-xs text-muted">Pops to age 21</p>
                  <p className="text-base font-bold text-accent">
                    ~{timeline.totalPops.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-lg bg-background/50 p-2.5">
                  <p className="text-xs text-muted">Projected level</p>
                  <p className="text-base font-bold text-foreground">
                    {skillName(Math.floor(timeline.projectedLevelAtFreeze))}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 border-b border-border pb-1.5 text-xs font-semibold text-muted/50">
                  <span className="w-8">Age</span>
                  <span>Progress</span>
                  <span className="w-14 text-right">Pops</span>
                  <span className="w-20 text-right">Level</span>
                </div>
                {timeline.seasons.map((s) => {
                  const popPct = Math.min(100, (s.pops / Math.max(1, timeline.totalPops)) * 100);
                  return (
                    <div key={s.age} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 py-1">
                      <span className="w-8 text-sm font-semibold text-foreground">{s.age}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-background">
                          <div className="h-1.5 rounded-full bg-accent/60" style={{ width: `${popPct}%` }} />
                        </div>
                        <span className="text-xs text-muted whitespace-nowrap">{s.weeks}w · {s.weeksPerPop.toFixed(1)}/pop</span>
                      </div>
                      <span className="w-14 text-right font-mono text-sm text-accent">+{s.pops.toFixed(1)}</span>
                      <span className="w-20 text-right font-mono text-xs text-muted">{skillName(Math.floor(s.projectedLevel))}</span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-muted/50">
                Assumes continuous {nets}-net training. Rates slow at higher levels — treat as optimistic.
              </p>
            </div>
          )}
          {timeline.pastFreeze && (
            <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-center">
              <p className="text-sm text-danger">Past the age 21 freezecap — no primary training projected.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
