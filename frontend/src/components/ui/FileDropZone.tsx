import { useState, type DragEvent, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";

interface Props {
  onFileDrop: (fileList: FileList) => void;
  currentPath: string;
  children: ReactNode;
}

export default function DragDropWrapper({
  onFileDrop,
  currentPath,
  children,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  // 1. Detect when drag enters the container
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // 2. Continuous event required to allow dropping
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Ensure state stays true while hovering
    if (!isDragging) setIsDragging(true);
  };

  // 3. Detect when drag leaves the Overlay (Cancel)
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if we are really leaving the container (prevents flickering)
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    setIsDragging(false);
  };

  // 4. Handle the actual drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files);
    }
  };

  return (
    <div
      className="relative h-full flex flex-col flex-grow"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
    >
      {/* The actual content (File List). 
         We leave it visible but maybe blur it slightly when dragging 
      */}
      <div
        className={`h-full transition-all duration-200 ${
          isDragging ? "blur-sm opacity-50" : ""
        }`}
      >
        {children}
      </div>

      {/* The Drop Overlay
         Rendered ONLY when dragging. Sits on top (z-50)
      */}
      {isDragging && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-200/30 dark:bg-zinc-800/70 border-3 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl animate-in fade-in duration-200"
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-lg mb-4 text-zinc-500 ">
            <UploadCloud size={48} />
          </div>
          <h3 className="text-lg font-medium text-zinc-400 dark:text-zinc-100">
            Upload file to {currentPath === "" ? "Home" : currentPath}
          </h3>
        </div>
      )}
    </div>
  );
}
