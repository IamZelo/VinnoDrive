import type { MouseEvent, ReactNode } from "react";
import { GridLoader } from "react-spinners";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  Icon: ReactNode;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "primary" | "success";
  confirm: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  Icon,
  isLoading = false,
  variant = "danger",
  confirm,
}: Props) {
  if (!isOpen) return null;

  const variantText = () => {
    if (variant === "danger")
      return "bg-red-100 text-red-600 dark:bg-red-900/30";
    else if (variant === "warning")
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30";
    else if (variant === "primary")
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30";
    else return "bg-green-100 text-green-600 dark:bg-green-900/30";
  };
  const variantHoverText = () => {
    if (variant === "danger")
      return "bg-red-600/60 hover:bg-red-600/80 dark:hover:bg-red-600/80";
    else if (variant === "warning")
      return "bg-yellow-600/60  hover:bg-yellow-600/80 dark:hover:bg-yellow-600/80";
    else if (variant === "primary")
      return "bg-blue-600/60 hover:bg-blue-600/80 dark:hover:bg-blue-600/80";
    else
      return "bg-green-600/60 hover:bg-green-600/80 dark:hover:bg-green-600/80";
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-100"
    >
      {/* 2. Modal Box */}
      <div
        onClick={(e: MouseEvent) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 p-6 m-4 animate-in zoom-in-95 duration-200 scale-100"
      >
        <div className="flex gap-4">
          <div
            className={`shrink-0 p-3 rounded-full h-12 w-12 flex items-center justify-center ${variantText()}`}
          >
            {Icon}
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm flex items-center gap-2
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              ${variantHoverText()}
            `}
          >
            {isLoading ? <GridLoader color="white" size={4} /> : <>{confirm}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
