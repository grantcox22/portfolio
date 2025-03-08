"use client";

import { useConsoleState } from "@/hooks/use-console";
import { useFileSystem } from "@/hooks/use-filesystem";
import { useInputProcessing } from "@/hooks/use-input-processing";
import { OpCode, processCommand } from "@/lib/console";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { use } from "react";
import { set } from "zod";

let dots = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function animateDots(ref: React.RefObject<HTMLDivElement | null>) {
  let i = 0;
  return setInterval(() => {
    if (!ref.current) return;
    ref.current.textContent = dots[i];
    i = (i + 1) % dots.length;
  }, 100);
}

const findIndex = (arr: any[], predicate: (item: any) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i;
    }
  }
  return -1;
};

interface ConsoleInputProps {
  path: string;
}

export default function ConsoleInput({ path }: ConsoleInputProps) {
  const _console = useConsoleState();
  const inputProcessingState = useInputProcessing();
  const filesystem = useFileSystem();
  const router = useRouter();
  const loader = React.useRef<HTMLDivElement | null>(null);

  const [currentIndex, setIndex] = React.useState<number>(0);

  let user = _console.currentUser;

  let animation: any;

  React.useEffect(() => {
    if (inputProcessingState.processing) {
      animation = animateDots(loader);
    } else {
      clearInterval(animation);
    }
  }, [inputProcessingState.processing]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements[0] as HTMLInputElement;
    const value = input.value;
    if (value === "") return;
    input.value = "";
    setIndex(_console.lines.length + 1);
    if (!_console.input) {
      _console.addLine({ content: value, input: true, path });
      await processCommand(
        value,
        filesystem,
        _console,
        router,
        inputProcessingState
      );
    } else {
      _console.addLine({
        content: `${_console.prompt?.content}: ${
          _console.prompt?.content === "password"
            ? value.replaceAll(/[A-Za-z0-9]/gm, "•")
            : value
        }`,
        input: false,
        path,
      });
      _console.prompt?.callback(value);
    }
  };

  return inputProcessingState.processing ? (
    <span ref={loader}></span>
  ) : (
    <>
      <div className="flex items-center h-6 w-full">
        {!_console.input ? (
          <>
            <span className="text-green-500">
              {!!user && <>{user}@</>}
              gcoxdev
            </span>
            :
            <span className="text-blue-500">
              {path === "root" ? "~" : path.replace("root", "~")}
            </span>
            $
          </>
        ) : (
          <span>{_console.prompt?.content}: </span>
        )}
        <form onSubmit={onSubmit} className="flex-grow">
          <input
            name="in"
            type={_console.prompt?.content === "password" ? "password" : "text"}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
              if (_console.lines.length === 0) {
                setIndex(0);
                return;
              }
              let inputValue = e.currentTarget.value ?? "";
              if (
                !currentIndex ||
                (_console.lines.length > 1 && inputValue !== "")
              )
                setIndex(
                  findIndex(
                    _console.lines,
                    (line) => line.content === inputValue
                  )
                );
              if (currentIndex === -1 || inputValue === "") {
                setIndex(_console.lines.length);
              }
              if (e.key === "ArrowUp") {
                for (let i = currentIndex - 1; i >= 0; i--) {
                  const line = _console.lines[i];
                  if (line.input) {
                    e.currentTarget.value = line.content;
                    setIndex(i);
                    return;
                  }
                }
              } else if (e.key === "ArrowDown") {
                if (currentIndex + 1 !== _console.lines.length - 1) {
                  for (
                    let i = currentIndex + 1;
                    i < _console.lines.length;
                    i++
                  ) {
                    const line = _console.lines[i];
                    if (line.input) {
                      e.currentTarget.value = line.content;
                      setIndex(i);
                      return;
                    }
                  }
                }
                e.currentTarget.value = "";
                setIndex(_console.lines.length);
              }
            }}
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-md px-2 w-full h-6 relative bg-transparent"
          />
        </form>
      </div>
    </>
  );
}
