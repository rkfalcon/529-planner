import { Allocation, investmentOptions, calculateBlendedReturn } from "@/data/investments";

export interface ChildConfig {
  name: string;
  currentBalance: number;
  monthlyContribution: number;
  lumpSum: number;
  totalCost: number;
  yearsToCollege: number;
  yearsInCollege: number;
  allocations: Allocation[];
  duringCollegeReturn: number;
}

export interface ProjectionResult {
  covered: number;
  totalCost: number;
  gap: number;
  percentFunded: number;
  preCollegeReturn: number;
  duringCollegeReturn: number;
  yearByYear: YearSnapshot[];
}

export interface YearSnapshot {
  year: number;
  label: string;
  startBalance: number;
  contributions: number;
  growth: number;
  withdrawal: number;
  endBalance: number;
}

export function projectChild(config: ChildConfig): ProjectionResult {
  const preReturn = calculateBlendedReturn(config.allocations, investmentOptions) / 100;
  const durReturn = preReturn; // Use the same blended allocation return during college so allocation changes affect all phases
  const yearByYear: YearSnapshot[] = [];

  let bal = config.currentBalance + config.lumpSum;
  const mo = config.monthlyContribution;

  // Pre-college accumulation
  const preYears = Math.floor(config.yearsToCollege);
  const fractionalYear = config.yearsToCollege - preYears;

  for (let y = 0; y < preYears; y++) {
    const start = bal;
    const contrib = mo * 12;
    const growth = bal * preReturn;
    bal = bal * (1 + preReturn) + contrib;
    yearByYear.push({
      year: y + 1,
      label: `Pre-college yr ${y + 1}`,
      startBalance: Math.round(start),
      contributions: Math.round(contrib),
      growth: Math.round(growth),
      withdrawal: 0,
      endBalance: Math.round(bal),
    });
  }

  // Fractional year
  if (fractionalYear > 0) {
    const start = bal;
    const contrib = mo * 12 * fractionalYear;
    const growth = bal * preReturn * fractionalYear;
    bal = bal * (1 + preReturn * fractionalYear) + contrib;
    yearByYear.push({
      year: preYears + 1,
      label: `Pre-college (partial)`,
      startBalance: Math.round(start),
      contributions: Math.round(contrib),
      growth: Math.round(growth),
      withdrawal: 0,
      endBalance: Math.round(bal),
    });
  }

  // College years with withdrawals
  const annualCost = config.totalCost / config.yearsInCollege;
  let totalWithdrawn = 0;

  for (let y = 0; y < config.yearsInCollege; y++) {
    const start = bal;
    const withdraw = Math.min(bal, annualCost);
    bal -= withdraw;
    totalWithdrawn += withdraw;
    const growth = bal * durReturn;
    const contrib = mo * 12;
    bal = bal * (1 + durReturn) + contrib;
    yearByYear.push({
      year: preYears + (fractionalYear > 0 ? 2 : 1) + y,
      label: `College yr ${y + 1}`,
      startBalance: Math.round(start),
      contributions: Math.round(contrib),
      growth: Math.round(growth),
      withdrawal: Math.round(withdraw),
      endBalance: Math.round(bal),
    });
  }

  // Add remaining balance
  totalWithdrawn += Math.max(0, bal);

  const totalCost = Math.round(config.totalCost);
  const covered = Math.round(Math.min(totalWithdrawn, totalCost));
  const gap = Math.round(Math.max(0, totalCost - covered));

  return {
    covered,
    totalCost,
    gap,
    percentFunded: totalCost > 0 ? Math.min(100, Math.round((covered / totalCost) * 100)) : 0,
    preCollegeReturn: preReturn * 100,
    duringCollegeReturn: config.duringCollegeReturn,
    yearByYear,
  };
}

export function projectMarley(config: ChildConfig): ProjectionResult {
  const preReturn = calculateBlendedReturn(config.allocations, investmentOptions) / 100;
  const yearByYear: YearSnapshot[] = [];

  let bal = config.currentBalance + config.lumpSum;
  const mo = config.monthlyContribution;
  const annualCost = config.totalCost / config.yearsInCollege;
  let totalWithdrawn = 0;

  // Marley is already in college — 3 years remaining
  for (let y = 0; y < config.yearsInCollege; y++) {
    const start = bal;
    const withdraw = Math.min(bal, annualCost);
    bal -= withdraw;
    totalWithdrawn += withdraw;
    const growth = bal * preReturn;
    const contrib = mo * 12;
    bal = bal * (1 + preReturn) + contrib;
    yearByYear.push({
      year: y + 1,
      label: `College yr ${y + 2}`, // She's a freshman, these are remaining years
      startBalance: Math.round(start),
      contributions: Math.round(contrib),
      growth: Math.round(growth),
      withdrawal: Math.round(withdraw),
      endBalance: Math.round(bal),
    });
  }

  totalWithdrawn += Math.max(0, bal);

  const totalCost = Math.round(config.totalCost);
  const covered = Math.round(Math.min(totalWithdrawn, totalCost));
  const gap = Math.round(Math.max(0, totalCost - covered));

  return {
    covered,
    totalCost,
    gap,
    percentFunded: totalCost > 0 ? Math.min(100, Math.round((covered / totalCost) * 100)) : 0,
    preCollegeReturn: preReturn * 100,
    duringCollegeReturn: preReturn * 100,
    yearByYear,
  };
}
