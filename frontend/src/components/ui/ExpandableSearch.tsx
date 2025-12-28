import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ExpandableSearch = ({ searchQuery, setSearchQuery }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsExpanded(true);
    // Focus the input automatically when expanding
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex items-center justify-end">
      <div
        className={`flex items-center bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl transition-all duration-300 ease-in-out px-3 py-2 ${
          isExpanded
            ? "w-54 md:w-60 shadow-md"
            : "w-10 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
        }`}
        onClick={!isExpanded ? handleToggle : undefined}
      >
        <Search
          size={18}
          className={`text-gray-500 shrink-0 ${!isExpanded ? "mx-auto" : ""}`}
        />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search files..."
          className={`bg-transparent border-none outline-none text-sm ml-2 w-full transition-opacity duration-200 ${
            isExpanded ? "opacity-100 block" : "opacity-0 hidden"
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => {
            if (searchQuery === "") setIsExpanded(false);
          }} // Shrinks back when clicking away
        />

        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery("");
              setIsExpanded(false);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
