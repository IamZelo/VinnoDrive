import { FolderIcon, Search } from "lucide-react";
import type { FileItem, ViewItem, ViewMode } from "../../types/drive";
import GridView from "./views/GridView";
import ListView from "./views/ListView";

interface ContentAreaProps {
  viewItems: ViewItem[];
  viewMode: ViewMode;
  isSearching: boolean;
  handleNavigate: (path: string) => void;
  handleFileClick: (viewItem: ViewItem) => void;
  handleDelete: (fileItem: FileItem) => void;
  handleDownload: (fileItem: FileItem) => void;
}

const ContentArea = ({
  viewItems,
  isSearching,
  viewMode,
  handleNavigate,
  handleFileClick,
  handleDelete,
  handleDownload,
}: ContentAreaProps) => {
  return (
    <>
      {viewItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
          <div className="h-16 w-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            {isSearching ? (
              <Search className="text-gray-300" />
            ) : (
              <FolderIcon className="text-gray-300" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isSearching ? "No results found" : "This folder is empty"}
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
            {isSearching
              ? "Try a different keyword"
              : "Upload files or create a folder"}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            // --- GRID VIEW ---
            <GridView
              viewItems={viewItems}
              handleNavigate={handleNavigate}
              handleFileClick={handleFileClick}
              handleDelete={handleDelete}
              handleDownload={handleDownload}
            />
          ) : (
            // --- LIST VIEW ---
            <ListView
              viewItems={viewItems}
              handleNavigate={handleNavigate}
              handleFileClick={handleFileClick}
              handleDelete={handleDelete}
              handleDownload={handleDownload}
            />
          )}
        </>
      )}
    </>
  );
};

export default ContentArea;
