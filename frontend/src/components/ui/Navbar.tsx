import { LayoutDashboard, Folder } from "lucide-react";
import ThemeToggle from "./Buttons/ThemeToggle";
import NavButton from "./Buttons/NavButton";
import UserMenu from "../profile/UserMenu";

// --- Types ---
type TabType = "Dashboard" | "Settings" | "My Drive" | "About";

interface NavbarProps {
  session: { username: string; token: string } | null;
  onLogout: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Navbar({
  session,
  onLogout,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "My Drive", icon: <Folder size={18} /> },
    { name: "About", icon: <Folder size={18} /> },
  ] as const;

  return (
    <nav className="bg-white/100 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex max-w-full mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-1 justify-between h-16 items-center ">
          {/* Left Side: Brand/Name */}
          <div className="flex-shrink-0 flex items-center ">
            <div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center mr-3 transition-colors">
              <span className="text-white dark:text-black font-bold text-lg">
                V
              </span>
            </div>
            <span className=" hidden md:block text-xl font-bold tracking-tight text-blue-500 dark:text-blue-500">
              VinnoDrive
            </span>
          </div>
          <div className="flex items-center  ">
            {/* Desktop Navigation Links */}
            <div className="flex justify-center">
              {session && (
                <div className="flex justify-center items-center ml-2 md:ml-15 space-x-2">
                  {navItems.map((item) => (
                    <NavButton
                      key={item.name}
                      label={item.name}
                      icon={item.icon}
                      isActive={activeTab === item.name}
                      onClick={() => setActiveTab(item.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
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
        </div>
      </div>
    </nav>
  );
}

export type { TabType };
