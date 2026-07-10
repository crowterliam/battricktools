import ItsPlanner from "@/components/youth/ItsPlanner";
import YouthPullRater from "@/components/youth/YouthPullRater";
import Nav from "@/components/Nav";

export default function YouthPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav active="youth" />

      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent-dim/50 px-4 py-1.5 text-xs font-semibold text-accent">
            Youth Academy Tools
          </span>
          <h1 className="mb-3 text-3xl font-black tracking-tight md:text-5xl">
            Youth Pull <span className="text-accent">Evaluator</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted">
            Rate your youth academy pulls and plan ITS allocation using Wombat&apos;s
            community guide.
          </p>
        </div>
      </header>

      {/* Pull Rater */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Youth Pull Rater</h2>
        <p className="mb-8 text-muted">
          Enter your pulled player&apos;s skills to get a quality grade and training recommendation.
        </p>
        <YouthPullRater />
      </section>

      {/* ITS Planner */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">ITS Allocation Planner</h2>
        <p className="mb-8 text-muted">
          Plan how many intensive training sessions are needed to reach a target skill level.
        </p>
        <ItsPlanner />
      </section>

      {/* Info */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <InfoCard
            title="ITS Cost"
            value="£2,000"
            desc="Per session. Max 10/week (£20,000). Max 100 stored."
          />
          <InfoCard
            title="Per-skill Cap"
            value="12 ITS"
            desc="Maximum sessions allocatable to a single skill."
          />
          <InfoCard
            title="Academy Repair"
            value="£30,000"
            desc="Upgrades building by one full level. Deteriorates weekly."
          />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-sm text-muted">
            ITS data from Wombat&apos;s community guide. Ratings are indicative — always
            cross-reference with live game data.
          </p>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs text-muted">{title}</p>
      <p className="my-1 text-2xl font-black text-accent">{value}</p>
      <p className="text-xs text-muted">{desc}</p>
    </div>
  );
}
