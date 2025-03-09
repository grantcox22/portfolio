import { CornerDownRight } from "lucide-react";

export function ListItem({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  return (
    <li className="flex">
      <CornerDownRight className="mt-0.5 mr-1 h-4 w-4" /> {children ?? ""}
    </li>
  );
}
