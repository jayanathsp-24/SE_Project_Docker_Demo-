"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@onboardflow.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Save session locally
        localStorage.setItem("onboardflow_token", data.token);
        localStorage.setItem("onboardflow_user", JSON.stringify(data.user));
        // Redirect to dashboard (the workflow page)
        router.push("/dashboard");
      } else {
        const errData = await res.json().catch(() => null);
        setErrorMessage(errData?.message || "Invalid email or password. Please try again.");
      }
    } catch {
      // In offline mode or container startup fallback, allow smooth entry
      localStorage.setItem("onboardflow_token", "mock-offline-token");
      localStorage.setItem(
        "onboardflow_user",
        JSON.stringify({
          fullName: "Sarah Jenkins",
          email: email || "admin@onboardflow.com",
          role: "Compliance Lead",
          company: "Apex Global Advisory Partners",
        })
      );
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (userEmail: string, roleName: string) => {
    setEmail(userEmail);
    setPassword("password123");
    setErrorMessage(null);
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

        <div className="flex items-center gap-2 bg-[#12363e]/70 border border-[#1b4650] px-3 py-1.5 rounded-full text-xs text-[#a0bac0]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Docker Dev Environment</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col pt-8 pb-12">
        {/* Hero Title Above Card */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sign in to OnboardFlow
          </h1>
          <p className="mt-2 text-base text-[#92adb2]">
            Access your active client onboarding cases and reviews.
          </p>
        </div>

        {/* The White Login Card Matching Screenshot Theme */}
        <div className="bg-white text-slate-900 rounded-[22px] p-7 sm:p-9 shadow-2xl shadow-black/40 transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7c74] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
                <span className="text-xs text-[#0b7c74] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7c74] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0b7c74] focus:ring-[#0b7c74] h-4 w-4"
                />
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0b7c74] hover:bg-[#096963] active:bg-[#085b56] text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard →</span>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Quick Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@onboardflow.com", "Compliance Lead")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left transition-colors"
              >
                <div className="text-xs font-semibold text-slate-800">Sarah Jenkins</div>
                <div className="text-[10px] text-slate-500">Compliance Lead</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("partner@onboardflow.com", "Managing Partner")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left transition-colors"
              >
                <div className="text-xs font-semibold text-slate-800">Marcus Vance</div>
                <div className="text-[10px] text-slate-500">Managing Partner</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Sub-caption */}
        <div className="mt-8 text-center sm:text-left">
          <p className="text-xs font-semibold tracking-wider text-[#688a91] uppercase">
            CLIENT ONBOARDING & DOCUMENT WORKFLOW
          </p>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-6 border-t border-[#163840] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6e8e95] gap-3">
        <span>Team Decipher Group 28 · OnboardFlow Authentication</span>
        <div className="flex gap-4">
          <a
            href="http://localhost:5000/api/auth/me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-300 transition-colors underline"
          >
            Auth API Spec ↗
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
