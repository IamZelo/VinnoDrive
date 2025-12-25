import api from "../api";
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  date_joined?: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get("/user/profile/");
    console.log("getting profile");
    return await response.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    throw new Error("Failed to fetch profile");
  }
};
