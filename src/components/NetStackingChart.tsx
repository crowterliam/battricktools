import { netEfficiency, netPower, DEFAULT_CONSTANTS } from "@/lib/formulas";

const NET_DATA = [1, 2, 3, 4].map((n) => ({
  nets: n,
  power: netPower(n, DEFAULT_CONSTANTS.netDecay),
  efficiency: netEfficiency(n, DEFAULT_CONSTANTS.netDecay),
  label:
    n === 3 ? "Sweet Spot" : n === 4 ? "Over-stacking" : undefined,
}));

export default function NetStackingChart() {
  const maxPower = 3.0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="mb-1 font-semibold">Net Stacking Efficiency</h3>
      <p className="mb-6 text-sm text-muted">
        Total power vs. per-net efficiency as identical nets are stacked.
      </p>
      <div className="flex items-end justify-around gap-4" style={{ height: "200px" }}>
        {NET_DATA.map((d) => {
          const barHeight = (d.power / maxPower) * 100;
          const isSweet = d.nets === 3;
          const isOver = d.nets === 4;
          return (
            <div
              key={d.nets}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex w-full flex-col items-center gap-1">
                <span className="font-mono text-sm font-bold text-accent">
                  {d.power.toFixed(1)}×
                </span>
                <span className="text-xs text-muted">
                  {(d.efficiency * 100).toFixed(0)}%/net
                </span>
              </div>
              <div
                className={`w-full max-w-[60px] rounded-t-lg transition-all ${
                  isSweet
                    ? "bg-accent"
                    : isOver
                      ? "bg-danger/60"
                      : "bg-accent/40"
                }`}
                style={{ height: `${barHeight}%` }}
              />
              <div className="text-center">
                <span className="block text-sm font-semibold">
                  {d.nets} {d.nets === 1 ? "Net" : "Nets"}
                </span>
                {d.label && (
                  <span
                    className={`text-xs ${
                      isSweet ? "text-accent" : "text-danger"
                    }`}
                  >
                    {d.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
