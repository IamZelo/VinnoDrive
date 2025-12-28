import { Trash2 } from "lucide-react";
interface Props {
  handleDelete: () => void;
}

export default function DownloadButton({ handleDelete }: Props) {
  return (
    <a
      onClick={handleDelete}
      target="_blank"
      rel="noreferrer"
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
        
        
        bg-red-500/90 
        text-white 
        border border-red-200

        
        dark:bg-red-500/70 
        dark:border-red-700

       
        hover:bg-red-600/100 
        dark:hover:bg-red-500/50 
      "
    >
      Delete <Trash2 className="w-3 h-3" />
    </a>
  );
}
