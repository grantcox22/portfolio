import Home from "./_components/home-container";
import { db } from "@/lib/db";
export default async function HomePage() {
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

  return <Home projects={projects} />;
}
