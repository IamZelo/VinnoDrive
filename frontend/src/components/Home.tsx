import Navbar, { type TabType } from "./Navbar";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import { type UserProfile, getUserProfile } from "../api/userProfile";
import { logoutUser } from "./auth/Logout";

import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
interface UserSession {
  username: string;
  token: string;
}
const Home = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (token) {
        try {
          setLoading(true);
          // Verify token and get fresh profile data from server
          const profile = await getUserProfile();

          setSession({ username: profile.username, token });
        } catch (err) {
          console.error("Session expired or invalid:", err);
          localStorage.removeItem("access_token");
          setSession(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setSession(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-sm text-gray-500">Loading profile...</div>
      </div>
    );
  }
  return (
    <div>
      <Navbar
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      {activeTab === "Dashboard" && <Dashboard />}
      {activeTab === "Settings" && <Settings />}
    </div>
  );
};

export default Home;
