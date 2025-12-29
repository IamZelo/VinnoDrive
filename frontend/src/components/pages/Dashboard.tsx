import { useState, useEffect, useMemo, useCallback } from "react";

import Loader from "../ui/Loader";
import { Stats } from "../dashboard/Stats";
import ConfirmDialog from "../ui/ConfirmDialog";
import { AlertTriangle, File, Upload } from "lucide-react";
import type {
  ViewMode,
  FileItem,
  FolderItem,
  FileViewItem,
  ViewItem,
} from "../../types/drive";
import {
  deleteFile,
  downloadFile,
  fetchFiles,
  uploadFiles,
} from "../../api/files";
import Toolbar from "../dashboard/Toolbar";
import ContentArea from "../dashboard/ContentArea";
import InfoView from "../ui/InfoView";
import DragDropWrapper from "../ui/FileDropZone";
import type { UserSession } from "../Home";

interface Props {
  session: UserSession | null;
}

export default function Dashboard({ session }: Props) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<ViewItem | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);

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

  const handleConfirmUpload = async () => {
    setLoading(true);
    await uploadFiles(filesToUpload, currentPath);
    loadFiles();
    setLoading(false);
    setFilesToUpload(null);
    //setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileItem.id));
  };
  const handleUpload = (fileList: FileList | null) => {
    setFilesToUpload(fileList);
  };

  const create_upload_list = (fileList: FileList | null) => {
    if (!fileList) {
      return "";
    }
    const fstr: string[] = [];
    for (let i = 0; i < fileList.length; ++i) {
      fstr.push(fileList[i].name);
    }
    console.log(fstr);
    return (
      <>
        {fstr.map((value, index) => {
          return (
            <div key={index} className="flex items-center gap-1">
              <File size={15} />
              {value}
            </div>
          );
        })}
      </>
    );
  };

  const handleDelete = (fileItem: FileItem) => {
    setFileToDelete(fileItem);
  };
  const handleConfirmDelete = async (fileItem: FileItem) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileItem.id));
    setFileToDelete(null);
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

  // const sidePanelClasses =
  //   viewMode === "list"
  //     ? "shrink-0 flex order-first" // List View
  //     : "shrink-0 w-full md:w-60 lg:w-80 flex flex-col order-first md:order-none"; // Grid View

  return (
    <div className="flex flex-col w-full  max-w-450 mx-auto px-4 py-5 space-y-6 animate-in ">
      <Stats files={files} session={session} />

      <div className="gap-3 items-stretch grid lg:flex">
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
            handleUpload={handleUpload}
          />
          <DragDropWrapper onFileDrop={handleUpload} currentPath={currentPath}>
            <ContentArea
              viewItems={viewItems}
              viewMode={viewMode}
              isSearching={isSearching}
              handleNavigate={handleNavigate}
              handleFileClick={handleFileClick}
              handleDelete={handleDelete}
              handleDownload={handleDownload}
            />
          </DragDropWrapper>
        </div>

        {currentFile && (
          <div className="shrink-0 w-full lg:w-80 flex flex-col order-first lg:order-none">
            <InfoView
              viewItem={currentFile}
              handleDelete={handleDelete}
              setCurrentFile={setCurrentFile}
              handleDownload={handleDownload}
            />
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={!!fileToDelete} // Open if a file is selected
        onClose={() => setFileToDelete(null)}
        onConfirm={() => {
          fileToDelete ? handleConfirmDelete(fileToDelete) : null;
        }}
        title="Delete File?"
        description={`Are you sure you want to delete "${fileToDelete?.filename}"? This action cannot be undone.`}
        Icon={<AlertTriangle size={24} />}
        variant="danger"
        confirm="Delete"
      />
      <ConfirmDialog
        isOpen={!!filesToUpload} // Open if a file is selected
        onClose={() => setFilesToUpload(null)}
        onConfirm={() => {
          filesToUpload ? handleConfirmUpload() : null;
        }}
        title="Upload File?"
        description={
          <>
            Are you sure you want to upload the following files?
            <div className="mt-2 ml-2 text-xs">
              {create_upload_list(filesToUpload)}
            </div>
          </>
        }
        Icon={<Upload size={24} />}
        variant="primary"
        confirm="Upload"
      />
    </div>
  );
}
