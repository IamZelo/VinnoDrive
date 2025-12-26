import { GridLoader } from "react-spinners";

const Loader = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col  h-screen items-center justify-center bg-gray-50 dark:bg-black gap-4">
      <div className="flex ">
        <GridLoader color="#3B82F6" size={20} />
      </div>
      <div className="flex text-sm text-gray-500 animate-pulse">{text}</div>
    </div>
  );
};

export default Loader;
