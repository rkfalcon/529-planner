"use client";
import React, { useState } from "react";
import {
  investmentOptions,
  Allocation,
  categoryColors,
  categoryLabels,
  getExpectedReturn,
  calculateBlendedReturn,
  type InvestmentOption,
} from "@/data/investments";
import { Slider } from "@/components/ui/slider";
import { formatPct } from "@/lib/utils";

interface AllocationEditorProps {
  allocations: Allocation[];
  onChange: (allocations: Allocation[]) => void;
  childColor: string;
}

export function AllocationEditor({ allocations, onChange, childColor }: AllocationEditorProps) {
  const [showAdd, setShowAdd] = useState(false);

  const totalPct = allocations.reduce((s, a) => s + a.percentage, 0);
  const blendedReturn = calculateBlendedReturn(allocations, investmentOptions);

  const handleSliderChange = (optionId: string, value: number) => {
    const updated = allocations.map((a) =>
      a.optionId === optionId ? { ...a, percentage: value } : a
    );
    onChange(updated);
  };

  const handleRemove = (optionId: string) => {
    onChange(allocations.filter((a) => a.optionId !== optionId));
  };

  const handleAdd = (optionId: string) => {
    if (allocations.find((a) => a.optionId === optionId)) return;
    onChange([...allocations, { optionId, percentage: 10 }]);
    setShowAdd(false);
  };

  const availableToAdd = investmentOptions.filter(
    (o) => !allocations.find((a) => a.optionId === o.id)
  );

  const grouped = Object.entries(
    availableToAdd.reduce<Record<string, InvestmentOption[]>>((acc, opt) => {
      (acc[opt.category] = acc[opt.category] || []).push(opt);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Blended return:</span>
          <span className="text-lg font-semibold" style={{ color: childColor }}>
            {formatPct(blendedReturn)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Total: {totalPct}%
          {totalPct !== 100 && (
            <span className="ml-1 text-red-500 font-medium">(should be 100%)</span>
          )}
        </div>
      </div>

      {/* Total allocation bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(totalPct, 100)}%`,
            backgroundColor: totalPct === 100 ? childColor : totalPct > 100 ? "#E24B4A" : "#BA7517",
          }}
        />
      </div>

      {/* Individual allocations */}
      <div className="space-y-2">
        {allocations.map((alloc) => {
          const opt = investmentOptions.find((o) => o.id === alloc.optionId);
          if (!opt) return null;
          const expReturn = getExpectedReturn(opt);
          return (
            <div key={alloc.optionId} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoryColors[opt.category] }}
                    />
                    <span className="text-sm font-medium truncate">{opt.shortName}</span>
                  </div>
                  <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground ml-4">
                    <span>Est. return: {formatPct(expReturn)}</span>
                    <span>YTD: {formatPct(opt.ytdReturn)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold w-10 text-right">{alloc.percentage}%</span>
                  <button
                    onClick={() => handleRemove(alloc.optionId)}
                    className="text-muted-foreground hover:text-red-500 transition-colors text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <Slider
                value={[alloc.percentage]}
                onValueChange={([v]) => handleSliderChange(alloc.optionId, v)}
                min={0}
                max={100}
                step={5}
                trackColor={childColor}
                className="mt-1"
              />
            </div>
          );
        })}
      </div>

      {/* Add new allocation */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-2 text-sm text-muted-foreground border border-dashed rounded-lg hover:bg-muted/50 transition-colors"
        >
          + Add investment option
        </button>
      ) : (
        <div className="border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Select an option</span>
            <button
              onClick={() => setShowAdd(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          {grouped.map(([category, opts]) => (
            <div key={category}>
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1 mt-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                {categoryLabels[category]}
              </div>
              {opts.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAdd(opt.id)}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted/80 transition-colors flex justify-between items-center"
                >
                  <span>{opt.shortName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatPct(getExpectedReturn(opt))} est.
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
