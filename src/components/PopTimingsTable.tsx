import {
  PRIMARY_DATA,
  SECONDARY_DATA,
  PRIMARY_AGES,
  PRIMARY_LEVELS,
  SECONDARY_LEVELS,
  type PopDataPoint,
} from "@/lib/gameData";

function buildGrid(data: PopDataPoint[], ages: number[], levels: number[]) {
  return ages.map((age) => ({
    age,
    cells: levels.map((level) => {
      const point = data.find((p) => p.age === age && p.level === level);
      return point ? point.weeks : null;
    }),
  }));
}

function cellColor(weeks: number | null): string {
  if (weeks === null) return "";
  if (weeks <= 8) return "text-accent";
  if (weeks <= 14) return "text-yellow-400";
  if (weeks <= 22) return "text-orange-400";
  return "text-danger";
}

function DataTable({ data, ages, levels, title }: { data: PopDataPoint[]; ages: number[]; levels: number[]; title: string }) {
  const grid = buildGrid(data, ages, levels);
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-accent">{title}</h3>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-surface px-3 py-2 text-left font-semibold text-muted">Age</th>
              {levels.map((lvl) => (
                <th key={lvl} className="px-2 py-2 text-center font-semibold text-muted">{lvl}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row.age} className="border-b border-border/30 last:border-0 hover:bg-surface-2/40">
                <td className="sticky left-0 bg-surface px-3 py-1.5 font-semibold text-foreground">{row.age}</td>
                {row.cells.map((weeks, i) => (
                  <td key={i} className={`px-2 py-1.5 text-center font-mono ${cellColor(weeks)}`}>
                    {weeks !== null ? weeks : <span className="text-muted/20">·</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PopTimingsTable() {
  return (
    <section id="timings" className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Community Pop Timings</h2>
      <p className="mb-8 text-muted">
        Mean weeks to pop (single net), crowdsourced from player observations. Higher skill levels
        and older ages take longer — especially past level 16 and age 23+.
      </p>

      <div className="space-y-10">
        <DataTable
          data={PRIMARY_DATA}
          ages={PRIMARY_AGES}
          levels={PRIMARY_LEVELS}
          title="Primary Skills (Batting / Bowling) — 1 Net"
        />
        <DataTable
          data={SECONDARY_DATA}
          ages={PRIMARY_AGES}
          levels={SECONDARY_LEVELS}
          title="Secondary Skills (Concentration / Consistency)"
        />
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
          <p className="text-sm leading-relaxed text-yellow-400/90">
            <strong>Season 57 overhaul:</strong> Training was reworked in 2021. Before S57, training
            was perfectly linear (+1 week per year of age, same for all skill levels). Since S57,
            both age and skill-level scaling are non-linear — younger players and lower skill levels
            train faster, with steep difficulty at elite levels. This data reflects post-S57
            community observations.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <p className="text-xs leading-relaxed text-muted">
            <strong>Secondary note:</strong> Concentration/consistency training gets{" "}
            <em>faster</em> with age — older players improve mental skills quicker (per game rules).
            The trend reverses compared to primary skills.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          <span>Colour scale:</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent" /> ≤8 weeks</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-yellow-400" /> 9–14</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-orange-400" /> 15–22</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-danger" /> 23+</span>
          <span className="ml-auto">Dots = no community data · Source: Battrick community (Rules page)</span>
        </div>
      </div>
    </section>
  );
}
