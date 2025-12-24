import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

// --- Types ---
type TabType = "Dashboard" | "Settings";

interface Props {
  isDark: boolean;
  activeTab: TabType;
  setIsDark: (value: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}

const Navbar = ({ isDark, setIsDark, activeTab, setActiveTab }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name as TabType)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === item.name
                      ? "border-black dark:border-white text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Theme Toggle & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                  Vinno User
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 text-right">
                  Free Tier
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700">
                <User size={20} className="text-gray-600 dark:text-zinc-300" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 animate-in slide-in-from-top duration-300">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name as TabType);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                  activeTab === item.name
                    ? "bg-gray-50 dark:bg-zinc-800 border-black dark:border-white text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  <User
                    size={20}
                    className="text-gray-600 dark:text-zinc-300"
                  />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  Vinno User
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                  vinno@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800">
                <LogOut size={18} className="mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
export type { TabType };
