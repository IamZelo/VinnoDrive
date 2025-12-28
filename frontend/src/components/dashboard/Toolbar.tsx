import React from "react";
import api from "../../api/api";
import { calculateHash } from "../../utils/hashUtils";
import {
  ArrowLeft,
  ChevronRight,
  FolderPlus,
  Home,
  LayoutGrid,
  ListIcon,
  UploadCloud,
} from "lucide-react";
import type { ViewItem, ViewMode } from "../../types/drive";
import { ExpandableSearch } from "../ui/ExpandableSearch";

interface NavProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: string;
  setViewMode: (query: ViewMode) => void;
  loadFiles: () => void;
  isSearching: boolean;
  setCurrentFile: (viewItem: ViewItem | null) => void;
}

const Toolbar = ({
  currentPath,
  setCurrentPath,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  loadFiles,
  isSearching,
  setCurrentFile,
}: NavProps) => {
  const handleNavigateUp = () => {
    if (currentPath === "") return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    const newPath = parts.length > 0 ? parts.join("/") + "/" : "";
    setCurrentPath(newPath);
    setCurrentFile(null);
  };

  // --- CREATE FOLDER LOGIC ---
  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    // Sanitize: Remove existing slashes to avoid deep nesting exploits
    const cleanName = folderName.replace(/\//g, "").trim();
    if (!cleanName) return;

    try {
      // We create a dummy 0-byte file to "hold" the folder structure
      // e.g. "Documents/Work/.vinno_keep"
      const dummyFileName = ".vinno_keep";
      const fullPath = `${currentPath}${cleanName}/${dummyFileName}`;
      const dummyBlob = new Blob([""], { type: "application/octet-stream" });
      const hash = await calculateHash(dummyBlob as File);

      const formData = new FormData();
      formData.append("file", dummyBlob, ".vinno_keep");
      formData.append("filename", fullPath);
      formData.append("hash", hash);
      formData.append("size", "0");

      await api.post("/drive/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      loadFiles(); // Refresh view
    } catch (error) {
      console.error("Failed to create folder", error);
      alert("Could not create folder. Please try again.");
    }
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
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
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
    loadFiles();
  };

  const renderBreadcrumbs = () => {
    if (searchQuery)
      return <span className="text-gray-500">Search Results</span>;

    const parts = currentPath.split("/").filter(Boolean);

    return (
      <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 overflow-x-auto">
        <button
          onClick={() => {
            setCurrentPath("");
            setCurrentFile(null);
          }}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors ${
            currentPath === "" ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          <Home size={16} />
        </button>
        {parts.map((part, index) => {
          const path = parts.slice(0, index + 1).join("/") + "/";
          const isLast = index === parts.length - 1;
          return (
            <React.Fragment key={path}>
              <ChevronRight size={14} className="text-gray-400" />
              <button
                onClick={() => setCurrentPath(path)}
                className={`px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap ${
                  isLast ? "text-blue-600 dark:text-blue-400" : ""
                }`}
              >
                {part}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm space-y-3 sm:space-y-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 py-1">
        {/* Breadcrumbs Navigation */}
        <div className="flex-1 w-full flex items-center gap-2 overflow-hidden">
          <button
            onClick={handleNavigateUp}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors"
            title="Go Up"
            disabled={currentPath == "" || isSearching}
          >
            <ArrowLeft size={16} />
          </button>

          {renderBreadcrumbs()}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <ExpandableSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* View Toggles */}
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              <ListIcon size={16} />
            </button>
          </div>

          {/* Create Folder Button */}
          <button
            onClick={handleCreateFolder}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-sm font-bold rounded-xl transition-colors active:scale-95"
            title="New Folder"
          >
            <FolderPlus size={16} />
            <span className="hidden sm:inline">Folder</span>
          </button>

          {/* Upload Button */}
          <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors active:scale-95 shadow-lg shadow-blue-600/20">
            <UploadCloud size={16} />
            <span className="hidden sm:inline">New</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
