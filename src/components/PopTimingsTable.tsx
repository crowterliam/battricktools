import {
  POP_TIMINGS,
  TABLE_AGES,
  TABLE_LEVELS,
  getTableValue,
} from "@/lib/popTimings";

function cellColor(weeks: number | null): string {
  if (weeks === null) return "text-muted/30";
  if (weeks <= 12) return "text-accent";
  if (weeks <= 20) return "text-yellow-400";
  if (weeks <= 30) return "text-orange-400";
  return "text-danger";
}

export default function PopTimingsTable() {
  return (
    <section id="timings" className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        Single-Net Pop Timings
      </h2>
      <p className="mb-8 text-muted">
        Crowdsourced mean weeks to trigger a skill pop on a single primary net,
        broken down by age and current skill level.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-semibold text-muted">
                Age
              </th>
              {TABLE_LEVELS.map((lvl) => (
                <th key={lvl} className="px-4 py-3 text-center font-semibold">
                  <span className="block text-foreground">Level {lvl}</span>
                  <span className="block text-xs font-normal text-muted">
                    {lvl === 7
                      ? "Low"
                      : lvl === 12
                        ? "Mid"
                        : lvl === 19
                          ? "High"
                          : "Max"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_AGES.map((age) => (
              <tr
                key={age}
                className="border-b border-border/50 last:border-0 transition-colors hover:bg-surface-2/50"
              >
                <td className="px-4 py-2.5 font-semibold text-foreground">
                  {age}
                </td>
                {TABLE_LEVELS.map((lvl) => {
                  const weeks = getTableValue(age, lvl);
                  return (
                    <td
                      key={lvl}
                      className={`px-4 py-2.5 text-center font-mono ${cellColor(weeks)}`}
                    >
                      {weeks !== null ? `${weeks}` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span>Colour scale:</span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-accent" /> ≤12 weeks
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-yellow-400" /> 13–20
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-orange-400" /> 21–30
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-danger" /> 31+
        </span>
        <span className="ml-auto">
          {POP_TIMINGS.length} data points · Source:{" "}
          <a
            href="https://rpubs.com/Nyd_Designs/1277246"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            RPubs Training Times Analysis
          </a>
        </span>
      </div>
    </section>
  );
}
