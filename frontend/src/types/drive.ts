export interface FileItem {
  id: string;
  filename: string;
  size: number;
  hash: string;
  content_type: string;
  upload_timestamp: string;
  is_duplicate: boolean;
  download_url: string;
}

export interface FolderItem {
  type: "folder";
  name: string;
  path: string;
  itemCount: number;
}

export interface FileViewItem {
  type: "file";
  data: FileItem;
}

export type ViewMode = "grid" | "list";
export type ViewItem = FolderItem | FileViewItem;
