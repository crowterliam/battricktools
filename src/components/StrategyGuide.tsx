interface Rule {
  number: number;
  title: string;
  rule: string;
  detail: string;
}

const RULES: Rule[] = [
  {
    number: 1,
    title: "The Age 21 Freezecap",
    rule: "Cut all primary nets on any player hitting age 21+.",
    detail:
      "Instantly stop batting/bowling nets unless the player is a generational talent finishing an elite milestone pop. The age cliff makes further investment deeply inefficient.",
  },
  {
    number: 2,
    title: "The Mono-Training Cap",
    rule: "Maximum 2–3 youth trainees simultaneously per season.",
    detail:
      "Attempting to train 4+ players spreads nets too thin and ruins your club's overall efficiency. Focus your resources on a tight pipeline.",
  },
  {
    number: 3,
    title: "The Target Pipeline",
    rule: "3 Primary Nets + 1 Secondary Net + 10 Coaches + 3–5 Sports Psychologists.",
    detail:
      "Structure primary targets around exactly 3 nets plus 1 fielding/keeping net. Maintain backroom staff to maximise sub-skill generation (Concentration & Consistency).",
  },
];

export default function StrategyGuide() {
  return (
    <section id="strategy" className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        The 3-Rule Strategic Checklist
      </h2>
      <p className="mb-8 text-muted">
        Hard guardrails for keeping your training programme efficient.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {RULES.map((rule) => (
          <div
            key={rule.number}
            className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6"
          >
            <div className="absolute -right-4 -top-4 text-8xl font-black text-surface-2 select-none">
              {rule.number}
            </div>
            <div className="relative">
              <span className="mb-3 inline-block rounded-full bg-accent-dim px-3 py-1 text-xs font-semibold text-accent">
                Rule {rule.number}
              </span>
              <h3 className="mb-2 text-lg font-bold">{rule.title}</h3>
              <p className="mb-3 font-medium text-accent">{rule.rule}</p>
              <p className="text-sm leading-relaxed text-muted">
                {rule.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
