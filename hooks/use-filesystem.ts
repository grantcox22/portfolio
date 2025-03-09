import { readme } from "@/lib/copy";
import { File, Folder, getFolder, recursiveRmFolder } from "@/lib/filesystem";
import { get } from "http";
import { init } from "next/dist/compiled/webpack/webpack";
import { create } from "zustand";

type FileSystemState = {
  root: Folder;
  initialized: boolean;
  currentPath: string;
  currentFolder?: Folder;
  addFile: (l: { file: File; path?: string; overwrite?: boolean }) => boolean;
  rmFile: (fileName: string, path?: string) => number;
  mkDir: (folderName: string, path?: string, recursive?: boolean) => number;
  rmDir: (f: {
    folderName: string;
    path?: string;
    recursive?: boolean;
  }) => number;
  changePath: (path: string) => void;
};

export const useFileSystem = create<FileSystemState>((set) => ({
  root: {
    name: "root",
    files: {
      "README.md": {
        name: "README.md",
        content: readme,
      },
    },
    folders: {
      users: {
        name: "users",
        files: {},
        folders: {},
      },
      resources: {
        name: "resources",
        files: {},
        folders: {},
      },
    },
  },
  initialized: false,
  currentPath: "root",
  currentFolder: undefined,
  addFile: ({ file, path, overwrite }) => {
    let fileMade = false;
    set((state) => {
      if ((state.currentFolder ?? state.root).files[file.name] && !overwrite)
        return {};
      let currentFolder = state.currentFolder ?? state.root;
      currentFolder.files[file.name] = file;
      fileMade = true;
      return {};
    });
    return fileMade;
  },
  rmFile: (fileName, path) => {
    let fileRemoved = -1;
    set((state) => {
      let folder = state.currentFolder ?? state.root;
      if (path) {
      }
      if (folder.folders[fileName] && !folder.files[fileName]) {
        fileRemoved = -2;
        return {};
      }
      if (!folder.files[fileName]) return {};
      if (folder.files[fileName]) delete folder.files[fileName];
      fileRemoved = 0;
      return {};
    });
    return fileRemoved;
  },
  mkDir: (folderName, path) => {
    let folderMade = -1;
    set((state) => {
      let currentFolder = state.currentFolder ?? state.root;
      if (currentFolder.folders[folderName]) return {};
      currentFolder.folders[folderName] = {
        name: folderName,
        files: {},
        folders: {},
      };
      folderMade = 0;
      return {};
    });
    return folderMade;
  },
  rmDir: ({ folderName, path, recursive }) => {
    let folderRemoved = -1;
    set((state) => {
      let currentFolder = state.currentFolder ?? state.root;
      if (
        !currentFolder.folders[folderName] &&
        currentFolder.files[folderName]
      ) {
        folderRemoved = -2;
        return {};
      }
      if (!currentFolder.folders[folderName]) return {};
      if (
        Object.keys(currentFolder.folders[folderName]?.files ?? {}).length >
          0 ||
        Object.keys(currentFolder.folders[folderName]?.folders ?? {}).length > 0
      ) {
        if (!recursive) {
          folderRemoved = -4;
          return {};
        }
        recursiveRmFolder(
          currentFolder.folders[folderName],
          `${path}/${folderName}`
        );
      }
      delete currentFolder.folders[folderName];
      folderRemoved = 0;
      return {};
    });
    return folderRemoved;
  },
  changePath: (path) => {
    let result = true;
    set((state) => {
      let folder = getFolder(
        path,
        state.root,
        state.currentPath,
        state.currentFolder
      );
      if (!folder) {
        result = false;
        return {};
      }
      return {
        currentPath: folder?.path ?? state.currentPath,
        currentFolder: folder?.folder ?? state.currentFolder,
      };
    });
    return result;
  },
}));
