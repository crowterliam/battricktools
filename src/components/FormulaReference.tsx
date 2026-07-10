interface FormulaDef {
  id: string;
  letter: string;
  name: string;
  expression: string;
  variables: { sym: string; desc: string }[];
  insight: string;
  status: "validated" | "approximation" | "corrected";
  note: string;
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
      "Higher skill levels require exponentially more training time. Getting from Mediocre to Competent is far easier than Exquisite to Elite.",
    status: "validated",
    note:
      "VALIDATED by the Season 57 overhaul: 'training speeds will no longer be linear across the entire skill range.' Community data confirms — e.g., age 23: level 13 = 15 weeks, level 19 = 27 weeks.",
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
      "Ages 17–23 train at relatively uniform speed, then a gradual slowdown through the late 20s, then steep decline.",
    status: "validated",
    note:
      "VALIDATED by S57: replaced the old perfectly-linear '+1 week per year' with a curve. The admin described it as 'pretty uniform 17 to 23 then slow down till late 20s, then very difficult.' The sigmoid approximates this.",
  },
  {
    id: "formula-c",
    letter: "C",
    name: "Net Stacking Decay",
    expression: "M(N) = 1 + ln(N) · c",
    variables: [
      { sym: "M(N)", desc: "Total net power from N stacked nets" },
      { sym: "N", desc: "Number of identical nets" },
      { sym: "c", desc: "Decay constant — fitted to ~0.68" },
    ],
    insight:
      "Each additional net of the same type gives diminishing returns. The game rules confirm: a fourth net provides 'only negligible benefit.'",
    status: "corrected",
    note:
      "CORRECTED: Original blueprint estimated c ≈ 0.95. Community data (11.1/7.4/6.3/5.9 weeks for 1–4 nets) gives c ≈ 0.68. Real efficiency: 100% / 75% / 59% / 47%.",
  },
];

const statusConfig = {
  validated: { label: "Validated", bg: "bg-accent/10", text: "text-accent", border: "border-accent/30" },
  approximation: { label: "Approximation", bg: "bg-yellow-400/10", text: "text-yellow-400", border: "border-yellow-400/30" },
  corrected: { label: "Corrected", bg: "bg-orange-400/10", text: "text-orange-400", border: "border-orange-400/30" },
};

export default function FormulaReference() {
  return (
    <section id="formulas" className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Core Mathematical Foundations</h2>
      <p className="mb-8 text-muted">
        Three intersecting curves from the community blueprint, validated against the Season 57
        training overhaul and crowdsourced data.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {FORMULAS.map((f) => {
          const sc = statusConfig[f.status];
          return (
            <div key={f.id} className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-dim font-bold text-accent">{f.letter}</span>
                <h3 className="text-sm font-semibold leading-tight text-foreground">{f.name}</h3>
              </div>
              <div className="mb-4 rounded-lg bg-background/50 px-4 py-3 font-mono text-lg text-accent">{f.expression}</div>
              <dl className="mb-4 space-y-1.5">
                {f.variables.map((v) => (
                  <div key={v.sym} className="flex gap-2 text-sm">
                    <dt className="font-mono text-accent/80">{v.sym}</dt>
                    <dd className="text-muted">{v.desc}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-border pt-3 text-sm italic text-muted">{f.insight}</p>
              <div className={`mt-3 rounded-lg border p-3 ${sc.bg} ${sc.border}`}>
                <span className={`mb-1 block text-xs font-bold ${sc.text}`}>{sc.label.toUpperCase()}</span>
                <p className="text-xs leading-relaxed text-muted">{f.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
