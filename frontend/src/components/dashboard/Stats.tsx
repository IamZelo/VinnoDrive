import { File, HardDrive, Share2, PieChart } from "lucide-react";

import { formatSize } from "../../utils/formats";
import { type FileItem } from "../../types/drive";
import type { UserSession } from "../Home";

interface Props {
  files: FileItem[];
  session: UserSession | null;
}
export const Stats = ({ files, session }: Props) => {
  // --- Stats Calculations ---
  if (!session) return;

  const usedSpace = session.storage_used;
  const MAX_QUOTA = session.storage_quota;

  const savedSpace = files.reduce(
    (acc, f) => acc + (f.is_duplicate ? f.size : 0),
    0
  );
  const fileCount = files.reduce((acc, f) => acc + (f.size === 0 ? 0 : 1), 0);

  const remainingSpace = Math.max(0, MAX_QUOTA - usedSpace);
  console.log(remainingSpace);
  const usagePercent = Math.min((usedSpace / MAX_QUOTA) * 100, 100);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-600 dark:text-gray-400 uppercase">
            Storage Used
          </p>
          <p className=" text-xs text-gray-700 dark:text-gray-300 font-light ">
            (Calculated on the basis of size of files upload regardless of
            deduplication)
          </p>
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {formatSize(usedSpace)} / {formatSize(MAX_QUOTA)}
          </p>
        </div>
        <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
          <HardDrive size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
            Remaining
          </p>
          <p className=" text-xs text-gray-700 dark:text-gray-300  font-light ">
            (Remaining is storage does not count deduplication saving)
          </p>
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
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
            Files
          </p>
          <p className=" text-xs text-gray-700 dark:text-gray-300  font-light ">
            (Total no of files uploaded, folders are not counted as files)
          </p>
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
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
            Saved{" "}
          </p>
          <p className=" text-xs text-gray-700 dark:text-gray-300  font-light ">
            (Due to deduplication on server side only)
          </p>
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
