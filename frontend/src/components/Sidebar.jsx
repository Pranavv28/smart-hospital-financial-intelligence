import React, { useState } from "react";
import {
  LayoutDashboard,
  Shield,
  Calculator,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { formatCompactINR } from "../utils/formatters.js";

export default function Sidebar({
  activeTab,
  setActiveTab,
  leakageCount = 0,
  potentialLeakage = 0,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
    {
      id: "leakage",
      label: "Leakage Discovery",
      icon: Shield,
      badge: leakageCount > 0 ? `${leakageCount}` : null,
    },
    { id: "roi", label: "ROI Simulator", icon: Calculator },
    { id: "forecast", label: "Revenue Forecast", icon: TrendingUp },
    { id: "copilot", label: "AI Copilot", icon: Sparkles },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen bg-[#FAFAFC] border-r border-slate-200/90 flex flex-col justify-between transition-all duration-200 ease-in-out z-40 shrink-0 select-none ${
        isCollapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-200/80 bg-[#FAFAFC] justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Blue Brand Icon Box */}
            <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white shadow-xs shrink-0">
              <Shield className="w-5 h-5 text-white fill-white/10" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight overflow-hidden">
                <span className="font-bold text-slate-900 text-sm block truncate tracking-tight">
                  AegisFinance
                </span>
                <span className="text-[10px] text-slate-500 font-medium block truncate">
                  Hospital Intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center transition-all duration-150 ease-out cursor-pointer ${
                    !isCollapsed
                      ? `gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? "bg-[#EFF6FF] text-[#1D4ED8] font-bold border border-blue-200/60 shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent"
                        }`
                      : `w-11 h-11 mx-auto rounded-xl justify-center ${
                          isActive
                            ? "bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200 shadow-xs"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                        }`
                  }`}
                >
                  {/* Left-edge active bar for expanded */}
                  {!isCollapsed && isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#1D4ED8] rounded-r" />
                  )}

                  <Icon
                    className={`shrink-0 ${
                      !isCollapsed ? "w-4 h-4" : "w-5 h-5"
                    } ${
                      isActive
                        ? "text-[#1D4ED8]"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate tracking-tight">
                      {item.label}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Collapsed Tooltip on Hover */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Sync Tag */}
      <div className="p-4 border-t border-slate-200/80 text-[11px] text-slate-400">
        {!isCollapsed ? (
          <div className="flex items-center justify-between font-medium">
            <span>Q3 2026 • Ledger Sync</span>
          </div>
        ) : (
          <div className="text-center font-bold text-[10px] text-slate-400">
            Q3
          </div>
        )}
      </div>
    </aside>
  );
}
