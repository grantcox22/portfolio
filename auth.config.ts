import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas";
import { getUser } from "./actions/user";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { username, password } = validatedFields.data;
          const user = await getUser(username);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
};
