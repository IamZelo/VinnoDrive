import { Download } from "lucide-react";
interface Props {
  onClick: () => void;
}

export default function DownloadButton({ onClick }: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="
        flex
        items-center 
        p-2
        rounded-lg
        shadow-sm
        transition-colors duration-200
        gap-2
        w-auto
        text-sm
        
        
        bg-green-600/80 
        text-white 
        border border-green-200

        
        dark:bg-green-500/60 
        dark:border-green-700

       
        hover:bg-green-600/100 
        dark:hover:bg-green-500/50 
      "
    >
      Download <Download className="w-3 h-3" />
    </button>
  );
}
