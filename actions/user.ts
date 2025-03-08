"use server";
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
