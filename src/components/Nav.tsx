import Link from "next/link";

const LINKS = [
  { href: "/#calculator", label: "Calculator", key: "calculator" },
  { href: "/#analysis", label: "Efficiency", key: "analysis" },
  { href: "/#evaluator", label: "Player Evaluator", key: "evaluator" },
  { href: "/#timings", label: "Pop Timings", key: "timings" },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-dim text-accent">BT</span>
          Battrick Tools
        </Link>
        <div className="flex gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
