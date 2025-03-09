"use client";

import { getUser } from "@/actions/user";
import { getFolder } from "@/lib/filesystem";
import { dir } from "console";
import { loginAttempt } from "@/actions/authActions";
import path from "path";
import bcrypt from "bcryptjs";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { version } from "@/components/version";
import { help, helpMessage } from "./copy";

export enum OpCode {
  CLEAR,
  CD,
  LS,
  PWD,
  CAT,
  ADD,
  EADD,
  RM,
  MKDIR,
  RMDIR,
  LOGIN,
  LOGOUT,
}

export type ConsoleLine = {
  content: string;
  input?: boolean;
  path: string;
  user?: string;
};
export type Output = {
  content: string;
  opcode?: OpCode;
  flags?: string[];
  error?: boolean;
};

type Command = {
  command: string;
  func: (args: string[]) => Output;
};

const commands: Command[] = [
  {
    command: "clear",
    func: (args: string[]) => {
      return { content: "", opcode: OpCode.CLEAR };
    },
  },
  {
    command: "ls",
    func: (args: string[]) => {
      if (args.length !== 0) {
        return {
          content: "ls: e|invalid arguments|",
          error: true,
        };
      }
      return { content: "", opcode: OpCode.LS };
    },
  },
  {
    command: "cd",
    func: (args: string[]) => {
      if (args.length !== 1) {
        return { content: "", opcode: OpCode.CD };
      }
      let route = `${args[0]}`;
      return { content: route, opcode: OpCode.CD };
    },
  },
  {
    command: "mkdir",
    func: (args: string[]) => {
      if (args.length < 1) {
        return { content: "mkdir: e|missing arguments|", error: true };
      }
      let folderName = args[0].replace(/\"(.*?)\"/gm, "'$1'");
      let flags;
      if (args.length >= 2) args.slice(1);
      return { content: folderName, opcode: OpCode.MKDIR, flags };
    },
  },
  {
    command: "rmdir",
    func: (args: string[]) => {
      if (args.length < 1) {
        return { content: "rmdir: e|missing arguments|", error: true };
      }
      let folderName = args[0].replace(/\"(.*?)\"/gm, "'$1'");
      let flags;
      if (args.length >= 1) flags = args.slice(1);
      return { content: folderName, opcode: OpCode.RMDIR, flags };
    },
  },
  {
    command: "rm",
    func: (args: string[]) => {
      if (args.length < 1) {
        return { content: "rm: e|missing arguments|", error: true };
      }
      let filename = args[0].replace(/\"(.*?)\"/gm, "'$1'");
      let flags;
      if (args.length >= 2) args.slice(1);
      return { content: filename, opcode: OpCode.RM, flags };
    },
  },
  {
    command: "touch",
    func: (args: string[]) => {
      if (args.length < 1) {
        return { content: "touch: e|missing file name|" };
      }
      let fileName = args[0].replace(/\"(.*?)\"/gm, "'$1'");
      let flags;
      if (args.length >= 2) {
        flags = args.slice(1);
      }
      return { content: fileName, opcode: OpCode.ADD, flags };
    },
  },
  {
    command: "echo",
    func: (args: string[]) => {
      if (args[0].match(/\"(.*?)\"/gm)) {
        args[0] = args[0].replace(/\"(.*?)\"/gm, "$1");
        console.log(args);
        if (args[1] !== ">") {
          return { content: args[0] };
        }
        if (args.length < 3) {
          return { content: "echo: e|missing file name|" };
        }
        let file = args[2];
        let flags = [file];
        if (args.length >= 4) {
          flags = [...flags, ...args.slice(3)];
        }
        return { content: args[0], opcode: OpCode.EADD, flags };
      }
      return { content: args.join(" ") };
    },
  },
  {
    command: "cat",
    func: (args: string[]) => {
      if (args.length !== 1) {
        return { content: "cat: e|invalid arguments|" };
      }
      let file = args[0].replace(/\"(.*?)\"/gm, "'$1'");
      return { content: file, opcode: OpCode.CAT };
    },
  },
  {
    command: "help",
    func: (args: string[]) => {
      if (args.length === 1) {
        if (help[args[0]]) {
          return { content: help[args[0]] };
        } else {
          return {
            content: `help: ${args[0]}: e|command not found|`,
            error: true,
          };
        }
      }
      if (args.length > 1) return { content: "help: e|invalid arguments|" };
      return {
        content: helpMessage,
      };
    },
  },
  {
    command: "pwd",
    func: (args: string[]) => {
      return { content: "", opcode: OpCode.PWD };
    },
  },

  {
    command: "version",
    func: (args: string[]) => {
      return { content: version };
    },
  },
  {
    command: "login",
    func: (args: string[]) => {
      if (args.length !== 1) {
        return { content: "login: e|missing user|", error: true };
      }
      return { content: args[0], opcode: OpCode.LOGIN };
    },
  },
  {
    command: "logout",
    func: (args: string[]) => {
      return { content: "", opcode: OpCode.LOGOUT };
    },
  },
];

export function parseCommand(input: string): Output {
  const parts = input.trim().split(" ");
  const command = parts[0];
  let args = parts.slice(1);
  while (
    (args[0]?.startsWith('"') || args[0]?.startsWith("'")) &&
    args.length > 1
  ) {
    if (args[0].endsWith('"') || args[0].endsWith("'")) {
      break;
    }
    let arg = args[0];
    args = args.slice(1);
    args[0] = arg + " " + args[0];
  }
  let c_index = commands.findIndex((c) => c.command === command);
  if (c_index === -1) return { content: "e|command not found|", error: true };
  return commands[c_index].func(args);
}

export async function processCommand(
  input: string,
  filesystem: any,
  _console: any,
  router: any,
  processingInputState: any
) {
  let output = parseCommand(input);

  if (output.error) {
    _console.addLine({
      content: output.content,
      path: filesystem.currentPath,
    });
    return;
  }

  let message;

  switch (output.opcode) {
    case OpCode.CLEAR:
      _console.clear();
      return;
    case OpCode.CD:
      message = cd(output, filesystem);
      break;
    case OpCode.LS:
      message = ls(filesystem);
      break;
    case OpCode.CAT:
      message = cat(output, filesystem);
      break;
    case OpCode.PWD:
      message = pwd(filesystem);
      break;
    case OpCode.ADD:
      message = add(output, filesystem);
      break;
    case OpCode.EADD:
      message = echoAdd(output, filesystem);
      break;
    case OpCode.RM:
      message = rm(output, filesystem);
      break;
    case OpCode.MKDIR:
      message = mkdir(output, filesystem);
      break;
    case OpCode.RMDIR:
      message = rmdir(output, filesystem);
      break;
    case OpCode.LOGIN:
      if (_console.currentUser) {
        message = "login: e|already logged in|";
        break;
      }
      await consoleLogin(_console, processingInputState, output.content);
      return;
    case OpCode.LOGOUT:
      if (!_console.currentUser) {
        message = "logout: e|not logged in|";
        break;
      }
      await signOut({ callbackUrl: "/console", redirect: false });
      _console.setCurrentUser(undefined);
      router.refresh();
      return;
    default:
      message = output.content;
      break;
  }

  if (!!message)
    _console.addLine({
      content: message,
      path: filesystem.currentPath,
    });
}

function cd(output: Output, filesystem: any) {
  // check if more than one slash is used in a row
  if (output.content.match(/\/\/+/gm)) {
    return "cd: e|invalid path|";
  }
  if (output.content === "/" || output.content === "~") {
    filesystem.changePath("root");
    return;
  }
  if (!filesystem.changePath(output.content)) {
    return `cd: ${output.content}: e|no such file or directory|`;
  }
}

function pwd(filesystem: any) {
  return filesystem.currentPath;
}

function ls(filesystem: any) {
  let directory = "";
  let currentDirectory = filesystem.currentFolder ?? filesystem.root;

  for (let folder in currentDirectory.folders) {
    directory += `f|${folder}|  `;
  }
  for (let file in currentDirectory.files) {
    directory += `${file} `;
  }
  return directory;
}

function add(output: Output, filesystem: any) {
  let addF = filesystem.addFile({
    file: { name: output.content, content: "" },
    path: filesystem.currentPath,
    overwrite:
      output?.flags?.includes("--overwrite") || output?.flags?.includes("-o"),
  });
  if (!addF) return `touch: ${output.content}: e|File already exists|`;
}

function echoAdd(output: Output, filesystem: any) {
  if (!output.flags) return "echo: e|missing file name|";
  let eaddF = filesystem.addFile({
    file: { name: output.flags[0], content: output.content },
    overwrite:
      output?.flags?.includes("--overwrite") || output?.flags?.includes("-o"),
  });
  if (!eaddF) return `echo: ${output.flags[0]}: e|File already exists|`;
}

function rm(output: Output, filesystem: any) {
  let rmF = filesystem.rmFile(output.content);
  switch (rmF) {
    case -1:
      return `rm: ${output.content}: e|No such file|`;
    case -2:
      return `rm: ${output.content}: e|Requested file is a directory|`;
    case -3:
      return `rm: ${output.content}: e|Operation not permitted|`;
    default:
      return;
  }
}

function mkdir(output: Output, filesystem: any) {
  let mkDir = filesystem.mkDir(output.content);
  if (mkDir === -1) return `mkdir: ${output.content}: e|Folder already exists|`;
}

function rmdir(output: Output, filesystem: any) {
  let rmDir = filesystem.rmDir({
    folderName: output.content,
    recursive:
      !!output?.flags?.includes("-r") ||
      !!output?.flags?.includes("--recursive"),
  });
  switch (rmDir) {
    case -1:
      return `rmdir: ${output.content}: e|No such directory|`;
    case -2:
      return `rmdir: ${output.content}: e|Requested folder is a file|`;
    case -3:
      return `rmdir: ${output.content}: e|Operation not permitted|`;
    case -4:
      return `rmdir: ${output.content}: e|Folder is not empty|`;
    default:
      return;
  }
}

function cat(output: Output, filesystem: any) {
  let folder = filesystem.currentFolder ?? filesystem.root;
  let file = folder?.files[output.content];
  if (!file) {
    return `cat: ${output.content}: e|No such file or directory|`;
  }
  return file.content;
}

const consoleLogin = async (
  _console: any,
  processingInputState: any,
  username: string
) => {
  let count = 3;
  let user;
  processingInputState.setProcessing(true);
  try {
    user = await getUser(username);
  } catch (error) {
    console.log("[FETCH USER]", error);
    _console.addLine({ content: "login: e|could not fetch user|" });
    return;
  }
  processingInputState.setProcessing(false);
  if (!user) {
    _console.addLine({
      content: `login: ${username}: e|user not found|`,
    });
    return;
  }
  const login = async (input: string) => {
    processingInputState.setProcessing(true);
    let attempt = await loginAttempt({
      username: username,
      password: input,
    });
    processingInputState.setProcessing(false);
    if (attempt.error) {
      if (attempt.error === "An error occurred") {
        _console.addLine({
          content: "login: e|an error occurred|",
        });
        _console.disablePrompt();
        return;
      }
      count--;
      if (count <= 0) {
        _console.addLine({
          content: "login: e|too many attempts|",
        });
        _console.disablePrompt();
      } else {
        _console.addLine({
          content: "login: e|incorrect password|: " + count + " attempts left",
        });
        _console.enablePrompt("password", login);
      }
    } else {
      _console.setCurrentUser(username);
      _console.disablePrompt();
    }
  };
  _console.enablePrompt("password", login);
};
