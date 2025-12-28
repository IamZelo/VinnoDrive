import {
  ChevronRight,
  Copy,
  Download,
  FolderIcon,
  Share2,
  Trash2,
} from "lucide-react";
import { formatSize } from "../../../utils/formats";
import { FileIcon } from "../../ui/FileIcon";
import type { FileItem, ViewItem } from "../../../types/drive";

interface Props {
  viewItems: ViewItem[];
  handleNavigate: (path: string) => void;
  handleFileClick: (viewItem: ViewItem) => void;
  handleDelete: (fileItem: FileItem) => void;
  handleDownload: (fileItem: FileItem) => void;
}

const ListView = ({
  viewItems,
  handleNavigate,
  handleFileClick,
  handleDelete,
  handleDownload,
}: Props) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 font-medium border-b border-gray-100 dark:border-zinc-800">
          <tr>
            <th className="px-6 py-4 w-8">Type</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Size</th>
            <th className="px-6 py-4">Status</th>
            <th className="hidden md:block px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
          {viewItems.map((item) => {
            if (item.type === "folder") {
              return (
                <tr
                  key={item.path}
                  onClick={() => {
                    handleNavigate(item.path);
                    handleFileClick(item);
                  }}
                  className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <FolderIcon
                      size={20}
                      className="text-blue-500 fill-current"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">-</td>
                  <td className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400">
                    {item.itemCount} items
                  </td>
                  <td className="hidden md:block px-6 py-4 text-right">
                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                  </td>
                </tr>
              );
            } else {
              const file = item.data;
              return (
                <tr
                  key={file.id}
                  onClick={() => handleFileClick(item)}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <FileIcon
                      filename={file.filename}
                      type={file.content_type}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {file.filename.split("/").pop()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatSize(file.size)}
                  </td>
                  <td className="px-6 py-4">
                    {file.is_duplicate ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Copy size={12} /> Referenced
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Unique</span>
                    )}
                  </td>
                  <td className="hidden md:block px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
