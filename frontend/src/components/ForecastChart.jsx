import React, { useState } from "react";
import {
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatINR, formatCompactINR } from "../utils/formatters.js";

export default function ForecastChart({ dashboardData }) {
  const [selectedScenario, setSelectedScenario] = useState("baseline");

  const scenarioConfig = {
    conservative: { growthRate: 0.02, momLabel: "2% MoM", projectedRev: 1380000, projectedCashflow: 920000, margin: "66.7%", confidence: "94.8%" },
    baseline: { growthRate: 0.05, momLabel: "5% MoM", projectedRev: 1490000, projectedCashflow: 1034000, margin: "69.4%", confidence: "92.4%" },
    aggressive: { growthRate: 0.09, momLabel: "9% MoM", projectedRev: 1640000, projectedCashflow: 1180000, margin: "72.0%", confidence: "88.6%" },
  };

  const currentSc = scenarioConfig[selectedScenario] || scenarioConfig.baseline;

  // Dynamic trajectory data with forecast points matching selected scenario
  const trajectoryData = [
    { month: "Dec 19", actual: 0, forecast: null, expenses: 0 },
    { month: "Jan 20", actual: 2000, forecast: null, expenses: 0 },
    { month: "Mar 20", actual: 5300, forecast: null, expenses: 0 },
    { month: "Apr 20", actual: 20000, forecast: null, expenses: 0 },
    { month: "May 20", actual: 6800, forecast: null, expenses: 0 },
    { month: "Jun 20", actual: 800, forecast: null, expenses: 0 },
    { month: "Mar 21", actual: 3800, forecast: null, expenses: 0 },
    { month: "Aug 21", actual: 3000, forecast: null, expenses: 0 },
    { month: "Oct 21", actual: 20000, forecast: null, expenses: 0 },
    { month: "May 22", actual: 65300, forecast: null, expenses: 0 },
    { month: "Nov 22", actual: 3000, forecast: null, expenses: 0 },
    { month: "Jan 23", actual: 5300, forecast: null, expenses: 0 },
    { month: "Jun 23", actual: 3000, forecast: null, expenses: 0 },
    { month: "Aug 23", actual: 3800, forecast: null, expenses: 0 },
    { month: "Mar 26", actual: 0, forecast: null, expenses: 142000 },
    { month: "Apr 26", actual: 0, forecast: null, expenses: 149000 },
    { month: "May 26", actual: 0, forecast: null, expenses: 125000 },
    { month: "Jun 26", actual: 0, forecast: null, expenses: 120000 },
    { month: "Jul 26", actual: 0, forecast: null, expenses: 135000 },
    { month: "Aug 26", actual: 0, forecast: 0, expenses: 146000 },
    { month: "Sep 26 (F)", actual: null, forecast: Math.round(480000 * (1 + (currentSc.growthRate - 0.05))), expenses: 148000 },
    { month: "Nov 26 (F)", actual: null, forecast: Math.round(550000 * (1 + (currentSc.growthRate - 0.05) * 2)), expenses: 152000 },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner & Scenario Selector (Matching Reference Screen 4) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Revenue and Margin Runway Forecast
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Q4 Runway
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical actuals vs predictive forward growth and operational inflation.
            </p>
          </div>
        </div>

        {/* Scenario Buttons */}
        <div className="flex items-center gap-1.5 self-start md:self-center">
          <span className="text-xs text-slate-400 font-medium mr-1">Scenario:</span>
          {["conservative", "baseline", "aggressive"].map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedScenario(sc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedScenario === sc
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* 3 METRIC CARDS (Matching Reference Screen 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Q4 Projected Revenue */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Q4 Projected Revenue (3-Month)
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
              {formatCompactINR(currentSc.projectedRev)}
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> {currentSc.momLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Weighted against 6-month historical intake
          </p>
        </div>

        {/* Card 2: Projected Net Operating Cashflow */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Projected Net Operating Cashflow
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-[#059669] tracking-tight font-tabular">
              {formatCompactINR(currentSc.projectedCashflow)}
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {currentSc.margin} margin
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            After AMC and consumables cost indexing
          </p>
        </div>

        {/* Card 3: Confidence Index */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Confidence Index
          </span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
              {currentSc.confidence}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>High Reliability</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Narrow ±4.0% confidence envelope
          </p>
        </div>
      </div>

      {/* DUAL LINE TRAJECTORY CHART (Matching Reference Screen 4) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-4 h-0.5 bg-[#059669]" />
              <span>Actual Revenue (Solid)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-900">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#1E3A8A]" />
              <span>Projected Revenue (Dashed)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600">
              <span className="w-4 h-0.5 bg-[#DC2626]" />
              <span>Expenses</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Projection start: <strong className="text-slate-700">Sep 2026</strong>
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trajectoryData}
              margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="forecastBlueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
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
                formatter={(val, name) => [
                  formatINR(val),
                  name === "actual"
                    ? "Actual Revenue"
                    : name === "forecast"
                    ? "Projected Revenue"
                    : "Expenses",
                ]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E2E8F0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="none"
                fill="url(#forecastBlueArea)"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#059669" }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#1E3A8A"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: "#1E3A8A" }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#DC2626"
                strokeWidth={2}
                dot={{ r: 3, fill: "#DC2626" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
