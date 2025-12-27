import Navbar, { type TabType } from "./ui/Navbar";
import Dashboard from "./pages/Dashboard";
import MyDrive from "./drive/MyDrive";
import Settings from "./profile/Settings";
import { getUserProfile } from "../api/userProfile";
import { logoutUser } from "./auth/Logout";

import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import Loader from "./ui/Loader";
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
    return <Loader text="Loading profile" />;
  }
  return (
    <div>
      <Navbar
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className=" flex flex-col justify-between items-center">
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "My Drive" && <MyDrive />}
        {activeTab === "Settings" && <Settings />}
      </div>
    </div>
  );
};

export default Home;
