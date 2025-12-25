import { ACCESS_TOKEN } from "../../constants";
import { REFRESH_TOKEN } from "../../constants";
import api from "../../api";

export const logoutUser = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (refreshToken && accessToken) {
      const response = await api.post("/user/logout/", {
        refresh: refreshToken,
      });
    }
  } catch (error: any) {
    console.warn("Server logout failed, clearing local session.", error);
  } finally {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
};
