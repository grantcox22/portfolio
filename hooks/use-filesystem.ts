import { File, Folder, getFolder, recursiveRmFolder } from "@/lib/filesystem";
import { get } from "http";
import { init } from "next/dist/compiled/webpack/webpack";
import { create } from "zustand";

type FileSystemState = {
  root: Folder;
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
    files: {},
    folders: {
      home: {
        name: "home",
        files: {
          "ABOUTME.md": {
            name: "ABOUTME.md",
            content: "I'm a software engineer",
          },
          "contact.txt": {
            name: "contact.txt",
            content: "grant cox",
          },
        },
        folders: {
          user: {
            name: "user",
            files: {},
            folders: {},
          },
          document: {
            name: "document",
            files: {},
            folders: {},
          },
        },
      },
    },
  },
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
      let folder: Folder | undefined = state.currentFolder ?? state.root;
      if (path === "root") {
        return { currentPath: "root", currentFolder: state.root };
      }
      let currentPath = state.currentPath;
      while (path.startsWith("..") && currentPath !== "root") {
        let pathArray = state.currentPath.split("/");
        pathArray.pop();
        currentPath = pathArray.join("/");
        currentPath.slice(0, currentPath.length - 1);
        folder = getFolder(currentPath, state.root);
        if (path.length >= 2) path = path.slice(2) || "";
        if (path.startsWith("/")) path = path.slice(1) || "";
      }
      if (path === "..")
        return { currentPath: "root", currentFolder: state.root };
      folder = getFolder(`${path}`, folder ?? state.root);
      if (folder === undefined) {
        result = false;
        return {
          currentPath: state.currentPath,
        };
      }
      return {
        currentPath: `${currentPath}${path !== "" ? "/" : ""}${path}`,
        currentFolder: folder ?? state.currentFolder,
      };
    });
    return result;
  },
}));
