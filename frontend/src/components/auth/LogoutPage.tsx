import { useState, useEffect, type MouseEvent } from "react";
import { ACCESS_TOKEN } from "../../constants";
import { REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleLogout = async (_event: MouseEvent) => {
    try {
      const response = await api.post("/user/logout/", {
        refresh: localStorage.getItem(REFRESH_TOKEN),
      });
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      setLoading(true);
    } catch (error: any) {
      alert(error.message || "Logout Failed");
    } finally {
      setLoading(false);
    }
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <button disabled={loading} onClick={handleLogout}>
        {loading ? "Loading..." : "Logout"}
      </button>
    </div>
  );
};

export default Logout;
