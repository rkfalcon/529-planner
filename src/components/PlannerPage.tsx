"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChildPlannerCard, type ChildState } from "@/components/ChildPlannerCard";
import { recommendedAllocations, investmentOptions, getExpectedReturn, categoryColors, categoryLabels } from "@/data/investments";
import { projectChild, projectMarley } from "@/lib/projections";
import { formatCurrency, formatPct } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell,
  PieChart, Pie,
} from "recharts";

const CHILDREN = {
  marley: { label: "Marley", color: "#E24B4A", balance: 50553, subtitle: "Freshman at UDel · withdrawing now", costRange: [40000, 260000] as [number, number], yearsToCollege: 0, yearsInCollege: 3 },
  gabby: { label: "Gabby", color: "#378ADD", balance: 55683, subtitle: "HS sophomore · college in ~2.5 yrs", costRange: [40000, 300000] as [number, number], yearsToCollege: 2.5, yearsInCollege: 4 },
  dean: { label: "Dean", color: "#1D9E75", balance: 56242, subtitle: "HS freshman · college in ~3.5 yrs", costRange: [40000, 300000] as [number, number], yearsToCollege: 3.5, yearsInCollege: 4 },
} as const;

type ChildKey = keyof typeof CHILDREN;

const PRESETS = [
  { label: "Even $300", m: 300, g: 300, d: 300 },
  { label: "Front-load Marley", m: 500, g: 250, d: 150 },
  { label: "Prioritize younger", m: 150, g: 400, d: 350 },
  { label: "Stop Marley", m: 0, g: 450, d: 450 },
  { label: "$1,200 total", m: 400, g: 400, d: 400 },
  { label: "Scale to $600", m: 200, g: 200, d: 200 },
];

export default function PlannerPage() {
  const [states, setStates] = useState<Record<ChildKey, ChildState>>({
    marley: {
      monthlyContribution: 300,
      lumpSum: 0,
      totalCost: 140000,
      allocations: [...recommendedAllocations.marley.allocations],
    },
    gabby: {
      monthlyContribution: 300,
      lumpSum: 0,
      totalCost: 215000,
      allocations: [...recommendedAllocations.gabby.allocations],
    },
    dean: {
      monthlyContribution: 300,
      lumpSum: 0,
      totalCost: 225000,
      allocations: [...recommendedAllocations.dean.allocations],
    },
  });

  const [activePreset, setActivePreset] = useState(0);

  const updateChild = (key: ChildKey, updates: Partial<ChildState>) => {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], ...updates } }));
  };

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setActivePreset(idx);
    setStates((prev) => ({
      ...prev,
      marley: { ...prev.marley, monthlyContribution: p.m },
      gabby: { ...prev.gabby, monthlyContribution: p.g },
      dean: { ...prev.dean, monthlyContribution: p.d },
    }));
  };

  const projections = useMemo(() => {
    const marley = projectMarley({
      name: "Marley",
      currentBalance: CHILDREN.marley.balance,
      monthlyContribution: states.marley.monthlyContribution,
      lumpSum: states.marley.lumpSum,
      totalCost: states.marley.totalCost,
      yearsToCollege: 0,
      yearsInCollege: 3,
      allocations: states.marley.allocations,
      duringCollegeReturn: 4,
    });
    const gabby = projectChild({
      name: "Gabby",
      currentBalance: CHILDREN.gabby.balance,
      monthlyContribution: states.gabby.monthlyContribution,
      lumpSum: states.gabby.lumpSum,
      totalCost: states.gabby.totalCost,
      yearsToCollege: 2.5,
      yearsInCollege: 4,
      allocations: states.gabby.allocations,
      duringCollegeReturn: 5,
    });
    const dean = projectChild({
      name: "Dean",
      currentBalance: CHILDREN.dean.balance,
      monthlyContribution: states.dean.monthlyContribution,
      lumpSum: states.dean.lumpSum,
      totalCost: states.dean.totalCost,
      yearsToCollege: 3.5,
      yearsInCollege: 4,
      allocations: states.dean.allocations,
      duringCollegeReturn: 5,
    });
    return { marley, gabby, dean };
  }, [states]);

  const totalCost = projections.marley.totalCost + projections.gabby.totalCost + projections.dean.totalCost;
  const totalCovered = projections.marley.covered + projections.gabby.covered + projections.dean.covered;
  const totalGap = projections.marley.gap + projections.gabby.gap + projections.dean.gap;
  const totalMonthly = states.marley.monthlyContribution + states.gabby.monthlyContribution + states.dean.monthlyContribution;
  const totalLump = states.marley.lumpSum + states.gabby.lumpSum + states.dean.lumpSum;

  const barData = (Object.keys(CHILDREN) as ChildKey[]).map((key) => ({
    name: CHILDREN[key].label,
    covered: projections[key].covered,
    gap: projections[key].gap,
  }));

  // Investment options reference data
  const optionsByCategory = investmentOptions.reduce<Record<string, typeof investmentOptions>>((acc, opt) => {
    (acc[opt.category] = acc[opt.category] || []).push(opt);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">NY 529 College Savings Planner</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Interactive rebalancing & projection tool for the Falcon family
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-muted-foreground">Portfolio prices as of</div>
              <div className="text-sm font-medium">03/27/2026</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Summary dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-xl bg-muted p-4">
            <div className="text-xs text-muted-foreground">Total cost (3 kids)</div>
            <div className="text-xl font-bold mt-1">{formatCurrency(totalCost)}</div>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <div className="text-xs text-muted-foreground">529 covers</div>
            <div className="text-xl font-bold mt-1 text-emerald-600">{formatCurrency(totalCovered)}</div>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <div className="text-xs text-muted-foreground">Total gap</div>
            <div className="text-xl font-bold mt-1 text-amber-600">{formatCurrency(totalGap)}</div>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <div className="text-xs text-muted-foreground">Monthly contributions</div>
            <div className="text-xl font-bold mt-1">{formatCurrency(totalMonthly)}</div>
          </div>
          <div className="rounded-xl bg-muted p-4 col-span-2 md:col-span-1">
            <div className="text-xs text-muted-foreground">Lump sums</div>
            <div className="text-xl font-bold mt-1">{formatCurrency(totalLump)}</div>
          </div>
        </div>

        {/* Preset contribution buttons */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick contribution presets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(i)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    activePreset === i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-muted border-border"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Coverage vs. gap by child</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barCategoryGap="20%">
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="covered" stackId="a" name="529 covers" fill="#1D9E75" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="gap" stackId="a" name="Gap" fill="#BA7517" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> 529 covers
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" /> Gap
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Current allocation by category (all accounts)</CardTitle>
            </CardHeader>
            <CardContent>
              <AllocationPieChart states={states} />
            </CardContent>
          </Card>
        </div>

        {/* Per-child planners */}
        <Tabs defaultValue="marley">
          <TabsList className="w-full grid grid-cols-3">
            {(Object.keys(CHILDREN) as ChildKey[]).map((key) => (
              <TabsTrigger key={key} value={key} className="text-sm">
                <span
                  className="w-2 h-2 rounded-full mr-1.5 inline-block"
                  style={{ backgroundColor: CHILDREN[key].color }}
                />
                {CHILDREN[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(CHILDREN) as ChildKey[]).map((key) => (
            <TabsContent key={key} value={key}>
              <ChildPlannerCard
                childKey={key}
                label={CHILDREN[key].label}
                subtitle={CHILDREN[key].subtitle}
                color={CHILDREN[key].color}
                balance={CHILDREN[key].balance}
                state={states[key]}
                projection={projections[key]}
                costRange={CHILDREN[key].costRange}
                onChange={(updates) => updateChild(key, updates)}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Investment options reference */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">NY 529 investment options reference</CardTitle>
            <p className="text-xs text-muted-foreground">
              Performance data as of 12/31/2025 · Portfolio prices as of 03/27/2026
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Portfolio</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Unit price</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">YTD</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">1 yr</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">3 yr</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">5 yr</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">10 yr</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Est. return</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(optionsByCategory).map(([cat, opts]) => (
                    <React.Fragment key={cat}>
                      <tr>
                        <td colSpan={8} className="pt-3 pb-1">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                            {categoryLabels[cat]}
                          </span>
                        </td>
                      </tr>
                      {opts.map((opt) => {
                        const er = getExpectedReturn(opt);
                        return (
                          <tr key={opt.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-1.5 pr-4">{opt.shortName}</td>
                            <td className="py-1.5 text-right">${opt.unitPrice.toFixed(2)}</td>
                            <td className={`py-1.5 text-right ${opt.ytdReturn >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                              {formatPct(opt.ytdReturn)}
                            </td>
                            <td className="py-1.5 text-right">{opt.oneYearReturn !== null ? formatPct(opt.oneYearReturn) : "—"}</td>
                            <td className="py-1.5 text-right">{opt.threeYearReturn !== null ? formatPct(opt.threeYearReturn) : "—"}</td>
                            <td className="py-1.5 text-right">{opt.fiveYearReturn !== null ? formatPct(opt.fiveYearReturn) : "—"}</td>
                            <td className="py-1.5 text-right">{opt.tenYearReturn !== null ? formatPct(opt.tenYearReturn) : "—"}</td>
                            <td className="py-1.5 text-right font-medium">{formatPct(er)}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Important disclosures</p>
          <p>
            Past performance is not a guarantee of future results. Investment returns and principal
            value will fluctuate. All projections are estimates based on historical returns and
            assumed growth rates. Actual results will vary. This tool is for educational planning
            purposes only and does not constitute financial advice. Consult a qualified financial
            advisor before making investment decisions. NY 529 allows exchange of existing assets
            twice per calendar year. Data sourced from nysaves.org as of 03/27/2026.
          </p>
        </div>
      </main>
    </div>
  );
}

function AllocationPieChart({ states }: { states: Record<ChildKey, ChildState> }) {
  const categoryTotals: Record<string, number> = {};
  let totalDollars = 0;

  for (const key of Object.keys(CHILDREN) as ChildKey[]) {
    const balance = CHILDREN[key].balance;
    for (const alloc of states[key].allocations) {
      const opt = investmentOptions.find((o) => o.id === alloc.optionId);
      if (opt) {
        const dollars = (alloc.percentage / 100) * balance;
        categoryTotals[opt.category] = (categoryTotals[opt.category] || 0) + dollars;
        totalDollars += dollars;
      }
    }
  }

  const pieData = Object.entries(categoryTotals)
    .filter(([, v]) => v > 0)
    .map(([cat, val]) => ({
      name: categoryLabels[cat],
      value: Math.round(val),
      color: categoryColors[cat],
      pct: Math.round((val / totalDollars) * 100),
    }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
          >
            {pieData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => formatCurrency(v)}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
        {pieData.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            {d.name} ({d.pct}%)
          </span>
        ))}
      </div>
    </div>
  );
}
