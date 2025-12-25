import { useState } from "react";
import { LayoutDashboard, Settings, User, LogOut, Menu, X } from "lucide-react";

import ThemeToggle from "./utils/ThemeToggle";
import NavButton from "./NavButton";
import UserMenu from "./UserMenu";

// --- Types ---
type TabType = "Dashboard" | "Settings";

interface NavbarProps {
  session: { username: string; token: string } | null;
  onLogout: () => void;
  activeTab: TabType;
  setActiveTab: (tab: "Dashboard" | "Settings") => void;
}

export default function Navbar({
  session,
  onLogout,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side: Brand/Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center mr-3 transition-colors">
                <span className="text-white dark:text-black font-bold text-lg">
                  V
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-500 dark:text-blue-500">
                VinnoDrive
              </span>
            </div>

            {/* Desktop Navigation Links */}
            {session && (
              <div className="hidden md:flex justify-between space-x-2">
                <NavButton
                  label="Dashboard"
                  icon={<LayoutDashboard size={18} />}
                  isActive={activeTab === "Dashboard"}
                  onClick={() => setActiveTab("Dashboard")}
                />
                <NavButton
                  label="Settings"
                  icon={<Settings size={18} />}
                  isActive={activeTab === "Settings"}
                  onClick={() => setActiveTab("Settings")}
                />
              </div>
            )}
          </div>
          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {session ? (
              <UserMenu
                username={session.username}
                onLogout={onLogout}
                setActiveTab={setActiveTab}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 animate-pulse" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export type { TabType };
