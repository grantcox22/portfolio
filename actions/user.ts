"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getUser = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.log("[FETCH USER]", error);
    return;
  }
};

export const getCurrentUser = async () => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("No session found");
    }
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.log("[FETCH CURRENT USER]", error);
    return;
  }
};
