import api from "./api";
import type { FileItem } from "../types/drive";

export async function fetchFiles(): Promise<FileItem[]> {
  try {
    const response = await api.get("/drive/files/");
    return response.data;
  } catch (error) {
    console.error("Drive Fetch Error:", error);
    return [];
  }
}
