import { Share2 } from "lucide-react";
interface Props {
  share_url: string;
}

export default function ShareButton({ share_url }: Props) {
  return (
    <a
      href={share_url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
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
        
        
        bg-blue-600/80 
        text-white 
        border border-blue-400

        
        dark:bg-blue-500/70 
        dark:border-green-700

       
        hover:bg-blue-600/100 
        dark:hover:bg-blue-500/60 
      "
    >
      Share <Share2 className="w-3 h-3" />
    </a>
  );
}
