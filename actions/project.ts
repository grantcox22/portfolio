"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./user";

const createProject = async (name: string) => {
  try {
    const project = await db.project.create({
      data: {
        name,
      },
    });
    return project;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateProject = async (id: string, data: any) => {
  try {
    const user = await getCurrentUser();
    if (!user || user.perms !== "ADMIN") {
      return false;
    }
    await db.project.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteProject = async (id: string) => {
  try {
    const user = await getCurrentUser();
    if (!user || user.perms !== "ADMIN") {
      return false;
    }
    await db.project.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};
