import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LeakageAlert from "./components/LeakageAlert.jsx";
import RoiSimulator from "./components/RoiSimulator.jsx";
import AiCopilot from "./components/AiCopilot.jsx";
import ForecastChart from "./components/ForecastChart.jsx";
import {
  getDashboardData,
  getLeakageAlerts,
  resolveLeakageAnomaly,
  resetSeedData,
  getSeedData,
} from "./services/dataService.js";
import { CheckCircle2, Bell, User, ShieldCheck } from "lucide-react";
import { formatCompactINR } from "./utils/formatters.js";

// Static fallback seed data in case browser cannot fetch directly
import fallbackSeed from "../public/data/seed.json";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [leakageAlerts, setLeakageAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      await getSeedData();
      const stats = await getDashboardData();
      const alerts = await getLeakageAlerts();
      setDashboardData(stats);
      setLeakageAlerts(alerts);
    } catch (err) {
      console.warn("Falling back to bundled seed:", err);
      const stats = await getDashboardData(fallbackSeed);
      const alerts = await getLeakageAlerts(fallbackSeed);
      setDashboardData(stats);
      setLeakageAlerts(alerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1-Click resolve discrepancy simulation
  const handleResolveAnomaly = async (admissionId, serviceId) => {
    await resolveLeakageAnomaly(admissionId, serviceId);
    const updatedStats = await getDashboardData();
    const updatedAlerts = await getLeakageAlerts();
    setDashboardData(updatedStats);
    setLeakageAlerts(updatedAlerts);
  };

  // Reset demo data back to pristine state
  const handleResetData = async () => {
    await resetSeedData();
    await loadData();
  };

  const potentialLeakage = dashboardData?.potentialLeakage || 0;
  const leakageCount = dashboardData?.leakageCount || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-row font-sans">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leakageCount={leakageCount}
        potentialLeakage={potentialLeakage}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F8FAFC]">
        {/* Top Context Navigation Bar (Matching Reference) */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Metro Multispeciality Hospital
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
              Fiscal Q3 2026
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ledger Verified</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Unbilled Finding Pill Button */}
            {potentialLeakage > 0 && (
              <button
                onClick={() => setActiveTab("leakage")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] hover:bg-[#FEF3C7] text-xs font-semibold transition-colors shadow-2xs"
              >
                <Bell className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{formatCompactINR(potentialLeakage)} Unbilled Finding</span>
              </button>
            )}

            {/* Role Perspective Card */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <div className="leading-none text-left">
                <span className="text-[10px] text-slate-400 block font-normal">
                  Perspective
                </span>
                <span className="font-bold text-slate-900 text-[11px]">
                  Chief Financial Officer (CFO)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Screen Views */}
        <main className="flex-1 p-6 max-w-[1400px] w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">
                Loading hospital financial ledger...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard
                  dashboardData={dashboardData}
                  onNavigateToLeakage={() => setActiveTab("leakage")}
                  onNavigateToForecast={() => setActiveTab("forecast")}
                />
              )}

              {activeTab === "leakage" && (
                <LeakageAlert
                  leakageAlerts={leakageAlerts}
                  onResolveAnomaly={handleResolveAnomaly}
                />
              )}

              {activeTab === "roi" && <RoiSimulator />}

              {activeTab === "forecast" && (
                <ForecastChart dashboardData={dashboardData} />
              )}

              {activeTab === "copilot" && (
                <AiCopilot dashboardData={dashboardData} />
              )}
            </>
          )}
        </main>

        {/* Global Footer (Matching Reference) */}
        <footer className="border-t border-slate-200/90 py-3.5 px-6 bg-white text-slate-500 text-xs mt-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span className="font-bold text-slate-900">Aegis Health Intelligence</span>
            <span className="text-slate-400 font-normal">Financial Decision Support System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Deterministic Grounding (seed.json)</span>
            <span className="text-slate-700 font-medium">All Figures: INR (₹)</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
