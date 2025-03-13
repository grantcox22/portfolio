import { ListItem } from "@/components/list-item";
import { Project } from "@prisma/client";
import { CornerDownRight, Link2Icon, List } from "lucide-react";
import Link from "next/link";
import parse from "html-react-parser";

interface ProjectProps {
  project: Project & {
    category: {
      name: string;
    }[];
  };
}

export function ProjectDisplay({ project }: ProjectProps) {
  return (
    <div className="max-w-xl">
      {project.projectLink ? (
        <Link
          href={project.projectLink}
          className="text-3xl font-bold hover:text-gray-200"
        >
          ./{project.name}
        </Link>
      ) : (
        <h1 className="text-3xl font-bold">./{project.name}</h1>
      )}
      <div className="flex items-center space-x-2 my-2.5">
        {project.category.map((category) => (
          <span
            key={category.name}
            className="text-xs text-neutral-300 border rounded-md px-2 py-0.5"
          >
            {category.name}
          </span>
        ))}
      </div>
      <div className="pl-2 border-l">
        <div>{parse(project.description ?? "")}</div>
        <ul className="px-2">
          {project.articleLink && (
            <ListItem>
              <Link href={project.articleLink} className="flex" target="_blank">
                Read More
                <Link2Icon className="w-4 h-4 mt-1 ml-1" />
              </Link>
            </ListItem>
          )}
          {project.githubLink && (
            <ListItem>
              <Link href={project.githubLink} className="flex" target="_blank">
                Github
                <Link2Icon className="w-4 h-4 mt-1 ml-1" />
              </Link>
            </ListItem>
          )}
        </ul>
      </div>
    </div>
  );
}
