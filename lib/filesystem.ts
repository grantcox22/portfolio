export type File = {
  name: string;
  content: string;
};

export type Folder = {
  name: string;
  folders: Record<string, Folder>;
  files: Record<string, File>;
};

export const getFolder = (path: string, root: Folder) => {
  let pathArray = path.replace("root", "").split("/");
  if (!pathArray) return root;
  let currentFolder = root;
  for (let i = 0; i < pathArray.length; i++) {
    if (pathArray[i] === "") continue;
    currentFolder = currentFolder.folders[pathArray[i]];
    if (currentFolder === undefined) return;
  }
  return currentFolder;
};

export const recursiveRmFolder = (folder: Folder, path: string) => {
  for (let file in folder.files) {
    delete folder.files[file];
  }
  for (let f in folder.folders) {
    recursiveRmFolder(folder.folders[f], `${path}/${f}`);
    delete folder.folders[f];
  }
};
