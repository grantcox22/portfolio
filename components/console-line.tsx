import { ConsoleLine as Line } from "@/lib/console";
import React from "react";
import parse from "html-react-parser";

interface ConsoleLineProps {
  line: Line;
}

export default function ConsoleLine({ line }: ConsoleLineProps) {
  let content = line.content;
  let user = line.user;
  return (
    <div className="min-h-6" style={{ flexShrink: 0 }}>
      {line.input && (
        <>
          <span className="text-green-500">
            {!!user && <>{user}@</>}
            gcoxdev
          </span>
          :
          <span className="text-blue-500">
            {line.path.replace("root", "~")}
          </span>
          <span className="pr-2">$</span>
        </>
      )}
      {formatLine(content)}
    </div>
  );
}

export function ConsoleTypingLine({ line }: ConsoleLineProps) {
  const [_line, setLine] = React.useState("");
  React.useEffect(() => {
    clearInterval(undefined);
    if (line?.input) setLine(line.content);
    else {
      setLine("");
      for (let i = 0; i < line.content.length; i++) {
        setTimeout(() => {
          setLine((prev) => prev + line.content[i]);
        }, (50 / Math.sqrt(line.content.length)) * i);
        if (i + 1 === line.content.length) {
          setTimeout(() => {
            setLine(line.content);
          }, (50 / Math.sqrt(line.content.length)) * (i + 1));
        }
      }
    }
  }, [line]);

  return <ConsoleLine line={{ ...line, content: _line }} />;
}

const formatLine = (content: string) => {
  content = content.replace(
    /f\|(.*?)\|/gm,
    `<span class='text-blue-500'>$1</span>`
  );
  content = content.replace(
    /e\|(.*?)\|/gm,
    "<span class='text-red-500'>$1</span>"
  );
  if (content.includes("\n")) {
    return content
      .split("\n")
      .map((line) => <div className="min-h-6">{parse(line)}</div>);
  } else {
    return parse(content);
  }
};
