export type File = {
  name: string;
  content: string;
};

export type Folder = {
  name: string;
  folders: Record<string, Folder>;
  files: Record<string, File>;
};

export const getFolder = (
  path: string,
  root: Folder,
  cdpath: string = "root",
  currentFolder?: Folder
): { folder: Folder; path: string } | undefined => {
  let folder: Folder | undefined = root;
  // Remove "./" from the beginning of the path
  // ./ is used to indicate the current directory
  path = path.replace(/^(\.\/)/gm, "");
  // if no path provided return the current folder
  if (path === "") {
    return { folder: currentFolder ?? root, path: cdpath };
  }
  // check if the path begins with a "/" or "~/"
  // if it does, set the folder to the root folder
  let temp = path.replace(/^(\/|~\/)/gm, "");
  if (temp !== path) {
    temp = path;
    folder = root;
    cdpath = "root";
  }
  // check if the path begins with ".."
  if (path.startsWith("..")) {
    // if the current directory is the root directory
    // return undefined as there is no parent directory
    if (cdpath === "root") return undefined;
    // remove ".." from the beginning of the path
    path = path.replace(/^(\.\.\/|\.\.)/gm, "");
    // remove the last folder from the current directory path
    let splitPath = cdpath.split("/");
    splitPath.pop();
    cdpath = splitPath.join("/");
    // recursively call getFolder with the get the parent folder
    return getFolder(path, root, cdpath);
  }
  // create an array of the path including the current directory path
  let pathArray = [
    ...cdpath.replace(/^(root|root\/)/gm, "").split("/"),
    ...path.split("/"),
  ];
  // iterate through the loop and set the folder to the folder at the path
  for (let i = 0; i < pathArray.length; i++) {
    // if the path is empty, skip the iteration
    // this is most likely the root path
    if (pathArray[i] === "") continue;
    // if the folder exists, set the folder to the folder
    if (folder.folders[pathArray[i]]) {
      folder = folder.folders[pathArray[i]];
    } else {
      // otherwise return undefined to indicate the folder was not found
      return undefined;
    }
  }
  // return the folder and the path
  return { folder: folder, path: `${cdpath}/${path}` };
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
