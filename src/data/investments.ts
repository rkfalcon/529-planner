export interface InvestmentOption {
  id: string;
  name: string;
  shortName: string;
  category: "aggressive" | "growth" | "moderate" | "conservative" | "income";
  ytdReturn: number;
  oneYearReturn: number | null;
  threeYearReturn: number | null;
  fiveYearReturn: number | null;
  tenYearReturn: number | null;
  sinceInception: number | null;
  inceptionDate: string;
  unitPrice: number;
  description: string;
}

export const investmentOptions: InvestmentOption[] = [
  {
    id: "growth-stock-index",
    name: "Growth Stock Index Portfolio",
    shortName: "Growth Stock Idx",
    category: "aggressive",
    ytdReturn: -13.35,
    oneYearReturn: 19.33,
    threeYearReturn: 32.39,
    fiveYearReturn: 14.54,
    tenYearReturn: 17.34,
    sinceInception: 12.18,
    inceptionDate: "11/20/2003",
    unitPrice: 109.93,
    description: "Tracks large-cap growth stocks. Highest growth potential with highest volatility.",
  },
  {
    id: "global-equity",
    name: "Global Equity Portfolio",
    shortName: "Global Equity",
    category: "aggressive",
    ytdReturn: -4.11,
    oneYearReturn: 23.02,
    threeYearReturn: 20.22,
    fiveYearReturn: 11.06,
    tenYearReturn: 12.14,
    sinceInception: 9.70,
    inceptionDate: "11/14/2003",
    unitPrice: 74.36,
    description: "Diversified global stock portfolio. Strong returns with international exposure.",
  },
  {
    id: "us-stock-market-index",
    name: "U.S. Stock Market Index Portfolio",
    shortName: "US Stock Mkt Idx",
    category: "aggressive",
    ytdReturn: -6.33,
    oneYearReturn: 16.96,
    threeYearReturn: null,
    fiveYearReturn: null,
    tenYearReturn: null,
    sinceInception: 12.39,
    inceptionDate: "11/22/2024",
    unitPrice: 10.66,
    description: "Broad US stock market exposure across all market caps.",
  },
  {
    id: "social-index",
    name: "Social Index Portfolio",
    shortName: "Social Index",
    category: "aggressive",
    ytdReturn: -10.24,
    oneYearReturn: 17.18,
    threeYearReturn: 24.71,
    fiveYearReturn: null,
    tenYearReturn: null,
    sinceInception: 23.60,
    inceptionDate: "09/30/2022",
    unitPrice: 17.88,
    description: "ESG-screened large-cap US stocks.",
  },
  {
    id: "value-stock-index",
    name: "Value Stock Index Portfolio",
    shortName: "Value Stock Idx",
    category: "growth",
    ytdReturn: 1.81,
    oneYearReturn: 15.20,
    threeYearReturn: 13.38,
    fiveYearReturn: 12.51,
    tenYearReturn: 11.57,
    sinceInception: 9.34,
    inceptionDate: "11/20/2003",
    unitPrice: 73.31,
    description: "Large-cap value stocks. Lower volatility than growth, solid long-term returns.",
  },
  {
    id: "mid-cap-stock-index",
    name: "Mid-Cap Stock Index Portfolio",
    shortName: "Mid-Cap Idx",
    category: "growth",
    ytdReturn: -2.16,
    oneYearReturn: 11.60,
    threeYearReturn: 14.20,
    fiveYearReturn: 8.52,
    tenYearReturn: 10.83,
    sinceInception: 10.05,
    inceptionDate: "11/20/2003",
    unitPrice: 81.25,
    description: "Mid-cap stocks offering balance of growth potential and stability.",
  },
  {
    id: "small-cap-stock-index",
    name: "Small-Cap Stock Index Portfolio",
    shortName: "Small-Cap Idx",
    category: "growth",
    ytdReturn: -0.25,
    oneYearReturn: 8.77,
    threeYearReturn: 13.62,
    fiveYearReturn: 7.26,
    tenYearReturn: 10.34,
    sinceInception: 9.60,
    inceptionDate: "11/19/2003",
    unitPrice: 75.75,
    description: "Small-cap stocks. Higher risk with potential for outsized returns.",
  },
  {
    id: "developed-markets-index",
    name: "Developed Markets Index Portfolio",
    shortName: "Dev Mkts Idx",
    category: "growth",
    ytdReturn: -0.54,
    oneYearReturn: 35.02,
    threeYearReturn: 17.87,
    fiveYearReturn: 9.06,
    tenYearReturn: 8.65,
    sinceInception: 9.31,
    inceptionDate: "03/26/2009",
    unitPrice: 44.25,
    description: "International developed market stocks. Geographic diversification.",
  },
  {
    id: "international-stock-market-index",
    name: "International Stock Market Index Portfolio",
    shortName: "Intl Stock Idx",
    category: "growth",
    ytdReturn: -0.92,
    oneYearReturn: 31.88,
    threeYearReturn: null,
    fiveYearReturn: null,
    tenYearReturn: null,
    sinceInception: 26.67,
    inceptionDate: "11/22/2024",
    unitPrice: 12.87,
    description: "Broad international stock exposure including emerging markets.",
  },
  {
    id: "growth-portfolio",
    name: "Growth Portfolio",
    shortName: "Growth",
    category: "moderate",
    ytdReturn: -3.41,
    oneYearReturn: 19.70,
    threeYearReturn: 16.57,
    fiveYearReturn: 8.39,
    tenYearReturn: 9.76,
    sinceInception: 8.44,
    inceptionDate: "11/14/2003",
    unitPrice: 58.04,
    description: "Balanced portfolio tilted toward stocks (~80/20 stock/bond). Good core holding.",
  },
  {
    id: "moderate-growth",
    name: "Moderate Growth Portfolio",
    shortName: "Moderate Growth",
    category: "moderate",
    ytdReturn: -2.78,
    oneYearReturn: 16.23,
    threeYearReturn: 12.98,
    fiveYearReturn: 5.73,
    tenYearReturn: 7.33,
    sinceInception: 6.71,
    inceptionDate: "11/14/2003",
    unitPrice: 40.93,
    description: "Balanced portfolio (~60/40 stock/bond). Moderate risk and return.",
  },
  {
    id: "conservative-growth",
    name: "Conservative Growth Portfolio",
    shortName: "Conserv Growth",
    category: "moderate",
    ytdReturn: -2.06,
    oneYearReturn: 12.80,
    threeYearReturn: null,
    fiveYearReturn: null,
    tenYearReturn: null,
    sinceInception: 10.69,
    inceptionDate: "11/22/2024",
    unitPrice: 10.96,
    description: "Conservative balanced portfolio (~40/60 stock/bond).",
  },
  {
    id: "income-portfolio",
    name: "Income Portfolio",
    shortName: "Income",
    category: "conservative",
    ytdReturn: -1.48,
    oneYearReturn: 9.38,
    threeYearReturn: 8.40,
    fiveYearReturn: 2.40,
    tenYearReturn: 4.50,
    sinceInception: 4.72,
    inceptionDate: "11/14/2003",
    unitPrice: 27.33,
    description: "Income-focused with mostly bonds and some stock exposure (~20/80).",
  },
  {
    id: "bond-market-index",
    name: "Bond Market Index Portfolio",
    shortName: "Bond Mkt Idx",
    category: "conservative",
    ytdReturn: -0.73,
    oneYearReturn: 7.06,
    threeYearReturn: 4.58,
    fiveYearReturn: -0.50,
    tenYearReturn: 1.90,
    sinceInception: 3.01,
    inceptionDate: "11/20/2003",
    unitPrice: 19.11,
    description: "Broad US bond market index. Capital preservation with modest returns.",
  },
  {
    id: "conservative-income",
    name: "Conservative Income Portfolio",
    shortName: "Conserv Income",
    category: "income",
    ytdReturn: -0.16,
    oneYearReturn: 5.10,
    threeYearReturn: 4.51,
    fiveYearReturn: 1.08,
    tenYearReturn: 2.20,
    sinceInception: 2.83,
    inceptionDate: "11/14/2003",
    unitPrice: 18.51,
    description: "Very conservative. Short-term bonds and money market. Near-cash stability.",
  },
  {
    id: "short-term-bond-index",
    name: "Short Term Bond Market Index Portfolio",
    shortName: "Short Term Bond",
    category: "income",
    ytdReturn: -0.19,
    oneYearReturn: 5.99,
    threeYearReturn: null,
    fiveYearReturn: null,
    tenYearReturn: null,
    sinceInception: 5.50,
    inceptionDate: "11/22/2024",
    unitPrice: 10.59,
    description: "Short duration bonds. Low volatility, modest yield.",
  },
  {
    id: "international-bond-index",
    name: "International Bond Market Index Portfolio",
    shortName: "Intl Bond Idx",
    category: "income",
    ytdReturn: -1.07,
    oneYearReturn: 3.00,
    threeYearReturn: null,
    fiveYearReturn: null,
    tenYearReturn: null,
    sinceInception: 2.71,
    inceptionDate: "11/22/2024",
    unitPrice: 10.19,
    description: "International bond diversification.",
  },
  {
    id: "interest-accumulation",
    name: "Interest Accumulation Portfolio",
    shortName: "Interest Accum",
    category: "income",
    ytdReturn: 0.93,
    oneYearReturn: 3.72,
    threeYearReturn: 3.33,
    fiveYearReturn: 2.61,
    tenYearReturn: 2.18,
    sinceInception: 1.86,
    inceptionDate: "11/14/2003",
    unitPrice: 15.19,
    description: "Money market-like returns. Most stable option, lowest returns.",
  },
];

export function getExpectedReturn(option: InvestmentOption): number {
  // Use best available long-term return, weighted toward 5yr
  if (option.fiveYearReturn !== null) return option.fiveYearReturn;
  if (option.threeYearReturn !== null) return option.threeYearReturn * 0.6;
  if (option.oneYearReturn !== null) return option.oneYearReturn * 0.4;
  return option.sinceInception ?? 4;
}

export interface Allocation {
  optionId: string;
  percentage: number;
}

export interface RecommendedAllocation {
  allocations: Allocation[];
  rationale: string;
  expectedReturn: number;
}

export function calculateBlendedReturn(
  allocations: Allocation[],
  options: InvestmentOption[]
): number {
  let totalReturn = 0;
  let totalWeight = 0;
  for (const alloc of allocations) {
    const opt = options.find((o) => o.id === alloc.optionId);
    if (opt) {
      totalReturn += (alloc.percentage / 100) * getExpectedReturn(opt);
      totalWeight += alloc.percentage;
    }
  }
  return totalWeight > 0 ? totalReturn / (totalWeight / 100) : 4;
}

export const recommendedAllocations: Record<string, RecommendedAllocation> = {
  marley: {
    allocations: [
      { optionId: "conservative-income", percentage: 35 },
      { optionId: "income-portfolio", percentage: 35 },
      { optionId: "moderate-growth", percentage: 30 },
    ],
    rationale:
      "Actively withdrawing — bucket strategy protects near-term tuition while keeping some upside for year 3.",
    expectedReturn: 4.0,
  },
  gabby: {
    allocations: [
      { optionId: "growth-stock-index", percentage: 30 },
      { optionId: "value-stock-index", percentage: 25 },
      { optionId: "growth-portfolio", percentage: 25 },
      { optionId: "moderate-growth", percentage: 20 },
    ],
    rationale:
      "2.5 years out — diversify away from pure growth concentration, add value and balanced funds for stability.",
    expectedReturn: 7.0,
  },
  dean: {
    allocations: [
      { optionId: "growth-stock-index", percentage: 40 },
      { optionId: "global-equity", percentage: 25 },
      { optionId: "value-stock-index", percentage: 20 },
      { optionId: "growth-portfolio", percentage: 15 },
    ],
    rationale:
      "3.5 years of runway — stay aggressive with guardrails. Global equity and value diversify tech concentration.",
    expectedReturn: 8.0,
  },
};

export const categoryColors: Record<string, string> = {
  aggressive: "#E24B4A",
  growth: "#378ADD",
  moderate: "#1D9E75",
  conservative: "#BA7517",
  income: "#7F77DD",
};

export const categoryLabels: Record<string, string> = {
  aggressive: "Aggressive equity",
  growth: "Growth equity",
  moderate: "Balanced / moderate",
  conservative: "Conservative / bonds",
  income: "Income / money market",
};
