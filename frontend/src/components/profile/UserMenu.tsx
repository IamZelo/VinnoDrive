import React, { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  username: string;
  onLogout: () => void;
  setActiveTab: (tab: "Dashboard" | "Settings") => void;
}

export default function UserMenu({
  username,
  onLogout,
  setActiveTab,
}: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to get initials
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="relative">
      {/* User Trigger */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {getInitials(username)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
            {username}
          </p>
          <p className="text-[10px] text-gray-500 font-medium">Free Plan</p>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Invisible Backdrop to close menu on click outside */}
          <div
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 z-20 py-2 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <p className="text-xs text-gray-500 uppercase font-bold">
                Signed in as
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {username}
              </p>
            </div>

            <div className="py-1">
              <MenuItem
                icon={<User size={16} />}
                label="Profile"
                onClick={() => {
                  setActiveTab("Settings");
                  setIsMenuOpen(false);
                }}
              />
              <MenuItem
                icon={<Settings size={16} />}
                label="Account Settings"
                onClick={() => {
                  setActiveTab("Settings");
                  setIsMenuOpen(false);
                }}
              />
            </div>

            <div className="py-1 border-t border-gray-100 dark:border-zinc-800">
              <MenuItem
                icon={<LogOut size={16} />}
                label="Sign Out"
                onClick={onLogout}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Internal helper component for UserMenu
const MenuItem = ({
  icon,
  label,
  onClick,
  className = "",
}: {
  icon: any;
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${className}`}
  >
    {icon}
    {label}
  </button>
);
