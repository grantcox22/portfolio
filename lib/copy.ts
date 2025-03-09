import { version } from "@/components/version";

export const helpMessage = `GCOXDEV bash, version ${version}
  These commands are defined internally. Type 'help' to see this list.
  Type 'help cmd' to find out more about the function 'cmd'
  \nclear
  ls
  pwd
  cd [dir]
  mkdir [dir]
  rmdir [dir] [-r]
  rm [file]
  touch [file]
  echo [... arg] -[o]
  cat [file]
  version`;
export const help: Record<string, string> = {
  clear: "Clear the terminal",
  help: `help: help [cmd]
    t|Display information about builtin commands.|`,
  ls: "List files and directories inside the current working directory",
  pwd: "Print the current working directory",
  cd: `cd: cd [dir]
    t|Change the current working directory.|
    \nt|Change the current directory to DIR. The default DIR is the value of the HOME shell variable.|
    \nt|The variable CDPATH defines the search path for the directory containing DIR. If DIR begins with a slash (/), then CDPATH is not used.|
    \nt|If the directory is not found in the search directory then the current working directory is not changed.|`,
  mkdir: `mkdir: mkdir [dir]
    t|Create the DIRECTORY, if they do not already exist.|`,
  rmdir: `rmdir: rmdir [dir] [-r]
    t|Remove the DIRECTORY, if the DIRECTORY is empty.|
    \nFLAGS:
    t|-r, --recursive|
    tt|Remove the DIRECTORY and all of its contents.|`,
  rm: `rm: rm [file]
    t|Delete the FILE.|`,
  touch: `touch: touch [file] -[o]
    t|Create the FILE, if the FILE does not exist.|
    \nFLAGS:
    t|-o, --overwrite|
    tt|Overwrite the file if it already exists.|`,
  echo: `echo: echo [... arg] -[o]
    t|Write the contents of args to the console.|
    t|If '>' is provided, write the contents of args to a FILE|
    \nFLAGS:
    t|-o, --overwrite|
    tt|Overwrite the file if it already exists.|`,
  cat: `cat: cat [file]
    t|Print the contents of the FILE if it exists.|`,
  version: "Print version",
};

export const welcomeMessage = `Welcome to the console ${version}
  t|* Type 'help' to see a list of available commands|\n`;

export const readme = `This is a simple console and filesystem that you can interact with. You can add files, remove files, make directories, and remove directories. You can also navigate through the filesystem using the \`cd\` command. To get started, type \`help\` to see a list of available commands.`;
