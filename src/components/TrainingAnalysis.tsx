"use client";

import { useMemo, useState } from "react";
import { getPrimaryWeeks } from "@/lib/gameData";
import { netStackingPower } from "@/lib/trainingData";
import { skillName, WEEKS_PER_SEASON } from "@/lib/skills";

const AGES = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
const LEVELS = [6, 8, 10, 12, 14, 16, 18, 19, 20];

function effZone(pops: number): { bg: string; text: string; label: string } {
  if (pops >= 2.0) return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Efficient" };
  if (pops >= 1.5) return { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "OK" };
  if (pops >= 1.0) return { bg: "bg-orange-500/15", text: "text-orange-400", label: "Declining" };
  return { bg: "bg-red-500/10", text: "text-red-400", label: "Wasteful" };
}

interface CareerStep {
  age: number;
  startLevel: number;
  endLevel: number;
  pops: number;
  weeksPerPop: number;
  zone: ReturnType<typeof effZone>;
}

export default function TrainingAnalysis() {
  const [nets, setNets] = useState(3);
  const [startAge, setStartAge] = useState(17);
  const [startLevel, setStartLevel] = useState(6);

  const power = netStackingPower(nets);

  const grid = useMemo(() => {
    return AGES.map((age) =>
      LEVELS.map((level) => {
        const wpp = getPrimaryWeeks(age, level).weeks / power;
        return wpp > 0 ? WEEKS_PER_SEASON / wpp : 0;
      }),
    );
  }, [power]);

  const career = useMemo((): CareerStep[] => {
    const steps: CareerStep[] = [];
    let level = startLevel;
    for (let age = startAge; age <= 27; age++) {
      const wpp = getPrimaryWeeks(age, Math.floor(level)).weeks / power;
      if (wpp <= 0) break;
      const pops = WEEKS_PER_SEASON / wpp;
      steps.push({
        age,
        startLevel: level,
        endLevel: level + pops,
        pops,
        weeksPerPop: wpp,
        zone: effZone(pops),
      });
      level += pops;
      if (Math.floor(level) >= 20) break;
    }
    return steps;
  }, [startAge, startLevel, power]);

  return (
    <section id="analysis" className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Training Efficiency Analysis</h2>
      <p className="mb-8 text-muted">
        How fast skills develop at different ages and levels, and when to stop investing nets.
      </p>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-surface p-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Nets</label>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNets(n)}
                className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition-all ${
                  nets === n ? "border-accent bg-accent-dim text-accent" : "border-border bg-background text-muted hover:border-accent/40"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Start Age</label>
          <select
            value={startAge}
            onChange={(e) => setStartAge(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
          >
            {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Start Level</label>
          <select
            value={startLevel}
            onChange={(e) => setStartLevel(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
          >
            {Array.from({ length: 19 }, (_, i) => i + 2).map((l) => (
              <option key={l} value={l}>{l} — {skillName(l)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Heatmap */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-1 font-semibold">Pops per Season</h3>
          <p className="mb-4 text-xs text-muted">
            How many skill levels gained per 16-week season at each age × level.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-1.5 text-left font-semibold text-muted/60">Age</th>
                  {LEVELS.map((l) => (
                    <th key={l} className="px-1.5 py-1.5 text-center font-semibold text-muted/60">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, ai) => (
                  <tr key={ai}>
                    <td className="px-2 py-0.5 font-semibold text-foreground">{AGES[ai]}</td>
                    {row.map((pops, li) => {
                      const z = effZone(pops);
                      return (
                        <td key={li} className="px-1 py-0.5">
                          <div className={`rounded px-1 py-1 text-center font-mono ${z.bg} ${z.text}`}>
                            {pops.toFixed(1)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500/30" /> 2.0+ Efficient</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-yellow-500/25" /> 1.5–2.0 OK</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-orange-500/25" /> 1.0–1.5 Declining</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-red-500/20" /> &lt;1.0 Wasteful</span>
          </div>
        </div>

        {/* Career simulation */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-1 font-semibold">Career Projection</h3>
          <p className="mb-4 text-xs text-muted">
            Simulated growth from age {startAge} at {skillName(startLevel)} with {nets} net{nets > 1 ? "s" : ""}.
          </p>
          <div className="space-y-1">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 border-b border-border pb-1.5 text-xs font-semibold text-muted/50">
              <span className="w-8">Age</span>
              <span>Season</span>
              <span className="w-14 text-right">Pops</span>
              <span className="w-24 text-right">Reaches</span>
            </div>
            {career.map((s) => (
              <div key={s.age} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 py-1">
                <span className="w-8 text-sm font-semibold text-foreground">{s.age}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{skillName(s.startLevel)}</span>
                  <span className="text-muted/40">→</span>
                  <span className={`text-xs font-medium ${s.zone.text}`}>{skillName(s.endLevel)}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${s.zone.bg} ${s.zone.text}`}>
                    {s.zone.label}
                  </span>
                </div>
                <span className="w-14 text-right font-mono text-sm text-accent">+{s.pops.toFixed(1)}</span>
                <span className="w-24 text-right font-mono text-xs text-muted">{s.weeksPerPop.toFixed(1)} wks/pop</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key findings */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h3 className="mb-4 font-semibold">Key Findings &amp; Recommendations</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-bold text-accent">The Golden Window (Ages 17–21)</h4>
            <p className="text-sm leading-relaxed text-muted">
              With 3 primary nets, players gain <strong className="text-foreground">2.0–3.0 pops per season</strong> regardless
              of skill level. This is where the vast majority of a player&apos;s career growth happens — 5 seasons can take a
              player from Competent to Elite.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold text-yellow-400">The Efficiency Cliff (Age 22+)</h4>
            <p className="text-sm leading-relaxed text-muted">
              Output drops sharply at 22. At level 14+, expect only <strong className="text-foreground">1.3–2.0 pops/season</strong>.
              By 23–24 at high levels (17+), you&apos;re getting <strong className="text-foreground">under 1 pop per season</strong> —
              those 3 nets would produce 6+ pops on a 17-year-old.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold text-orange-400">When to Stop</h4>
            <p className="text-sm leading-relaxed text-muted">
              Stop primary training at <strong className="text-foreground">age 21</strong> (the freezecap rule). The one
              exception: a generational talent at level 17–18 may justify one more season to reach Elite. Beyond that,
              the opportunity cost of wasted nets outweighs the marginal skill gain.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-bold text-accent">The Compounding Slowdown</h4>
            <p className="text-sm leading-relaxed text-muted">
              Age and skill level both increase simultaneously, creating a double penalty. A player gains pops
              slower <em>and</em> each subsequent pop is harder. The jump from level 18→19 at age 24 takes an entire
              season of 3 nets for a single pop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
