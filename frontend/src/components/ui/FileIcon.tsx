import { Video, Code, Image, Music, FileText, File } from "lucide-react";
interface Props {
  filename: string;
  type: string;
  size?: number;
}
export const FileIcon = ({ filename, type, size = 24 }: Props) => {
  if (type.startsWith("image/"))
    return <Image className="text-purple-500" size={size} />;
  if (type.startsWith("video/"))
    return <Video className="text-red-500" size={size} />;
  if (type.startsWith("audio/"))
    return <Music className="text-yellow-500" size={size} />;
  if (filename.endsWith(".pdf"))
    return <FileText className="text-red-600" size={size} />;
  if (
    filename.endsWith(".js") ||
    filename.endsWith(".py") ||
    filename.endsWith(".tsx") ||
    filename.endsWith(".c")
  )
    return <Code className="text-blue-500" size={size} />;
  return <File className="text-gray-400" size={size} />;
};
