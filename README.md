# 529 College Savings Planner

Interactive NY 529 rebalancing & projection tool built for the Falcon family.

## Features

- **Per-child investment allocation editor** — pick from all 18 NY 529 investment options, adjust percentages with sliders, see blended expected returns update in real-time
- **Cost modeling** — adjust total 4-year college cost per child to reflect financial aid, scholarships, in-state vs out-of-state
- **Contribution scenarios** — monthly contribution sliders + preset buttons (Even $300, Front-load Marley, Prioritize younger, etc.)
- **One-time lump sum** — model bonus/tax refund contributions and see compounding impact
- **Projection engine** — calculates pre-college accumulation and during-college withdrawals with year-by-year snapshots
- **Visual dashboard** — stacked bar chart (coverage vs gap), pie chart (allocation by category), funding progress bars
- **Full investment options reference table** — all NY 529 portfolios with YTD, 1yr, 3yr, 5yr, 10yr returns and estimated forward return

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components (Card, Tabs, Slider)
- Recharts for data visualization
- Radix UI primitives

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Account Data (as of 03/27/2026)

| Child | Balance | Current Allocation | Timeline |
|-------|---------|-------------------|----------|
| Marley | $50,553 | 78% Growth Stock Index / 22% Moderate Growth | Freshman at UDel, 3 years remaining |
| Gabby | $55,683 | 100% Growth Stock Index | HS sophomore, ~2.5 years to college |
| Dean | $56,242 | 100% Growth Stock Index | HS freshman, ~3.5 years to college |

## Projection Assumptions

- Marley: conservative returns post-rebalance (~4%), already withdrawing
- Gabby: 7% pre-college / 5% during college (blended allocation)
- Dean: 8% pre-college / 5% during college (growth-tilted allocation)
- Cost sliders let you override all-in 4-year cost per child
- Expected returns derived from 5-year historical (preferred) or best available timeframe

## Disclaimer

Past performance is not a guarantee of future results. This tool is for educational planning purposes only and does not constitute financial advice. Data sourced from nysaves.org.
