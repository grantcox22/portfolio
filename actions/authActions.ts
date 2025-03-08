"use server";
import { loginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { getUser } from "./user";
import { signIn } from "@/auth";
import { getSession, signOut } from "next-auth/react";

export const loginAttempt = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const user = await getUser(values.username);
  if (!user) {
    return { error: "User not found" };
  }

  const callbackUrl = "/console";

  try {
    await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirectTo: callbackUrl,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid password" };
        default:
          break;
      }
    }
    return { error: "An error occurred" };
  }

  return { success: true };
};

export const getCurrentSession = async () => {
  const session = await getSession();
  return session;
};
