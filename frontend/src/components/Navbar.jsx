import React from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Calculator,
  Bot,
  TrendingUp,
  RefreshCw,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { formatCompactINR } from "../utils/formatters.js";

export default function Navbar({
  activeTab,
  setActiveTab,
  leakageCount = 0,
  potentialLeakage = 0,
  onResetData,
}) {
  const navItems = [
    { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
    {
      id: "leakage",
      label: "Revenue Leakage",
      icon: AlertTriangle,
      badge: leakageCount > 0 ? `${leakageCount}` : null,
    },
    { id: "roi", label: "ROI Simulator", icon: Calculator },
    { id: "copilot", label: "Financial Copilot", icon: Bot },
    { id: "forecast", label: "Revenue Trajectory", icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  Smart Hospital Financial Intelligence
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  CFO Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Institutional RoI & Revenue Assurance System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-slate-900" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status / Reset */}
          <div className="flex items-center gap-2.5">
            {potentialLeakage > 0 ? (
              <button
                onClick={() => setActiveTab("leakage")}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium hover:bg-amber-100 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                <span>Unbilled: {formatCompactINR(potentialLeakage)}</span>
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Ledger Reconciled</span>
              </div>
            )}

            <button
              onClick={onResetData}
              title="Reset Demo Dataset"
              className="p-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
