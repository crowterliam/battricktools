"use client";

import { useMemo, useState } from "react";
import { calculate, type CalculatorResult } from "@/lib/calculator";
import { DEFAULT_CONSTANTS, type FormulaConstants } from "@/lib/formulas";
import { SKILL_LEVELS, skillName, MAX_AGE } from "@/lib/skills";
import {
  NET_LIMITS,
  TRAINING_TYPE_LABELS,
  type TrainingType,
} from "@/lib/trainingData";

const toneClasses: Record<string, string> = {
  positive: "text-accent",
  neutral: "text-foreground",
  warning: "text-yellow-400",
  danger: "text-danger",
};

const recConfig = {
  train: { label: "Train", bg: "bg-accent/15", text: "text-accent", border: "border-accent/40", icon: "▲" },
  caution: { label: "Caution", bg: "bg-yellow-400/10", text: "text-yellow-400", border: "border-yellow-400/30", icon: "!" },
  stop: { label: "Stop", bg: "bg-danger/10", text: "text-danger", border: "border-danger/30", icon: "✕" },
};

const TRAINING_TYPES: TrainingType[] = ["primary", "secondary", "keeping", "fielding", "stamina"];

export default function TrainingCalculator() {
  const [age, setAge] = useState(19);
  const [level, setLevel] = useState(7);
  const [trainingType, setTrainingType] = useState<TrainingType>("primary");
  const [nets, setNets] = useState(1);
  const [traineeCount, setTraineeCount] = useState(3);
  const [generational, setGenerational] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [constants, setConstants] = useState<FormulaConstants>(DEFAULT_CONSTANTS);

  const maxNets = NET_LIMITS[trainingType];
  const effectiveNets = Math.min(nets, maxNets);
  const usesSkillLevel = trainingType === "primary" || trainingType === "secondary";

  const result: CalculatorResult = useMemo(
    () => calculate({ age, level, nets: effectiveNets, trainingType, traineeCount, generational, constants }),
    [age, level, effectiveNets, trainingType, traineeCount, generational, constants],
  );

  const rec = recConfig[result.recommendation];

  function handleTypeChange(type: TrainingType) {
    setTrainingType(type);
    const limit = NET_LIMITS[type];
    if (nets > limit) setNets(limit);
  }

  const sourceInfo = (() => {
    const s = result.singleNet;
    if (!("source" in s)) return null;
    if (s.source === "exact") return { label: "Exact community data", color: "bg-accent" };
    if (s.source === "interpolated") return { label: `Interpolated (${"confidence" in s ? s.confidence : ""} confidence)`, color: "bg-yellow-400" };
    if (s.source === "extrapolated") return { label: "Extrapolated (low confidence)", color: "bg-danger" };
    if (s.source === "unavailable") return { label: "No data", color: "bg-danger" };
    return null;
  })();

  return (
    <section id="calculator" className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Training Calculator</h2>
        <p className="text-muted">
          Pop timings from community-sourced data. Higher skill levels and older ages take longer.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* ===== INPUTS ===== */}
        <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
          <ControlGroup label="Training Type">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TRAINING_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`rounded-lg border py-2.5 text-xs font-semibold transition-all ${
                    trainingType === t
                      ? "border-accent bg-accent-dim text-accent"
                      : "border-border bg-background text-muted hover:border-accent/40"
                  }`}
                >
                  {TRAINING_TYPE_LABELS[t].split(" (")[0]}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Player Age" value={`${age} years old`}>
            <input type="range" min={17} max={MAX_AGE} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>17</span>
              <span className={age >= 21 ? "text-yellow-400" : ""}>21 (freezecap)</span>
              <span>{MAX_AGE}</span>
            </div>
          </ControlGroup>

          {usesSkillLevel && (
            <ControlGroup label="Current Skill Level" value={skillName(level)}>
              <input type="range" min={0} max={20} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full" />
              <div className="mt-1 flex justify-between text-xs text-muted">
                <span>0 — Useless</span>
                <span>Level {level}</span>
                <span>20 — Elite</span>
              </div>
              <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent">
                {SKILL_LEVELS.map((s) => (<option key={s.level} value={s.level}>{s.level} — {s.name}</option>))}
              </select>
            </ControlGroup>
          )}

          <ControlGroup label="Nets Allocated" value={`${effectiveNets} net${effectiveNets > 1 ? "s" : ""} (max ${maxNets})`}>
            <div className="flex gap-2">
              {Array.from({ length: maxNets }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setNets(n)} className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-all ${effectiveNets === n ? "border-accent bg-accent-dim text-accent" : "border-border bg-background text-muted hover:border-accent/40"}`}>
                  {n}
                </button>
              ))}
            </div>
            {effectiveNets === 3 && trainingType === "primary" && (<p className="mt-2 text-xs text-accent">3 nets: optimal sweet spot (59% per-net efficiency).</p>)}
            {effectiveNets === 4 && (<p className="mt-2 text-xs text-danger">4 nets: only 47% per-net efficiency — heavy waste.</p>)}
          </ControlGroup>

          <ControlGroup label="Total Trainees This Season" value={`${traineeCount} player${traineeCount > 1 ? "s" : ""}`}>
            <input type="range" min={1} max={6} value={traineeCount} onChange={(e) => setTraineeCount(Number(e.target.value))} className="w-full" />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>1</span>
              <span className={traineeCount > 3 ? "text-danger" : "text-accent"}>{traineeCount > 3 ? "Over cap!" : "Within cap"}</span>
              <span>6</span>
            </div>
          </ControlGroup>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <input type="checkbox" checked={generational} onChange={(e) => setGenerational(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
            <div>
              <span className="text-sm font-medium">Generational player</span>
              <p className="text-xs text-muted">Override the freezecap for an elite milestone pop.</p>
            </div>
          </label>

          <div>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
              Advanced: Formula Constants
              <span className="text-xs">{showAdvanced ? "−" : "+"}</span>
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-4 rounded-lg border border-border bg-background/50 p-4">
                <ConstantSlider label="Threshold multiplier (b)" value={constants.thresholdMultiplier} min={1.05} max={1.15} step={0.01} onChange={(v) => setConstants({ ...constants, thresholdMultiplier: v })} />
                <ConstantSlider label="Age steepness (k)" value={constants.ageSteepness} min={0.2} max={1.0} step={0.05} onChange={(v) => setConstants({ ...constants, ageSteepness: v })} />
                <ConstantSlider label="Age cliff (Acliff)" value={constants.ageCliff} min={19} max={24} step={0.5} onChange={(v) => setConstants({ ...constants, ageCliff: v })} />
                <ConstantSlider label="Net decay (c)" value={constants.netDecay} min={0.4} max={1.0} step={0.02} onChange={(v) => setConstants({ ...constants, netDecay: v })} />
                <button onClick={() => setConstants(DEFAULT_CONSTANTS)} className="text-xs text-accent hover:underline">Reset to defaults</button>
              </div>
            )}
          </div>
        </div>

        {/* ===== RESULTS ===== */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">Estimated weeks to pop</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground">
                    {result.estimatedWeeks > 0 ? result.estimatedWeeks.toFixed(1) : "N/A"}
                  </span>
                  <span className="text-lg text-muted">weeks</span>
                </div>
              </div>
              <div className={`rounded-xl border px-4 py-2 text-center ${rec.bg} ${rec.border}`}>
                <span className={`text-2xl ${rec.text}`}>{rec.icon}</span>
                <p className={`text-sm font-bold ${rec.text}`}>{rec.label}</p>
              </div>
            </div>
            <p className="text-sm text-muted">{result.strategy.summary}</p>
            {sourceInfo && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-background/50 px-3 py-1 text-xs">
                <span className={`h-2 w-2 rounded-full ${sourceInfo.color}`} />
                <span className="text-muted">{sourceInfo.label}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="mb-4 font-semibold">Breakdown</h3>
            <div className="space-y-3">
              {result.breakdown.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0">
                  <span className="text-sm text-muted">{row.label}</span>
                  <span className={`font-mono font-semibold ${toneClasses[row.tone]}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="mb-4 font-semibold">Strategy Rules</h3>
            <div className="space-y-3">
              {result.strategy.rules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 rounded-lg bg-background/40 p-3">
                  <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${rule.passed ? "bg-accent/20 text-accent" : "bg-danger/20 text-danger"}`}>
                    {rule.passed ? "✓" : "✕"}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{rule.title}</p>
                    <p className="text-xs text-muted">{rule.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlGroup({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {value && <span className="font-mono text-sm text-accent">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function ConstantSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="font-mono text-xs text-accent">{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}
