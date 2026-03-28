"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AllocationEditor } from "@/components/AllocationEditor";
import { type Allocation, recommendedAllocations } from "@/data/investments";
import { formatCurrency } from "@/lib/utils";
import { type ProjectionResult } from "@/lib/projections";

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
  state: ChildState;
  projection: ProjectionResult;
  costRange: [number, number];
  onChange: (updates: Partial<ChildState>) => void;
}

export function ChildPlannerCard({
  childKey,
  label,
  subtitle,
  color,
  balance,
  state,
  projection,
  costRange,
  onChange,
}: ChildPlannerCardProps) {
  const handleReset = () => {
    const rec = recommendedAllocations[childKey];
    onChange({ allocations: [...rec.allocations] });
  };

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
        {/* Projection summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted p-2.5 text-center">
            <div className="text-[11px] text-muted-foreground">4yr cost</div>
            <div className="text-sm font-semibold mt-0.5">{formatCurrency(projection.totalCost)}</div>
          </div>
          <div className="rounded-lg bg-muted p-2.5 text-center">
            <div className="text-[11px] text-muted-foreground">529 covers</div>
            <div className="text-sm font-semibold mt-0.5 text-emerald-600">{formatCurrency(projection.covered)}</div>
          </div>
          <div className="rounded-lg bg-muted p-2.5 text-center">
            <div className="text-[11px] text-muted-foreground">Gap</div>
            <div className="text-sm font-semibold mt-0.5 text-amber-600">{formatCurrency(projection.gap)}</div>
          </div>
        </div>

        {/* Funding bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{projection.percentFunded}% funded</span>
            <span>Est. return: {projection.preCollegeReturn.toFixed(1)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${projection.percentFunded}%`, backgroundColor: color }}
            />
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

        {/* Investment allocation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Investment allocation</span>
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
      </CardContent>
    </Card>
  );
}
