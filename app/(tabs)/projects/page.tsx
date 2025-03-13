import { db } from "@/lib/db";

export default async function Projects() {
  const projects = await db.project.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <div>
      <h1>Projects</h1>
    </div>
  );
}
