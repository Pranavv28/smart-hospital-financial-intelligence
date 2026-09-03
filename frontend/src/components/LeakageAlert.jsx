import React, { useState } from "react";
import {
  Shield,
  Search,
  PlusCircle,
  Zap,
} from "lucide-react";
import { formatINR } from "../utils/formatters.js";

export default function LeakageAlert({
  leakageAlerts = [],
  onResolveAnomaly,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [resolvingId, setResolvingId] = useState(null);
  const [recoveredAmount, setRecoveredAmount] = useState(0);
  const [recoveredCount, setRecoveredCount] = useState(0);

  // High-level summary metrics
  const totalLeakageAmount = leakageAlerts.reduce(
    (sum, alert) => sum + alert.impact,
    0
  );
  const totalAlertCount = leakageAlerts.length;

  // Filter alerts by search
  const filteredAlerts = leakageAlerts.filter((alert) => {
    return (
      searchQuery.trim() === "" ||
      alert.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.admissionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleBillAndResolve = async (alert) => {
    const key = `${alert.admissionId}-${alert.serviceId}`;
    setResolvingId(key);
    try {
      await onResolveAnomaly(alert.admissionId, alert.serviceId);
      setRecoveredAmount((prev) => prev + alert.impact);
      setRecoveredCount((prev) => prev + 1);
    } finally {
      setResolvingId(null);
    }
  };

  const handleBatchResolve = async () => {
    if (leakageAlerts.length === 0) return;
    for (const alert of leakageAlerts.slice(0, 3)) {
      await onResolveAnomaly(alert.admissionId, alert.serviceId);
      setRecoveredAmount((prev) => prev + alert.impact);
      setRecoveredCount((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner (Matching Reference Screen 2) */}
      <div className="p-5 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-[#B45309]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Audit Rule 1
              </span>
              <span className="text-xs font-semibold text-slate-800">
                Completed EHR Procedure vs Invoice Reconciliation
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Revenue Leakage and Missing Invoice Discovery
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              Detects completed clinical tests and procedures in medical charts that were omitted from patient billing invoices.
            </p>
          </div>
        </div>

        <button
          onClick={handleBatchResolve}
          className="self-start md:self-center shrink-0 px-4 py-2.5 rounded-lg bg-[#854D0E] hover:bg-[#713F12] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Generate Supplementary Bills</span>
        </button>
      </div>

      {/* 3 HIGHLIGHT CARDS (Matching Reference Screen 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Unbilled Revenue Gap */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D97706] rounded-l" />
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Unbilled Revenue Gap
          </span>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-tabular">
            {formatINR(totalLeakageAmount)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalAlertCount} unbilled discrepancies pending
          </p>
        </div>

        {/* Card 2: Recovered Revenue (This Session) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#059669] rounded-l" />
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Recovered Revenue (This Session)
          </span>
          <div className="text-2xl font-bold text-[#059669] tracking-tight font-tabular">
            {formatINR(recoveredAmount)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {recoveredCount} supplementary invoices created
          </p>
        </div>

        {/* Card 3: Root Cause Diagnostics */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Root Cause Diagnostics
          </span>
          <div className="text-sm font-bold text-slate-900 tracking-tight">
            Radiology PACS Integration Delay
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Recoverable through EHR ledger bridge
          </p>
        </div>
      </div>

      {/* FLAGGED DISCREPANCIES TABLE (Matching Reference Screen 2) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Flagged Discrepancies
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              {filteredAlerts.length} records
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by service, patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-lg text-xs text-slate-900 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Admission and Patient</th>
                <th className="pb-3">Completed Service</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Audit Reason</th>
                <th className="pb-3 text-right">Estimated Impact</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((alert, index) => {
                const itemKey = `${alert.admissionId}-${alert.serviceId}`;
                const isResolving = resolvingId === itemKey;

                return (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-slate-900 font-mono text-xs">
                        {alert.admissionId}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {alert.patientId === "p1"
                          ? "Haley Perkins"
                          : alert.patientId === "p2"
                          ? "Christopher Bright"
                          : alert.patientId === "p5"
                          ? "Peter Fitzgerald"
                          : "Cathy Small"}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">
                        {alert.serviceName}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Date: {alert.date || "2020-06-23"}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {alert.department}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 text-[11px] max-w-xs">
                      Completed clinical service omitted from final patient invoice
                    </td>
                    <td className="py-3 font-bold text-slate-900 text-right text-xs font-tabular">
                      {formatINR(alert.impact)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleBillAndResolve(alert)}
                        disabled={isResolving}
                        className="px-3 py-1.5 rounded-lg bg-[#065F46] hover:bg-[#047857] text-white text-xs font-semibold transition-all inline-flex items-center gap-1 shadow-2xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{isResolving ? "Adding..." : "Add to Bill"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
