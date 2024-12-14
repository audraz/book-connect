import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma"; 
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export default NextAuth({
  adapter: PrismaAdapter(prisma), 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          console.error("No credentials provided");
          throw new Error("Invalid email or password.");
        }

        console.log("Step 1 - Credentials received:", credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, name: true, email: true, password: true },
        });

        console.log("Step 2 - User found in database:", user);

        if (!user) {
          console.error("Step 3 - No user found with this email.");
          throw new Error("Invalid email or password.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password || "");
        console.log("Step 4 - Password is valid:", isValidPassword);

        if (!isValidPassword) {
          console.error("Step 5 - Password does not match.");
          throw new Error("Invalid email or password.");
        }

        console.log("Step 6 - Login successful!");

        return {
          id: user.id,
          name: user.name || "No Name", 
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
  debug: true, 
});