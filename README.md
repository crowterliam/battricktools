# Battrick Tools

Training optimization toolkit for [Battrick](https://battrick.org) — the online cricket management game.

Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Training Calculator** — Estimate pop timings based on player age, skill level, and nets allocated. Includes net-stacking decay, age absorption modelling, and a 3-rule strategic recommendation engine.
- **Pop Timings Table** — Crowdsourced single-net mean weeks to pop, colour-coded by efficiency.
- **Formula Reference** — The three core mathematical models (threshold expansion, age degradation sigmoid, net stacking decay) with configurable constants.
- **Strategy Guide** — The community's 3-rule checklist for efficient training programmes.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
pnpm start
```

## Data Sources

- [Battrick Training Times Analysis (RPubs)](https://rpubs.com/Nyd_Designs/1277246)
- [Battrick Training & Wage Calculator (Vercel)](https://training-calc.vercel.app/)
