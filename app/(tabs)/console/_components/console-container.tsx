"use client";

import { useConsoleState } from "@/hooks/use-console";
import ConsoleLine, { ConsoleTypingLine } from "@/components/console-line";
import React from "react";
import ConsoleInput from "@/components/console-input";
import { ConsoleLine as _ConsoleLine } from "@/lib/console";
import { useFileSystem } from "@/hooks/use-filesystem";
import { useSession } from "next-auth/react";
import { welcomeMessage } from "@/lib/copy";

export default function Console({ serverUser }: any) {
  const _console = useConsoleState();
  const filesystem = useFileSystem();
  const [newestLine, setNewestLine] = React.useState<_ConsoleLine | undefined>(
    undefined
  );
  const [fresh, setFresh] = React.useState(false);

  React.useEffect(() => {
    _console.setCurrentUser(serverUser);
    if (
      _console.lines.length === 0 &&
      !fresh &&
      !_console.lines.find((line: any) => line.content === welcomeMessage)
    ) {
      _console.addLine({
        content: welcomeMessage,
        path: filesystem.currentPath,
      });
      setFresh(true);
    }
  }, []);

  React.useEffect(() => {
    if (_console.lines.length > 0) {
      if (_console.lines[_console.lines.length - 1].content === welcomeMessage)
        return;
      setNewestLine(_console.lines[_console.lines.length - 1]);
    } else {
      setNewestLine(undefined);
    }
  }, [_console.lines]);

  return (
    <div className="w-full flex flex-col overflow-y-auto max-h-[calc(100vh-13.25rem)] py-3 pr-4 rounded-b-md scrollbar-thin">
      {_console.lines.map((line, index) => (
        <>
          {index !== _console.lines.length - 1 ? (
            <ConsoleLine key={index} line={line} />
          ) : (
            <></>
          )}
        </>
      ))}
      {_console.lines.length > 1 && newestLine !== undefined ? (
        <ConsoleTypingLine line={newestLine} />
      ) : (
        <>
          {!!_console.lines.length && <ConsoleLine line={_console.lines[0]} />}
        </>
      )}
      <ConsoleInput path={filesystem.currentPath} />
    </div>
  );
}
