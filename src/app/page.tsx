import TrainingCalculator from "@/components/TrainingCalculator";
import PopTimingsTable from "@/components/PopTimingsTable";
import StrategyGuide from "@/components/StrategyGuide";
import FormulaReference from "@/components/FormulaReference";
import NetStackingChart from "@/components/NetStackingChart";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.08), transparent 50%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
          <span className="mb-4 rounded-full border border-accent/30 bg-accent-dim/50 px-4 py-1.5 text-xs font-semibold text-accent">
            Battrick Training Optimization Blueprint
          </span>
          <h1 className="mb-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Maximise Every{" "}
            <span className="text-accent">Training Net</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            Calculate pop timings, model net-stacking decay, and apply the
            community&apos;s three-rule strategy to build elite players
            efficiently.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#calculator"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-105"
            >
              Open Calculator
            </a>
            <a
              href="#timings"
              className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/40"
            >
              Pop Timings Table
            </a>
          </div>
        </div>
      </header>

      {/* ===== CALCULATOR ===== */}
      <TrainingCalculator />

      {/* ===== NET STACKING + FORMULAS ===== */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <NetStackingChart />
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-surface p-6">
            <h3 className="mb-3 text-lg font-bold">How the Model Works</h3>
            <ol className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="font-mono font-bold text-accent">1.</span>
                <span>
                  <strong className="text-foreground">Baseline lookup:</strong>{" "}
                  Single-net weeks come from crowdsourced data, interpolated via
                  inverse-distance weighting when an exact match isn&apos;t
                  available.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-accent">2.</span>
                <span>
                  <strong className="text-foreground">Net stacking:</strong>{" "}
                  Multi-net weeks divide by the total net power M(N) from
                  Formula C.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-accent">3.</span>
                <span>
                  <strong className="text-foreground">Age absorption:</strong>{" "}
                  Formula B&apos;s sigmoid models how much training a player can
                  absorb — feeding into the strategy recommendation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-accent">4.</span>
                <span>
                  <strong className="text-foreground">Strategy check:</strong>{" "}
                  The 3-rule checklist runs against your inputs to produce a
                  train / caution / stop verdict.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <FormulaReference />
      <PopTimingsTable />
      <StrategyGuide />

      {/* ===== TOOLING LINKS ===== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">
          Tooling &amp; Analytics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://training-calc.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
          >
            <h3 className="mb-1 font-semibold text-foreground group-hover:text-accent">
              Training &amp; Wage Calculator →
            </h3>
            <p className="text-sm text-muted">
              Reverse-engineer wage scaling, forecast player updates, and audit
              weekly nets. Hosted on Vercel.
            </p>
          </a>
          <a
            href="https://rpubs.com/Nyd_Designs/1277246"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
          >
            <h3 className="mb-1 font-semibold text-foreground group-hover:text-accent">
              Training Times Analysis →
            </h3>
            <p className="text-sm text-muted">
              Comprehensive community-tracked scatter graphs mapping
              weeks-per-pop across primary, secondary, keeping, and fielding
              benchmarks.
            </p>
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
          <p className="text-sm text-muted">
            Built from the Battrick Training Optimization Blueprint.
          </p>
          <p className="text-xs text-muted/60">
            Data is community-sourced and modelled — always cross-reference with
            live game data.
          </p>
        </div>
      </footer>
    </div>
  );
}
