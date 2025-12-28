import api from "./api";
import type { FileItem } from "../types/drive";
import { calculateHash } from "../utils/hashUtils";

export async function fetchFiles(): Promise<FileItem[]> {
  try {
    const response = await api.get("/drive/files/");
    return response.data;
  } catch (error) {
    console.error("Drive Fetch Error:", error);
    return [];
  }
}

export async function deleteFile(id: string) {
  try {
    await api.delete("/drive/delete/" + id + "/");
  } catch (error) {
    console.error("Delete Error:", error);
  }
}

export async function downloadFile(file: FileItem) {
  try {
    const response = await fetch(file.download_url);
    const blob = await response.blob();

    // 2. Create a temporary URL for that blob
    const url = window.URL.createObjectURL(blob);

    // 3. Create a hidden link element
    const link = document.createElement("a");
    link.href = url;

    // 4. FORCE the filename to be what you have in your database
    link.download = file.filename;

    // 5. Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 6. Clean up memory
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: Just open the URL if the fancy download fails
    window.open(file.download_url, "_blank");
  }
}

export async function uploadFiles(
  fileList: FileList | null,
  currentPath: string
) {
  if (!fileList) return;
  if (fileList.length > 10) {
    alert("You cannot upload more than 10 files!");
    return;
  }
  // Multiple file upload
  for (const file of Array.from(fileList)) {
    try {
      const hash = await calculateHash(file);
      const fullPath = currentPath + file.name;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", fullPath);
      formData.append("hash", hash);
      formData.append("size", file.size.toString());

      await api.post("/drive/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.debug("Uploaded file: " + file.name);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }
}
