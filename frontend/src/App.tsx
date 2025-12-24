import "./App.css";

import Navbar, { type TabType } from "./components/Navbar";
import Dashboard from "./components/Dashboard";

import { useState, useEffect } from "react";
import Settings from "./components/Settings";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");

  // Initialize state from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Handle Dark Mode Toggle with Persistence
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-300">
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "Dashboard" && <Dashboard />}
      {activeTab === "Settings" && <Settings />}
    </div>
  );
}

export default App;
