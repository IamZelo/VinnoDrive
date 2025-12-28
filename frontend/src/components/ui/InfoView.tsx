import type { FileItem, FolderItem, ViewItem } from "../../types/drive";
import { formatSize, formatDate } from "../../utils/formats";
import {
  FileText,
  Calendar,
  HardDrive,
  File,
  Copy,
  Info,
  UsersRound,
  Folder,
  X,
} from "lucide-react";
import DownloadButton from "./Buttons/DownloadButton";
import ShareButton from "./Buttons/ShareButton";
import DeleteButton from "./Buttons/DeleteButton";

interface Props {
  viewItem: ViewItem | null;
  handleDelete: (fileItem: FileItem) => void;
  setCurrentFile: (fileItem: ViewItem | null) => void;
  handleDownload: (fileItem: FileItem) => void;
}

const InfoView = ({
  viewItem,
  handleDelete,
  setCurrentFile,
  handleDownload,
}: Props) => {
  const FileView = (fileItem: FileItem) => {
    return (
      <div className="space-y-4 gap-2">
        <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex gap-2 items-center">
            <Info size={18} className="text-blue-500" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              File Info
            </h3>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentFile(null);
              }}
              className="transform transition duration-50 hover:scale-120 ease-in-out"
            >
              <X
                size={18}
                className="text-gray-900 dark:text-gray-100 hover:text-red-600"
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Filename */}
          <div className="col-span-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <FileText size={12} /> Name
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium break-all pl-1 rounded-md ">
              {fileItem.filename.split("/").pop()}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <HardDrive size={12} /> Size
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium pl-1">
              {formatSize(fileItem.size)}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <File size={12} /> File Type
            </label>
            <div
              className="text-gray-900 dark:text-gray-200 font-medium pl-1 truncate"
              title={fileItem.content_type}
            >
              {fileItem.content_type.split("/")[1]?.toUpperCase() || "FILE"}
            </div>
          </div>

          {/* Duplicate Status*/}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Copy size={14} /> Deduplication Status
            </label>
            <div>
              {fileItem.is_duplicate ? (
                <div className="text-green-500 dark:text-green-500 pl-1 font-medium">
                  <span>Referenced</span>
                </div>
              ) : (
                <div className="text-gray-900 dark:text-gray-200 pl-1 font-medium">
                  <span>Unique</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <UsersRound size={14} /> Visiblity
            </label>
            <div>
              {/* {fileItem.is_shared ? (
                    <div className="text-green-500 dark:text-green-500 pl-1 font-semibold">
                      <span>Public</span>
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-gray-200 pl-1 font-medium">
                      <span>Private</span>
                    </div>
                  )} */}
              <div className="text-blue-500 dark:text-blue-500/90 pl-1 font-medium">
                <span>Private</span>
              </div>
            </div>
          </div>
          <div className="col-span-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <HardDrive size={12} /> Path
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium break-all pl-1 rounded-md ">
              {"root/" + fileItem.filename}
            </div>
          </div>

          {/* Date */}
          <div className="col-span-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Calendar size={12} /> Uploaded
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium pl-1">
              {formatDate(fileItem.upload_timestamp)}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex shrink-0 gap-3">
          <div className="group cursor-pointer">
            <DownloadButton onClick={() => handleDownload(fileItem)} />
          </div>
          {/* To do create share systemm */}
          <div className="group cursor-pointer">
            <ShareButton share_url={"share/"} />
          </div>
          <div className="group cursor-pointer">
            <DeleteButton
              handleDelete={() => {
                handleDelete(fileItem);
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  const FolderView = (folderItem: FolderItem) => {
    return (
      <div className="space-y-4 gap-2">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
          <Info size={18} className="text-blue-500" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            Folder Info
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Filename */}
          <div className="col-span-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Folder size={12} /> Name
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium break-all pl-1 rounded-md">
              {folderItem.name}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <HardDrive size={12} /> Path
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium pl-1">
              {folderItem.path}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <File size={12} /> File Count
            </label>
            <div className="text-gray-900 dark:text-gray-200 font-medium pl-1 truncate">
              {folderItem.itemCount}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex-grow bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col">
      {viewItem?.type === "file" ? (
        FileView(viewItem.data)
      ) : viewItem?.type === "folder" ? (
        FolderView(viewItem)
      ) : (
        <></>
      )}
    </div>
  );
};

export default InfoView;
