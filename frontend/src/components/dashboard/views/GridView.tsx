import { Download, FolderIcon } from "lucide-react";
import formatSize from "../../../utils/formats";
import type { ViewItem } from "../../../types/drive";
import { FileIcon } from "../../ui/FileIcon";

interface Props {
  viewItems: ViewItem[];
  handleNavigate: (path: string) => void;
}

const GridView = ({ viewItems, handleNavigate }: Props) => {
  const createFolderItems = () => {
    return viewItems.map((item) => {
      if (item.type === "folder") {
        return (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-300 dark:border-zinc-700 p-4 hover:shadow-lg transition-all cursor-pointer flex flex-col aspect-square"
          >
            {/* flex-1 makes this part grow to fill the square */}
            <div className="flex-1 flex items-center justify-center rounded-xl ">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <FolderIcon
                  size={60} // Adjusted size to fit better in square
                  className="text-blue-500 dark:text-blue-400 fill-current"
                />
              </div>
            </div>

            {/* Text stays at the bottom */}
            <div className="mt-2 text-center">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">{item.itemCount} items</p>
            </div>
          </div>
        );
      }
    });
  };

  const createFileItems = () => {
    return viewItems.map((item) => {
      if (item.type === "file") {
        const file = item.data;
        return (
          <div
            key={file.id}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-300 dark:border-zinc-700 p-4 hover:shadow-lg hover:border-gray-200 dark:hover:border-zinc-700 transition-all cursor-pointer"
          >
            <div className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <FileIcon
                  filename={file.filename}
                  type={file.content_type}
                  size={40}
                />
              </div>
            </div>
            <div className="space-y-1">
              <p
                className="font-semibold text-sm text-gray-900 dark:text-white truncate"
                title={file.filename}
              >
                {file.filename.split("/").pop()}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatSize(file.size)}</span>
                {file.is_duplicate && (
                  <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded font-bold text-[10px]">
                    REF
                  </span>
                )}
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <a
                href={file.download_url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-lg shadow-sm hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={14} />
              </a>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-400 m-2 my-3">Sub folders</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2">
        {createFolderItems()}
      </div>
      <p className="text-sm text-gray-400 m-2 my-3">Files</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2">
        {createFileItems()}
      </div>
    </div>
  );
};

export default GridView;
