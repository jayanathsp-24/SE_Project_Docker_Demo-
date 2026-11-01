"use client";

import { useEffect, useState } from "react";
import LoginPage from "./login/page";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("onboardflow_token");
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("onboardflow_token");
      setIsAuthenticated(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Avoid flash before reading local storage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0d272d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  // If not logged in, show Login Screen. When logged in, show the Workflow Interface!
  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
}
