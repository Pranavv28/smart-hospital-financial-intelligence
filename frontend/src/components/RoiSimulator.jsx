import React, { useState, useMemo } from "react";
import {
  Calculator,
  RotateCcw,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { computeRoi } from "../utils/analytics.js";
import { formatINR, formatCompactINR } from "../utils/formatters.js";

const PRESETS = [
  {
    id: "mri",
    label: "Radiology: 3T MRI Scanner",
    investment: 24000000,
    volume: 450,
    avgRevenue: 8000,
    opCost: 1800000,
    unitName: "3T MRI Scanner",
  },
  {
    id: "cathlab",
    label: "Cardiology: Cath Lab Unit",
    investment: 45000000,
    volume: 180,
    avgRevenue: 38000,
    opCost: 3200000,
    unitName: "Cath Lab Unit",
  },
  {
    id: "ctscan",
    label: "Emergency: 128-Slice CT Scanner",
    investment: 18000000,
    volume: 620,
    avgRevenue: 4800,
    opCost: 1350000,
    unitName: "128-Slice CT Scanner",
  },
];

export default function RoiSimulator() {
  const [selectedPreset, setSelectedPreset] = useState("mri");

  // Inputs
  const [investment, setInvestment] = useState(24000000);
  const [baseVolume, setBaseVolume] = useState(450);
  const [avgRevenue, setAvgRevenue] = useState(8000);
  const [baseOpCost, setBaseOpCost] = useState(1800000);

  // Sliders (% delta)
  const [volumeDeltaPct, setVolumeDeltaPct] = useState(0);
  const [opCostDeltaPct, setOpCostDeltaPct] = useState(0);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setInvestment(preset.investment);
    setBaseVolume(preset.volume);
    setAvgRevenue(preset.avgRevenue);
    setBaseOpCost(preset.opCost);
    setVolumeDeltaPct(0);
    setOpCostDeltaPct(0);
  };

  const handleReset = () => {
    const current = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
    handleSelectPreset(current);
  };

  // Effective values
  const effectiveVolume = Math.round(baseVolume * (1 + volumeDeltaPct / 100));
  const effectiveOpCost = Math.round(baseOpCost * (1 + opCostDeltaPct / 100));

  // ROI computations
  const roiResults = useMemo(() => {
    return computeRoi(investment, effectiveVolume, avgRevenue, effectiveOpCost);
  }, [investment, effectiveVolume, avgRevenue, effectiveOpCost]);

  const {
    monthlyRevenue,
    monthlyContribution,
    annualContribution,
    breakEvenYears,
    roiPercentage,
  } = roiResults;

  // 5-Year Cash Flow Projection (Matching Reference Screen 3)
  const fiveYearProjection = useMemo(() => {
    const data = [];
    let cumulative = -investment;

    data.push({
      year: "Year 0",
      cumulativeCashFlow: cumulative,
      fill: "#059669",
    });

    for (let yr = 1; yr <= 5; yr++) {
      cumulative += annualContribution;
      data.push({
        year: `Year ${yr}`,
        cumulativeCashFlow: cumulative,
        fill: "#059669",
      });
    }
    return data;
  }, [investment, annualContribution]);

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner & Presets (Matching Reference Screen 3) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Hospital Capital Allocation and ROI Simulator
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Math Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate break-even timelines and return on capital for major medical equipment purchases.
            </p>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPreset === p.id
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* TWO COLUMN LAYOUT (Matching Reference Screen 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: CAPITAL PARAMETERS (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Capital Parameters
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Input 1: CapEx */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="text-slate-700 font-medium">
                  Initial Capex (Purchase + Installation)
                </label>
                <span className="text-slate-900 font-bold font-tabular">
                  {formatCompactINR(investment)}
                </span>
              </div>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-lg text-xs font-semibold text-slate-900 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                e.g. ₹2,40,00,000 for 3T MRI Scanner
              </p>
            </div>

            {/* Slider 1: Volume */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="text-slate-700 font-medium">
                  Monthly Patient Volume
                </label>
                <span className="text-slate-900 font-bold">
                  {effectiveVolume} scans/mo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={volumeDeltaPct}
                  onChange={(e) => setVolumeDeltaPct(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs font-bold text-blue-700 w-8 text-right">
                  {volumeDeltaPct}%
                </span>
              </div>
            </div>

            {/* Input 2: Avg Revenue per scan */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="text-slate-700 font-medium">
                  Average Revenue per Scan
                </label>
                <span className="text-slate-900 font-bold font-tabular">
                  {formatINR(avgRevenue)}
                </span>
              </div>
              <input
                type="number"
                value={avgRevenue}
                onChange={(e) => setAvgRevenue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-lg text-xs font-semibold text-slate-900 outline-none"
              />
            </div>

            {/* Slider 2: OpEx */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="text-slate-700 font-medium">
                  Monthly Operating Cost and Maintenance
                </label>
                <span className="text-slate-900 font-bold font-tabular">
                  {formatCompactINR(effectiveOpCost)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={opCostDeltaPct}
                  onChange={(e) => setOpCostDeltaPct(Number(e.target.value))}
                  className="flex-1 slider-amber"
                />
                <span className="text-xs font-bold text-rose-700 w-8 text-right">
                  {opCostDeltaPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECONCILED UNIT ECONOMICS & 5-YEAR CASHFLOW (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top 2 Metric Cards (Matching Reference Screen 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Estimated Break-Even Period */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#065F46] mb-1">
                <span className="text-xs font-bold">Estimated Break-Even Period</span>
                <Clock className="w-4 h-4 text-[#059669]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#065F46] font-tabular">
                  {breakEvenYears}
                </span>
                <span className="text-sm font-semibold text-[#065F46]">Years</span>
              </div>
              <p className="text-xs text-[#047857] mt-1 font-medium">
                ≈ {Math.round(breakEvenYears * 12)} months to full capital recovery
              </p>
            </div>

            {/* Card 2: Annualized ROI */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-[#1E40AF] mb-1">
                <span className="text-xs font-bold">Annualized ROI</span>
                <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#1E40AF] font-tabular">
                  {roiPercentage}%
                </span>
                <span className="text-sm font-semibold text-[#1E40AF]">/ year</span>
              </div>
              <p className="text-xs text-[#1D4ED8] mt-1 font-medium">
                Annual contribution: {formatCompactINR(annualContribution)}
              </p>
            </div>
          </div>

          {/* UNIT ECONOMICS RECONCILED (Matching Reference Screen 3) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Unit Economics Reconciled
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Live Computed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Monthly Revenue</span>
                <strong className="text-sm font-bold text-slate-900 font-tabular">
                  {formatCompactINR(monthlyRevenue)}
                </strong>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Monthly OpCost</span>
                <strong className="text-sm font-bold text-rose-600 font-tabular">
                  {formatCompactINR(effectiveOpCost)}
                </strong>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Monthly Contribution</span>
                <strong className="text-sm font-bold text-emerald-600 font-tabular">
                  {formatCompactINR(monthlyContribution)}
                </strong>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Annual Contribution</span>
                <strong className="text-sm font-bold text-emerald-600 font-tabular">
                  {formatCompactINR(annualContribution)}
                </strong>
              </div>
            </div>
          </div>

          {/* 5-YEAR CUMULATIVE CASH FLOW BALANCE (BAR CHART) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <div className="mb-3">
              <h3 className="text-xs font-bold text-slate-900">
                5-Year Cumulative Cashflow Balance (Post-Capex)
              </h3>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fiveYearProjection}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="year"
                    stroke="#94A3B8"
                    tick={{ fontSize: 10, fill: "#64748B" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fontSize: 10, fill: "#64748B" }}
                    tickFormatter={(val) => formatCompactINR(val)}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val) => [formatINR(val), "Cumulative Cash Flow"]}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <ReferenceLine y={0} stroke="#CBD5E1" />
                  <Bar
                    dataKey="cumulativeCashFlow"
                    fill="#059669"
                    radius={[3, 3, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
