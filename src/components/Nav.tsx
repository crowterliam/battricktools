import Link from "next/link";

const LINKS = [
  { href: "/", label: "Training", key: "training" },
  { href: "/youth", label: "Youth Academy", key: "youth" },
];

export default function Nav({ active }: { active: string }) {
  return (
    <nav className="border-b border-border bg-surface/50 backdrop-blur-sm">
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
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                active === link.key
                  ? "bg-accent-dim text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
