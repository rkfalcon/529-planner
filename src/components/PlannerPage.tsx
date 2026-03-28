"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChildPlannerCard, type ChildState } from "@/components/ChildPlannerCard";
import { recommendedAllocations, investmentOptions, getExpectedReturn, categoryColors, categoryLabels, calculateBlendedReturn } from "@/data/investments";
import { projectChild, projectMarley, type ProjectionResult } from "@/lib/projections";
import { AllocationEditor } from "@/components/AllocationEditor";
import { formatCurrency, formatPct } from "@/lib/utils";

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

        {/* Projected outcomes snapshot */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Projected outcomes by graduation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(CHILDREN) as ChildKey[]).map((key) => (
                <ChildSnapshot
                  key={key}
                  label={CHILDREN[key].label}
                  color={CHILDREN[key].color}
                  state={states[key]}
                  projection={projections[key]}
                  onChange={(updates) => updateChild(key, updates)}
                />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">Total cost (3 kids)</div>
                <div className="text-base font-bold mt-0.5">{formatCurrency(totalCost)}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">529 covers</div>
                <div className="text-base font-bold mt-0.5 text-emerald-600">{formatCurrency(totalCovered)}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">Total gap</div>
                <div className="text-base font-bold mt-0.5 text-amber-600">{formatCurrency(totalGap)}</div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">New contributions</div>
                <div className="text-base font-bold mt-0.5">{formatCurrency(totalMonthly * 12)}<span className="text-sm font-normal text-muted-foreground">/yr</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

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

function ChildSnapshot({
  label,
  color,
  state,
  projection,
  onChange,
}: {
  label: string;
  color: string;
  state: ChildState;
  projection: ProjectionResult;
  onChange: (updates: Partial<ChildState>) => void;
}) {
  const [editingAlloc, setEditingAlloc] = useState(false);
  const blendedReturn = calculateBlendedReturn(state.allocations, investmentOptions);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="font-semibold text-sm">{label}</span>
      </div>

      {/* 4yr cost */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground">4yr cost</div>
        <div className="text-2xl font-bold mt-0.5">{formatCurrency(projection.totalCost)}</div>
      </div>

      {/* 529 covers / Gap */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-muted p-2 text-center">
          <div className="text-[11px] text-muted-foreground">529 covers</div>
          <div className="text-sm font-semibold text-emerald-600 mt-0.5">{formatCurrency(projection.covered)}</div>
        </div>
        <div className="rounded-lg bg-muted p-2 text-center">
          <div className="text-[11px] text-muted-foreground">Gap</div>
          <div className="text-sm font-semibold text-amber-600 mt-0.5">{formatCurrency(projection.gap)}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(projection.percentFunded, 100)}%`, backgroundColor: color }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-center">{projection.percentFunded}% funded</div>
      </div>

      {/* Allocations */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium">
            Allocations ·{" "}
            <span style={{ color }}>{formatPct(blendedReturn)} blended</span>
          </div>
          <button
            onClick={() => setEditingAlloc(!editingAlloc)}
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
          >
            {editingAlloc ? "Done" : "Edit"}
          </button>
        </div>
        {!editingAlloc ? (
          <div className="space-y-1.5">
            {state.allocations.map((alloc) => {
              const opt = investmentOptions.find((o) => o.id === alloc.optionId);
              if (!opt) return null;
              return (
                <div key={alloc.optionId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoryColors[opt.category] }}
                    />
                    <span className="text-muted-foreground truncate">{opt.shortName}</span>
                  </div>
                  <span className="font-medium ml-2 flex-shrink-0">{alloc.percentage}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <AllocationEditor
            allocations={state.allocations}
            onChange={(a) => onChange({ allocations: a })}
            childColor={color}
          />
        )}
      </div>
    </div>
  );
}
