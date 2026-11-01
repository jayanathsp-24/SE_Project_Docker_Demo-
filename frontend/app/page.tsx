"use client";

import { useEffect, useState } from "react";

interface WorkflowStep {
  id: string;
  title: string;
  status: string;
  order: number;
  description: string;
  completedAt?: string | null;
  documents: string[];
}

interface WorkflowData {
  caseId: string;
  clientName: string;
  headline: string;
  subtitle: string;
  cardTitle: string;
  category: string;
  progressPercentage: number;
  steps: WorkflowStep[];
}

const DEFAULT_WORKFLOW: WorkflowData = {
  caseId: "OBF-2026-904",
  clientName: "Apex Global Advisory Partners",
  headline: "Great partnerships\nstart here.",
  subtitle: "One place for your clients, documents and every step in between.",
  cardTitle: "A smoother start",
  category: "CLIENT ONBOARDING & DOCUMENT WORKFLOW",
  progressPercentage: 67,
  steps: [
    {
      id: "step-1",
      title: "Create your case",
      status: "Approved",
      order: 1,
      description: "Initial client KYC profile and case registration established.",
      completedAt: "2026-10-30T10:04:15.306Z",
      documents: ["Client_Profile_Form.pdf", "KYC_Verification.pdf"],
    },
    {
      id: "step-2",
      title: "Collect documents",
      status: "Approved",
      order: 2,
      description: "Required compliance paperwork, certificate of incorporation, and tax IDs uploaded.",
      completedAt: "2026-10-31T10:04:15.306Z",
      documents: [
        "Certificate_of_Incorporation.pdf",
        "Tax_Identification_W8BEN.pdf",
        "Signatory_Resolution.pdf",
      ],
    },
    {
      id: "step-3",
      title: "Review & approve",
      status: "In review",
      order: 3,
      description: "Legal counsel and compliance officers review submitted documents for final clearance.",
      completedAt: null,
      documents: ["Compliance_Audit_Checklist.pdf"],
    },
  ],
};

export default function Home() {
  const [data, setData] = useState<WorkflowData>(DEFAULT_WORKFLOW);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<WorkflowStep | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch workflow on initial load
  useEffect(() => {
    fetchWorkflow();
  }, []);

  const fetchWorkflow = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/onboarding/workflow`);
      if (res.ok) {
        const json: WorkflowData = await res.json();
        setData(json);
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      setIsBackendConnected(false);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    // Optimistic UI update
    setData((prev) => {
      const updatedSteps = prev.steps.map((s) => {
        if (s.id === stepId) {
          const nextStatus = s.status.toLowerCase() === "approved" ? "In review" : "Approved";
          return { ...s, status: nextStatus };
        }
        return s;
      });
      const approvedCount = updatedSteps.filter((s) => s.status.toLowerCase() === "approved").length;
      const progress = Math.round((approvedCount / updatedSteps.length) * 100);
      return {
        ...prev,
        steps: updatedSteps,
        progressPercentage: progress,
      };
    });

    try {
      const res = await fetch(`${apiUrl}/api/onboarding/steps/${stepId}/toggle`, {
        method: "POST",
      });
      if (res.ok) {
        const updated: WorkflowData = await res.json();
        setData(updated);
        setIsBackendConnected(true);
        setStatusMessage("Step status updated via backend API.");
      }
    } catch {
      setStatusMessage("Updated in local state (backend unreachable).");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/onboarding/reset`, {
        method: "POST",
      });
      if (res.ok) {
        const resetData: WorkflowData = await res.json();
        setData(resetData);
        setIsBackendConnected(true);
        setStatusMessage("Workflow reset to original screenshot state.");
      } else {
        setData(DEFAULT_WORKFLOW);
      }
    } catch {
      setData(DEFAULT_WORKFLOW);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d272d] text-white flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-20 font-sans selection:bg-[#00796b] selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            OnboardFlow
          </span>
        </div>

        {/* Live Backend Connection Indicator */}
        <div className="flex items-center gap-2 bg-[#12363e]/70 border border-[#1b4650] px-3 py-1.5 rounded-full text-xs text-[#a0bac0]">
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span>{isBackendConnected ? "Backend Connected (Port 5000)" : "Docker Dev Mode"}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl mx-auto my-auto flex flex-col pt-12 pb-16">
        {/* Hero Title */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.12]">
            Great partnerships
            <br />
            start here.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[#92adb2] font-normal leading-relaxed max-w-lg">
            One place for your clients, documents and every step in between.
          </p>
        </div>

        {/* Central Card Matching Reference Image */}
        <div className="bg-white text-slate-900 rounded-[22px] p-7 sm:p-9 shadow-2xl shadow-black/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#162329]">
              {data.cardTitle}
            </h2>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {data.caseId}
            </span>
          </div>

          {/* Workflow Steps List */}
          <div className="space-y-4">
            {data.steps.map((step) => {
              const isApproved = step.status.toLowerCase() === "approved";
              return (
                <div
                  key={step.id}
                  onClick={() => handleToggleStep(step.id)}
                  title="Click to toggle status"
                  className="group flex items-center justify-between py-2 cursor-pointer transition-colors duration-150 hover:bg-slate-50/80 rounded-xl px-2.5 -mx-2.5 select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base sm:text-[17px] font-medium text-[#203138] group-hover:text-[#0b242b] transition-colors">
                      {step.title}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStep(step);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded"
                      title="View step documents"
                    >
                      info
                    </button>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-xs sm:text-[13px] font-medium transition-all duration-200 ${
                        isApproved
                          ? "bg-[#e6f7ef] text-[#11734b] group-hover:bg-[#d8f2e5]"
                          : "bg-[#eaf0fd] text-[#3b66de] group-hover:bg-[#dfebfd]"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-7 pt-2">
            <div className="w-full bg-[#e7edee] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0b7c74] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${data.progressPercentage}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Progress: {data.progressPercentage}% complete</span>
              <span className="text-slate-400 text-[11px]">Click any step to toggle status</span>
            </div>
          </div>
        </div>

        {/* Footer Sub-caption Below Card */}
        <div className="mt-8 text-left">
          <p className="text-xs sm:text-[13px] font-semibold tracking-wider text-[#688a91] uppercase">
            {data.category}
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-[#143941] hover:bg-[#1b4b56] text-[#b3ccd2] hover:text-white transition-colors border border-[#1e4e59] flex items-center gap-1.5"
          >
            ↺ Reset Demo
          </button>
          <button
            type="button"
            onClick={() => handleToggleStep("step-3")}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-[#0e7490] hover:bg-[#0891b2] text-white transition-colors flex items-center gap-1.5 font-medium shadow-sm"
          >
            {data.steps.find((s) => s.id === "step-3")?.status.toLowerCase() === "approved"
              ? "Reopen Review"
              : "Approve Step 3 (100%)"}
          </button>

          {statusMessage && (
            <span className="text-emerald-300 font-medium animate-fade-in">
              ✓ {statusMessage}
            </span>
          )}
        </div>
      </main>

      {/* Document Details Modal */}
      {activeStep && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveStep(null)}
        >
          <div
            className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  Step {activeStep.order} Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeStep.title}</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  activeStep.status.toLowerCase() === "approved"
                    ? "bg-[#e6f7ef] text-[#11734b]"
                    : "bg-[#eaf0fd] text-[#3b66de]"
                }`}
              >
                {activeStep.status}
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4">{activeStep.description}</p>

            <div className="mb-5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Attached Documents ({activeStep.documents.length})
              </h4>
              <ul className="space-y-1.5">
                {activeStep.documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                  >
                    <span>📄</span>
                    <span className="font-mono">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleStep(activeStep.id);
                  setActiveStep((prev) =>
                    prev
                      ? {
                          ...prev,
                          status:
                            prev.status.toLowerCase() === "approved" ? "In review" : "Approved",
                        }
                      : null
                  );
                }}
                className="px-3.5 py-1.5 text-xs font-medium bg-[#0b7c74] hover:bg-[#096660] text-white rounded-lg transition-colors"
              >
                Toggle Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 border-t border-[#163840] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6e8e95] gap-3">
        <span>Team Decipher Group 28 · OnboardFlow Architecture</span>
        <div className="flex gap-4">
          <a
            href="http://localhost:5000/api/onboarding/workflow"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 transition-colors underline"
          >
            Backend API JSON ↗
          </a>
          <a
            href="http://localhost:5000/openapi/v1.json"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 transition-colors underline"
          >
            OpenAPI Docs ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
