import React from "react";
import {
  X,
  Check,
  Shield,
  Briefcase,
  SearchCheck,
  TrendingUp,
  Award
} from "lucide-react";

export const ROLES = [
  {
    id: "cfo",
    title: "Chief Financial Officer (CFO)",
    subtitle: "Executive Governance and Capital Allocations",
    department: "Executive Committee",
    icon: Award,
    description: "Holistic oversight of institutional EBITDA, multi-crore Capex decisions, and board-level risk controls.",
    accessLevel: "Unrestricted Executive",
  },
  {
    id: "cro",
    title: "Director of Revenue Cycle",
    subtitle: "Billing Operations and Claims Adjudication",
    department: "Finance and Accounts",
    icon: TrendingUp,
    description: "Auditing billing discrepancies, preventing unbilled diagnostic leakage, and speeding up TPA settlements.",
    accessLevel: "Operational Finance",
  },
  {
    id: "auditor",
    title: "Chief Internal Auditor",
    subtitle: "Compliance and Anomaly Detection",
    department: "Clinical Audit and Risk",
    icon: SearchCheck,
    description: "Investigating departmental clinical variances, EHR documentation gaps, and billing ledger reconciliations.",
    accessLevel: "Audit and Forensics",
  },
  {
    id: "ops_head",
    title: "Head of Hospital Operations",
    subtitle: "Diagnostic Equipment and Departmental Margins",
    department: "Clinical Operations",
    icon: Briefcase,
    description: "Evaluating machine utilization, department cost structures, and clinical service line profitability.",
    accessLevel: "Operational Leadership",
  },
];

export default function LoginModal({ isOpen, onClose, currentRole, onSelectRole }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Perspective and Role Switcher</h3>
              <p className="text-xs text-slate-500">Select an institutional profile for role-tailored financial perspectives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = currentRole.id === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role);
                  onClose();
                }}
                className={`p-3.5 rounded-md border transition-colors cursor-pointer flex items-start space-x-3 ${
                  isSelected
                    ? "bg-blue-50 border-blue-400 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`p-2 rounded border flex-shrink-0 ${
                    isSelected
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight">{role.title}</h4>
                    {isSelected && (
                      <span className="flex items-center text-[11px] text-blue-900 font-semibold">
                        <Check className="w-3.5 h-3.5 mr-1" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-blue-950 mt-0.5">{role.subtitle}</p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{role.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Role-Based Perspective Simulation</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-medium text-xs transition-colors shadow-xs"
          >
            Apply and Close
          </button>
        </div>
      </div>
    </div>
  );
}
