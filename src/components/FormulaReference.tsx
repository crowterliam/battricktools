interface FormulaDef {
  id: string;
  letter: string;
  name: string;
  expression: string;
  variables: { sym: string; desc: string }[];
  insight: string;
}

const FORMULAS: FormulaDef[] = [
  {
    id: "formula-a",
    letter: "A",
    name: "Skill Level Threshold Expansion",
    expression: "T(L) = a · bᴸ",
    variables: [
      { sym: "T(L)", desc: "Target points to cross into skill level L" },
      { sym: "a", desc: "Base constant" },
      { sym: "b", desc: "Scaling multiplier (community modelled 1.08–1.12)" },
    ],
    insight:
      "High-tier pops require exponentially more input points than low-tier, independent of age.",
  },
  {
    id: "formula-b",
    letter: "B",
    name: "Age Degradation Factor",
    expression: "α(A) = 1 / (1 + eᵏ⁽ᴬ⁻ᴬᶜˡⁱᶠᶠ⁾)",
    variables: [
      { sym: "α(A)", desc: "Fraction of training absorbable at age A" },
      { sym: "k", desc: "Steepness of the cliff" },
      { sym: "Acliff", desc: "Age where the penalty inflects (~21–22)" },
    ],
    insight:
      "Ages 17–19 absorb ~100% of training. By 22+ the sigmoid crashes into heavy diminishing returns.",
  },
  {
    id: "formula-c",
    letter: "C",
    name: "Net Stacking Decay",
    expression: "M(N) = 1 + ln(N) · c",
    variables: [
      { sym: "M(N)", desc: "Total net power from N stacked nets" },
      { sym: "N", desc: "Number of identical nets" },
      { sym: "c", desc: "Decay constant (~0.95)" },
    ],
    insight:
      "3 nets (≈2.1× power, 70% per-net) is the sweet spot. 4+ nets wastes over half of each net's value.",
  },
];

export default function FormulaReference() {
  return (
    <section id="formulas" className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Core Mathematical Foundations</h2>
      <p className="mb-8 text-muted">
        Three intersecting curves govern every training decision in Battrick.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {FORMULAS.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-dim font-bold text-accent">
                {f.letter}
              </span>
              <h3 className="text-sm font-semibold leading-tight text-foreground">
                {f.name}
              </h3>
            </div>
            <div className="mb-4 rounded-lg bg-background/50 px-4 py-3 font-mono text-lg text-accent">
              {f.expression}
            </div>
            <dl className="mb-4 space-y-1.5">
              {f.variables.map((v) => (
                <div key={v.sym} className="flex gap-2 text-sm">
                  <dt className="font-mono text-accent/80">{v.sym}</dt>
                  <dd className="text-muted">{v.desc}</dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-border pt-3 text-sm italic text-muted">
              {f.insight}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
