"use client";

import { useMemo, useState } from "react";
import {
  getItsNeeded,
  getMaxLevel,
  skillCondition,
  type YouthAge,
  MAX_ITS_PER_SKILL,
  MAX_ITS_STORED,
  ITS_COST,
} from "@/lib/youthData";

const CONDITIONS = [
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
];

export default function ItsPlanner() {
  const [targetLevel, setTargetLevel] = useState(7);
  const [sublevel, setSublevel] = useState(50);
  const [age, setAge] = useState<YouthAge>(17);
  const [itsBudget, setItsBudget] = useState(30);

  const internalLevel = targetLevel + sublevel / 100;
  const itsNeeded = useMemo(() => getItsNeeded(internalLevel, age), [internalLevel, age]);
  const achievable = useMemo(() => getMaxLevel(itsBudget, age), [itsBudget, age]);
  const allAges: YouthAge[] = [17, 18, 19, 20];

  const budgetStatus =
    itsBudget >= itsNeeded ? "sufficient" : "insufficient";
  const weeksToSave = Math.ceil(itsNeeded / 10);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* ===== INPUTS ===== */}
      <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-semibold">ITS Allocation Planner</h3>
        <p className="text-sm text-muted">
          Based on Wombat&apos;s community ITS guide. Shows sessions needed to reach
          a target skill level.
        </p>

        {/* Target Level */}
        <div>
          <label className="mb-2 block text-sm font-medium">Target Skill Level</label>
          <select
            value={targetLevel}
            onChange={(e) => setTargetLevel(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {CONDITIONS.map((c) => (
              <option key={c.level} value={c.level}>
                {c.level} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sublevel */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Sublevel (within {skillCondition(internalLevel)})</label>
            <span className="font-mono text-sm text-accent">.{sublevel.toString().padStart(2, "0")}</span>
          </div>
          <input
            type="range"
            min={0}
            max={99}
            value={sublevel}
            onChange={(e) => setSublevel(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>.00 (bottom)</span>
            <span className="font-mono text-foreground">Internal: {internalLevel.toFixed(2)}</span>
            <span>.99 (top)</span>
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="mb-2 block text-sm font-medium">Player Age</label>
          <div className="flex gap-2">
            {allAges.map((a) => (
              <button
                key={a}
                onClick={() => setAge(a)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-all ${
                  age === a
                    ? "border-accent bg-accent-dim text-accent"
                    : "border-border bg-background text-muted hover:border-accent/40"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* ITS Budget */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Your ITS Budget</label>
            <span className="font-mono text-sm text-accent">{itsBudget} sessions</span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_ITS_STORED}
            value={itsBudget}
            onChange={(e) => setItsBudget(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>0</span>
            <span>£{(itsBudget * ITS_COST).toLocaleString()}</span>
            <span>{MAX_ITS_STORED} (max)</span>
          </div>
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      <div className="space-y-4">
        {/* ITS needed */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">ITS needed for {skillCondition(internalLevel)} ({internalLevel.toFixed(2)}) at age {age}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-5xl font-black ${itsNeeded <= MAX_ITS_PER_SKILL ? "text-accent" : "text-danger"}`}>
              {itsNeeded}
            </span>
            <span className="text-lg text-muted">sessions</span>
          </div>
          {itsNeeded > MAX_ITS_PER_SKILL && (
            <p className="mt-2 text-xs text-danger">
              Exceeds the 12 ITS per skill cap — cannot allocate this many to one skill.
            </p>
          )}
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-muted">Cost</span>
              <span className="font-mono text-foreground">£{(itsNeeded * ITS_COST).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-muted">Weeks to save (max 10/wk)</span>
              <span className="font-mono text-foreground">{weeksToSave} weeks</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-muted">Budget status</span>
              <span className={`font-mono ${budgetStatus === "sufficient" ? "text-accent" : "text-danger"}`}>
                {budgetStatus === "sufficient" ? "✓ Enough" : `✕ Short by ${itsNeeded - itsBudget}`}
              </span>
            </div>
          </div>
        </div>

        {/* Achievable with budget */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">With {itsBudget} ITS at age {age}, you can reach:</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-accent">
              {achievable.condition}
            </span>
            <span className="text-lg text-muted">({achievable.internalLevel.toFixed(2)})</span>
          </div>
        </div>

        {/* ITS by age comparison */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h4 className="mb-3 text-sm font-semibold">ITS needed at each age</h4>
          <div className="grid grid-cols-4 gap-2">
            {allAges.map((a) => {
              const needed = getItsNeeded(internalLevel, a);
              const isCurrent = a === age;
              return (
                <div
                  key={a}
                  className={`rounded-lg border p-3 text-center ${isCurrent ? "border-accent bg-accent-dim/30" : "border-border bg-background/50"}`}
                >
                  <p className="text-xs text-muted">{a}yo</p>
                  <p className={`text-xl font-bold ${needed <= MAX_ITS_PER_SKILL ? "text-foreground" : "text-danger"}`}>
                    {needed}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
