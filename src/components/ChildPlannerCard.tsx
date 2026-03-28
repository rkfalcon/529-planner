"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AllocationEditor } from "@/components/AllocationEditor";
import { type Allocation, recommendedAllocations, investmentOptions, categoryColors, calculateBlendedReturn } from "@/data/investments";
import { formatCurrency, formatPct } from "@/lib/utils";
import { type ProjectionResult } from "@/lib/projections";
import { generateCommentary, type InsightType } from "@/lib/commentary";

export interface ChildState {
  monthlyContribution: number;
  lumpSum: number;
  totalCost: number;
  allocations: Allocation[];
}

interface ChildPlannerCardProps {
  childKey: "marley" | "gabby" | "dean";
  label: string;
  subtitle: string;
  color: string;
  balance: number;
  yearsToCollege: number;
  state: ChildState;
  projection: ProjectionResult;
  currentProjection: ProjectionResult;
  currentAllocs: Allocation[];
  costRange: [number, number];
  onChange: (updates: Partial<ChildState>) => void;
}

const insightStyles: Record<InsightType, { bg: string; border: string; icon: string; iconColor: string }> = {
  positive: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: "✓", iconColor: "text-emerald-600" },
  info:     { bg: "bg-blue-50 dark:bg-blue-950/30",    border: "border-blue-200 dark:border-blue-800",    icon: "i", iconColor: "text-blue-600"    },
  caution:  { bg: "bg-amber-50 dark:bg-amber-950/30",  border: "border-amber-200 dark:border-amber-800",  icon: "!", iconColor: "text-amber-600"   },
  warning:  { bg: "bg-red-50 dark:bg-red-950/30",      border: "border-red-200 dark:border-red-800",      icon: "⚠", iconColor: "text-red-600"     },
};

export function ChildPlannerCard({
  childKey,
  label,
  subtitle,
  color,
  balance,
  yearsToCollege,
  state,
  projection,
  currentProjection,
  currentAllocs,
  costRange,
  onChange,
}: ChildPlannerCardProps) {
  const handleReset = () => {
    const rec = recommendedAllocations[childKey];
    onChange({ allocations: [...rec.allocations] });
  };

  const targetReturn = calculateBlendedReturn(state.allocations, investmentOptions);
  const currentReturn = calculateBlendedReturn(currentAllocs, investmentOptions);

  const insights = useMemo(() => generateCommentary({
    label,
    yearsToCollege,
    currentProjection,
    targetProjection: projection,
    currentAllocs,
    targetAllocs: state.allocations,
  }), [label, yearsToCollege, currentProjection, projection, currentAllocs, state.allocations]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: color }}
            >
              {label[0]}
            </div>
            <div>
              <CardTitle className="text-base">{label}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-base font-semibold">{formatCurrency(balance)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* 4yr cost — same for both scenarios */}
        <div className="rounded-lg bg-muted p-2.5 text-center">
          <div className="text-[11px] text-muted-foreground">4yr cost</div>
          <div className="text-base font-semibold mt-0.5">{formatCurrency(projection.totalCost)}</div>
        </div>

        {/* Current vs Target comparison */}
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-3 text-[11px]">
            {/* Column headers */}
            <div className="px-3 py-2 bg-muted/50 text-muted-foreground font-medium"></div>
            <div className="px-3 py-2 bg-muted/50 text-center text-muted-foreground font-medium border-l border-border">
              Current
            </div>
            <div className="px-3 py-2 bg-muted/50 text-center font-semibold border-l border-border" style={{ color }}>
              Target
            </div>

            {/* 529 covers */}
            <div className="px-3 py-2 text-muted-foreground border-t border-border">529 covers</div>
            <div className="px-3 py-2 text-center border-t border-l border-border">{formatCurrency(currentProjection.covered)}</div>
            <div className="px-3 py-2 text-center font-semibold text-emerald-600 border-t border-l border-border">{formatCurrency(projection.covered)}</div>

            {/* Gap */}
            <div className="px-3 py-2 text-muted-foreground border-t border-border">Gap</div>
            <div className="px-3 py-2 text-center border-t border-l border-border">{formatCurrency(currentProjection.gap)}</div>
            <div className="px-3 py-2 text-center font-semibold text-amber-600 border-t border-l border-border">{formatCurrency(projection.gap)}</div>

            {/* % funded */}
            <div className="px-3 py-2 text-muted-foreground border-t border-border">% funded</div>
            <div className="px-3 py-2 text-center border-t border-l border-border">{currentProjection.percentFunded}%</div>
            <div className="px-3 py-2 text-center font-semibold border-t border-l border-border">{projection.percentFunded}%</div>

            {/* Est. return */}
            <div className="px-3 py-2 text-muted-foreground border-t border-border">Est. return</div>
            <div className="px-3 py-2 text-center border-t border-l border-border">{formatPct(currentReturn)}</div>
            <div className="px-3 py-2 text-center font-semibold border-t border-l border-border" style={{ color }}>{formatPct(targetReturn)}</div>
          </div>
        </div>

        {/* Funding bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Current · {currentProjection.percentFunded}% funded</span>
              <span>{formatPct(currentReturn)} return</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-muted-foreground/40 transition-all duration-500"
                style={{ width: `${currentProjection.percentFunded}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Target · {projection.percentFunded}% funded</span>
              <span>{formatPct(targetReturn)} return</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${projection.percentFunded}%`, backgroundColor: color }}
              />
            </div>
          </div>
        </div>

        {/* Cost slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total 4-year cost</span>
            <span className="text-sm font-semibold">{formatCurrency(state.totalCost)}</span>
          </div>
          <Slider
            value={[state.totalCost]}
            onValueChange={([v]) => onChange({ totalCost: v })}
            min={costRange[0]}
            max={costRange[1]}
            step={5000}
            trackColor={color}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>{formatCurrency(costRange[0])}</span>
            <span>{formatCurrency(costRange[1])}</span>
          </div>
        </div>

        {/* Monthly contribution */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Monthly contribution</span>
            <span className="text-sm font-semibold">{formatCurrency(state.monthlyContribution)}</span>
          </div>
          <Slider
            value={[state.monthlyContribution]}
            onValueChange={([v]) => onChange({ monthlyContribution: v })}
            min={0}
            max={800}
            step={25}
            trackColor={color}
          />
        </div>

        {/* Lump sum */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              One-time lump sum
              {state.lumpSum > 0 && (
                <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  +{formatCurrency(state.lumpSum)}
                </span>
              )}
            </span>
            <span className="text-sm font-semibold">{formatCurrency(state.lumpSum)}</span>
          </div>
          <Slider
            value={[state.lumpSum]}
            onValueChange={([v]) => onChange({ lumpSum: v })}
            min={0}
            max={50000}
            step={1000}
            trackColor={color}
          />
        </div>

        {/* Today's holdings (read-only) */}
        <div>
          <div className="text-sm font-medium mb-2">Today's holdings</div>
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
            {currentAllocs.map((alloc) => {
              const opt = investmentOptions.find((o) => o.id === alloc.optionId);
              if (!opt) return null;
              return (
                <div key={alloc.optionId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[opt.category] }} />
                    <span className="text-muted-foreground truncate">{opt.shortName}</span>
                  </div>
                  <span className="font-medium ml-2 flex-shrink-0">{alloc.percentage}%</span>
                </div>
              );
            })}
            <div className="text-[11px] text-muted-foreground pt-1.5 border-t border-border/50 mt-1">
              Blended return: <span className="font-medium">{formatPct(currentReturn)}</span>
            </div>
          </div>
        </div>

        {/* Target allocation (editable) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Target allocation</span>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
            >
              Reset to recommended
            </button>
          </div>
          <AllocationEditor
            allocations={state.allocations}
            onChange={(a) => onChange({ allocations: a })}
            childColor={color}
          />
        </div>

        {/* Rationale */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <span className="font-medium">Recommended strategy: </span>
          {recommendedAllocations[childKey].rationale}
        </div>

        {/* Dynamic commentary */}
        <div className="space-y-2.5">
          <div className="text-sm font-medium">Analysis</div>
          {insights.map((insight, i) => {
            const s = insightStyles[insight.type];
            return (
              <div key={i} className={`rounded-lg border p-3 ${s.bg} ${s.border}`}>
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/70 dark:bg-black/30 ${s.iconColor}`}>
                    {s.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-snug mb-0.5">{insight.headline}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{insight.detail}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
