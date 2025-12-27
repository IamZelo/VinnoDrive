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
import { fetchFiles } from "../../api/fetchFiles";
import Toolbar from "../dashboard/Toolbar";
import ContentArea from "../dashboard/ContentArea";

export default function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<string>("");

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

  // --- Virtual Folder Logic ---
  const { viewItems, isSearching } = useMemo(() => {
    const isSearching = searchQuery.length > 0;

    // 1. Searching: Flatten view
    if (isSearching) {
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

  if (loading) {
    return <Loader text="Loading drive" />;
  }

  return (
    <div className="flex flex-col w-full  max-w-450 mx-auto px-4 py-5 space-y-6 animate-in fade-in duration-500">
      <Stats files={files} />

      <div className="flex gap-3 items-start">
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
          />
          <ContentArea
            viewItems={viewItems}
            viewMode={viewMode}
            isSearching={isSearching}
            handleNavigate={handleNavigate}
          />
        </div>

        <div className="shrink-0 w-60 md:w-80 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col animate-in fade-in duration-500">
          <div className="space-y-6">
            <h3 className="font-bold text-lg">File Info</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
