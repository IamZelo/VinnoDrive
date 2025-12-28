import { useState, useEffect, useMemo, useCallback } from "react";

import Loader from "../ui/Loader";
import { Stats } from "../dashboard/Stats";

import type {
  ViewMode,
  FileItem,
  FolderItem,
  FileViewItem,
  ViewItem,
} from "../../types/drive";
import { deleteFile, downloadFile, fetchFiles } from "../../api/files";
import Toolbar from "../dashboard/Toolbar";
import ContentArea from "../dashboard/ContentArea";
import InfoView from "../ui/InfoView";

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<ViewItem | null>(null);

  const loadFiles = async () => {
    const data = await fetchFiles();
    setFiles(data);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadFiles();
      setLoading(false);
    };
    init();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleDelete = async (fileItem: FileItem) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileItem.id));
    try {
      if (currentFile?.type === "file" && currentFile.data.id === fileItem.id) {
        setCurrentFile(null);
      }
      await deleteFile(fileItem.id);
    } catch (error) {
      console.error("Delete failed", error);
      loadFiles();
      alert("Failed to delete file");
    }
  };
  const handleDownload = async (fileItem: FileItem) => {
    downloadFile(fileItem);
  };

  // --- Virtual Folder Logic ---
  const { viewItems, isSearching } = useMemo(() => {
    const isSearching = searchQuery.length > 0;

    // 1. Searching: Flatten view
    if (isSearching) {
      setCurrentFile(null);
      const matches = files
        .filter((f) =>
          f.filename.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((f) => ({ type: "file", data: f } as FileViewItem));
      return { viewItems: matches, isSearching };
    }

    // 2. Navigation: Group by folder
    const currentFolderItems: ViewItem[] = [];
    const folders = new Map<string, number>();

    files.forEach((file) => {
      // Must be inside current path
      if (!file.filename.startsWith(currentPath)) return;

      const relativePath = file.filename.slice(currentPath.length);
      const parts = relativePath.split("/");

      if (parts.length > 1) {
        // It's in a subfolder
        const folderName = parts[0];
        const fullFolderPath = currentPath + folderName + "/";

        // Count files, but ignore .vinno_keep files in counts if desired
        folders.set(fullFolderPath, (folders.get(fullFolderPath) || 0) + 1);
      } else {
        // It's a file in this folder
        // Hide the special .vinno_keep placeholder files from the view
        if (file.filename.endsWith(".vinno_keep")) return;

        currentFolderItems.push({ type: "file", data: file });
      }
    });

    const folderItems: FolderItem[] = Array.from(folders.entries()).map(
      ([path, count]) => ({
        type: "folder",
        name: path.split("/").slice(-2, -1)[0],
        path: path,
        itemCount: count - 1,
      })
    );

    return {
      viewItems: [...folderItems, ...currentFolderItems],
      isSearching,
    };
  }, [files, currentPath, searchQuery]);

  // --- Navigation Actions ---
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSearchQuery("");
  };

  const handleFileClick = (file: ViewItem) => {
    setCurrentFile(file);
  };

  if (loading) {
    return <Loader text="Loading drive" />;
  }

  const sidePanelClasses =
    viewMode === "list"
      ? "shrink-0 flex order-first" // List View
      : "shrink-0 w-full md:w-60 lg:w-80 flex flex-col order-first md:order-none"; // Grid View

  return (
    <div className="flex flex-col w-full  max-w-450 mx-auto px-4 py-5 space-y-6 animate-in ">
      <Stats files={files} />

      <div
        className={`gap-3 items-stretch
          ${
            viewMode === "list" && currentFile
              ? "flex flex-col" //
              : "grid md:flex" //
          }
        `}
      >
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col flex-grow gap-6">
          <Toolbar
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            loadFiles={loadFiles}
            isSearching={isSearching}
            setCurrentFile={setCurrentFile}
          />
          <ContentArea
            viewItems={viewItems}
            viewMode={viewMode}
            isSearching={isSearching}
            handleNavigate={handleNavigate}
            handleFileClick={handleFileClick}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
          />
        </div>

        {currentFile && (
          <div className={sidePanelClasses}>
            <InfoView
              viewItem={currentFile}
              handleDelete={handleDelete}
              setCurrentFile={setCurrentFile}
              handleDownload={handleDownload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
