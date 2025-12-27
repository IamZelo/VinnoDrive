import { File, HardDrive, Share2, PieChart } from "lucide-react";

import formatSize from "../../utils/formats";
import { type FileItem } from "../../types/drive";

// --- Configuration ---
const MAX_QUOTA = 10 * 1024 * 1024; // 10MB Limit

export const Stats = ({ files }: { files: FileItem[] }) => {
  // --- Stats Calculations ---
  const usedSpace = files.reduce(
    (acc, f) => acc + (f.is_duplicate ? 0 : f.size),
    0
  );
  const savedSpace = files.reduce(
    (acc, f) => acc + (f.is_duplicate ? f.size : 0),
    0
  );
  const fileCount = files.reduce((acc, f) => acc + (f.size === 0 ? 0 : 1), 0);

  const remainingSpace = Math.max(0, MAX_QUOTA - usedSpace);
  const usagePercent = Math.min((usedSpace / MAX_QUOTA) * 100, 100);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">
            Storage Used
          </p>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {formatSize(usedSpace)}
          </p>
        </div>
        <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
          <HardDrive size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Remaining</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {formatSize(remainingSpace)}
          </p>
          <div className="w-24 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${
                usagePercent > 90 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${100 - usagePercent}%` }}
            ></div>
          </div>
        </div>
        <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600">
          <PieChart size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Files</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {fileCount}
          </p>
        </div>
        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
          <File size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Saved</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {formatSize(savedSpace)}
          </p>
        </div>
        <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
          <Share2 size={20} />
        </div>
      </div>
    </div>
  );
};
