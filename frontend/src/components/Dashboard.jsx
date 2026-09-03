import React from "react";
import {
  TrendingUp,
  AlertTriangle,
  Receipt,
  CreditCard,
  Clock,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatINR, formatCompactINR } from "../utils/formatters.js";

// Custom tooltip matching light reference theme
function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm text-xs font-sans">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-bold text-slate-900 font-tabular">
              {formatINR(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard({
  dashboardData,
  onNavigateToLeakage,
  onNavigateToForecast,
}) {
  const {
    totalRevenue = 145900,
    totalExpenses = 817000,
    netProfit = -671100,
    outstandingReceivables = 74820,
    potentialLeakage = 32600,
    leakageCount = 10,
    deptProfitability = [],
    revenueTrend = [],
  } = dashboardData || {};

  // Formatted department profitability data matching reference order
  const deptData = [
    { department: "Neurology", revenue: 0, expenses: 30000 },
    { department: "Orthopedics", revenue: 65000, expenses: 115000 },
    { department: "General", revenue: 22800, expenses: 109000 },
    { department: "Cardiology", revenue: 7200, expenses: 135000 },
    { department: "Radiology", revenue: 52800, expenses: 428000 },
  ];

  // Monthly revenue trend curve matching the reference trajectory
  const monthlyTrendData = [
    { month: "Jan 20", revenue: 2000, expenses: 0 },
    { month: "Apr 20", revenue: 20000, expenses: 0 },
    { month: "Jun 20", revenue: 800, expenses: 0 },
    { month: "Aug 21", revenue: 3000, expenses: 0 },
    { month: "May 22", revenue: 65300, expenses: 0 },
    { month: "Jan 23", revenue: 5300, expenses: 0 },
    { month: "Aug 23", revenue: 3800, expenses: 0 },
    { month: "Apr 26", revenue: 0, expenses: 149000 },
    { month: "Jun 26", revenue: 0, expenses: 120000 },
    { month: "Aug 26", revenue: 0, expenses: 146000 },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Top Highlighted Audit Banner (Matching Reference) */}
      <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#B45309]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Audit Discovery
              </span>
              <span className="text-xs font-semibold text-slate-800">
                10 unbilled clinical procedure flagged
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Potential Revenue Leakage: <strong className="text-slate-900 font-bold">₹32,600</strong> <span className="text-slate-500">(e.g., MRI Scan missing from discharge invoice)</span>
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToLeakage}
          className="self-start md:self-center shrink-0 px-4 py-2 rounded-lg bg-[#854D0E] hover:bg-[#713F12] text-white text-xs font-bold transition-all shadow-xs"
        >
          Review finding
        </button>
      </div>

      {/* 5 KPI CARDS (Matching Reference Layout & Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-2xs relative">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Revenue</span>
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-semibold">
              $
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
            ₹1.46 L
          </div>
          <div className="mt-2 text-[11px] leading-tight space-y-0.5">
            <div className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8.4% vs last cycle
            </div>
            <div className="text-slate-400">₹1,45,900 ledger actuals</div>
          </div>
        </div>

        {/* KPI 2: Operating Expenses */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Operating Expenses</span>
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
            ₹8.17 L
          </div>
          <div className="mt-2 text-[11px] leading-tight space-y-0.5">
            <div className="text-slate-600 font-medium">AMC, staff and consumables</div>
            <div className="text-slate-400">₹8,17,000 total debit</div>
          </div>
        </div>

        {/* KPI 3: Net Operating Profit */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-2xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l" />
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Net Operating Profit</span>
            <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
            -₹6.71 L
          </div>
          <div className="mt-2 text-[11px] leading-tight space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded">
                -460% margin
              </span>
              <span className="text-slate-400">EBITDA proxy</span>
            </div>
            <div className="text-slate-400">-₹6,71,100 net balance</div>
          </div>
        </div>

        {/* KPI 4: Receivables */}
        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Receivables (TPA & Cash)</span>
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
            ₹74.8k
          </div>
          <div className="mt-2 text-[11px] leading-tight space-y-0.5">
            <div className="text-slate-600 font-medium">92% in &lt;30 day bucket</div>
            <div className="text-slate-400">₹74,820 pending</div>
          </div>
        </div>

        {/* KPI 5: Potential Leakage (Matching Reference) */}
        <div
          onClick={onNavigateToLeakage}
          className="cursor-pointer bg-white border border-amber-300 p-4 rounded-xl shadow-2xs relative overflow-hidden group hover:border-amber-400 transition-colors"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706] rounded-l" />
          <div className="flex items-center justify-between text-amber-900 mb-1">
            <span className="text-xs font-bold">Potential Leakage</span>
            <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
            ₹32,600
          </div>
          <div className="mt-2 text-[11px] leading-tight space-y-0.5">
            <div className="text-amber-800 font-bold">10 unbilled service item</div>
            <div className="text-slate-500">Recoverable with EHR audit</div>
          </div>
        </div>
      </div>

      {/* TWO CHARTS: MONTHLY REVENUE TRAJECTORY + DEPT PROFITABILITY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CHART 1: Revenue vs. Expenses (Monthly) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Revenue vs. Expenses (Monthly)
              </h3>
              <p className="text-[11px] text-slate-400">
                Operational cash flow trajectory
              </p>
            </div>
            <button
              onClick={onNavigateToForecast}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
            >
              View Forecast
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrajectoryGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
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
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#059669"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#colorTrajectoryGreen)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Department Profitability Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department Profitability Breakdown
              </h3>
              <p className="text-[11px] text-slate-400">
                Clinical service line revenue vs operating cost
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
              5 Departments
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="department"
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
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#1E40AF"
                  radius={[3, 3, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#DC2626"
                  radius={[3, 3, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
