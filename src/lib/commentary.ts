import {
  Allocation,
  investmentOptions,
  calculateBlendedReturn,
} from "@/data/investments";
import { ProjectionResult } from "@/lib/projections";
import { formatCurrency, formatPct } from "@/lib/utils";

export type InsightType = "positive" | "info" | "caution" | "warning";

export interface Insight {
  type: InsightType;
  headline: string;
  detail: string;
}

interface CommentaryParams {
  label: string;
  yearsToCollege: number;
  currentProjection: ProjectionResult;
  targetProjection: ProjectionResult;
  currentAllocs: Allocation[];
  targetAllocs: Allocation[];
}

export function generateCommentary({
  label,
  yearsToCollege,
  currentProjection,
  targetProjection,
  currentAllocs,
  targetAllocs,
}: CommentaryParams): Insight[] {
  const insights: Insight[] = [];

  const currentReturn = calculateBlendedReturn(currentAllocs, investmentOptions);
  const targetReturn = calculateBlendedReturn(targetAllocs, investmentOptions);
  const coverageDelta = targetProjection.covered - currentProjection.covered;
  const fundingDelta = targetProjection.percentFunded - currentProjection.percentFunded;

  // ── 1. Current coverage status ─────────────────────────────────────────────
  const topCurrentAlloc = [...currentAllocs].sort((a, b) => b.percentage - a.percentage)[0];
  const topCurrentOpt = investmentOptions.find((o) => o.id === topCurrentAlloc?.optionId);
  const isConcentrated = topCurrentAlloc && topCurrentAlloc.percentage >= 75;

  if (currentProjection.percentFunded >= 100) {
    if (isConcentrated && topCurrentOpt) {
      insights.push({
        type: "positive",
        headline: `${label}'s current holdings project to fully cover the ${formatCurrency(currentProjection.totalCost)} cost`,
        detail: `At ${formatPct(currentReturn)} annual return, the ${topCurrentOpt.shortName} (${topCurrentAlloc.percentage}%) is doing the heavy lifting. This projection relies on that fund continuing its strong historical performance — a meaningful correction before graduation would reduce coverage below 100%.`,
      });
    } else {
      insights.push({
        type: "positive",
        headline: `${label} is projected to be fully funded at current holdings`,
        detail: `At a ${formatPct(currentReturn)} blended return across ${currentAllocs.length} fund${currentAllocs.length > 1 ? "s" : ""}, the account projects to cover the full ${formatCurrency(currentProjection.totalCost)} — with some buffer.`,
      });
    }
  } else if (currentProjection.percentFunded >= 80) {
    insights.push({
      type: "info",
      headline: `${label} is ${currentProjection.percentFunded}% funded at current holdings`,
      detail: `The account projects to cover ${formatCurrency(currentProjection.covered)}, leaving a ${formatCurrency(currentProjection.gap)} gap at graduation. Additional contributions or a lump sum could close most of this.`,
    });
  } else if (currentProjection.percentFunded >= 60) {
    insights.push({
      type: "caution",
      headline: `${label}'s current allocation covers ${currentProjection.percentFunded}% of projected costs`,
      detail: `There's a ${formatCurrency(currentProjection.gap)} funding gap at graduation. Increasing contributions, adjusting the cost estimate, or improving the blended return could all help.`,
    });
  } else {
    insights.push({
      type: "warning",
      headline: `Significant gap: ${label}'s 529 covers only ${currentProjection.percentFunded}% at current holdings`,
      detail: `With a ${formatCurrency(currentProjection.gap)} shortfall projected, a meaningful change is needed — higher contributions, a lump sum, or a more aggressive target allocation (if the time horizon allows).`,
    });
  }

  // ── 2. Rebalancing impact (current → target) ──────────────────────────────
  if (Math.abs(coverageDelta) < 2000) {
    insights.push({
      type: "info",
      headline: "Current and target allocations project nearly identical outcomes",
      detail: `The difference is only ${formatCurrency(Math.abs(coverageDelta))} in projected coverage. The real tradeoff here is risk tolerance — the target allocation reduces concentration, not expected returns.`,
    });
  } else if (coverageDelta < 0) {
    // Target covers less (typical when recommending more conservative mix)
    const returnDiff = currentReturn - targetReturn;
    insights.push({
      type: "info",
      headline: `Rebalancing to the target reduces projected coverage by ${formatCurrency(Math.abs(coverageDelta))}`,
      detail: `The target allocation's ${formatPct(targetReturn)} blended return is ${formatPct(returnDiff)} lower than the current ${formatPct(currentReturn)}. That tradeoff buys meaningfully less concentration risk${yearsToCollege <= 3 ? `, which matters more as college gets closer` : ``}. Lower expected return, but smoother ride.`,
    });
  } else {
    // Target covers more
    const returnDiff = targetReturn - currentReturn;
    insights.push({
      type: "positive",
      headline: `The target allocation improves projected coverage by ${formatCurrency(coverageDelta)}`,
      detail: `A higher blended return (${formatPct(targetReturn)} vs. ${formatPct(currentReturn)} currently, +${formatPct(returnDiff)}) adds ${Math.abs(fundingDelta)}% more projected funding. This is a case where better diversification also improves expected returns.`,
    });
  }

  // ── 3. Concentration risk ─────────────────────────────────────────────────
  if (isConcentrated && topCurrentOpt && yearsToCollege <= 5) {
    const ytcLabel =
      yearsToCollege === 0
        ? "right now"
        : yearsToCollege <= 1
        ? "within a year"
        : `in ${yearsToCollege} years`;
    const riskLevel = yearsToCollege <= 1 ? "critical" : yearsToCollege <= 2 ? "significant" : "notable";
    insights.push({
      type: "warning",
      headline: `${topCurrentAlloc.percentage}% in ${topCurrentOpt.shortName} is a concentrated position`,
      detail: `With tuition needed ${ytcLabel}, a 25–30% market correction in ${topCurrentOpt.shortName} would be ${riskLevel} — there's limited time to recover. This is the main reason the recommended target diversifies away from this single-fund position.`,
    });
  }

  // ── 4. Time horizon context ────────────────────────────────────────────────
  if (yearsToCollege === 0) {
    insights.push({
      type: "info",
      headline: `${label} is in college now — capital preservation takes priority`,
      detail: `The standard approach: keep 1–2 years of tuition in stable, low-risk funds and let the remaining balance grow at a moderate rate. Chasing high returns while withdrawing is high-risk.`,
    });
  } else if (yearsToCollege <= 1.5) {
    insights.push({
      type: "caution",
      headline: `Only ${yearsToCollege} year${yearsToCollege === 1 ? "" : "s"} until first tuition bill`,
      detail: `There's almost no runway to recover from a market downturn. Shifting a meaningful portion to stable funds (short-term bonds, money market) before the first withdrawal date is a common risk-management move.`,
    });
  } else if (yearsToCollege <= 3) {
    insights.push({
      type: "info",
      headline: `${Math.round(yearsToCollege)} years to college — entering the transition window`,
      detail: `This is typically when it makes sense to start phasing down from aggressive growth into balanced funds. ${label} still has some recovery time if markets dip, but not unlimited runway.`,
    });
  } else {
    insights.push({
      type: "positive",
      headline: `${Math.round(yearsToCollege)} years of runway gives ${label} room to grow`,
      detail: `With this much time before tuition bills start, market dips are more recoverable. This is the phase to keep growth-oriented allocations and let compounding work. Shift toward capital preservation as college approaches.`,
    });
  }

  return insights;
}
