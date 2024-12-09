import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (typeof window !== "undefined") {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find(
            (user: { email: string; password: string }) =>
              user.email === credentials?.email && user.password === credentials?.password
          );
          if (user) {
            return { id: user.id, name: user.name, email: user.email };
          }
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = typeof user.id === "string" ? user.id : ""; 
        token.name = typeof user.name === "string" ? user.name : ""; 
        token.email = typeof user.email === "string" ? user.email : ""; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = typeof token.id === "string" ? token.id : ""; 
        session.user.name = typeof token.name === "string" ? token.name : ""; 
        session.user.email = typeof token.email === "string" ? token.email : ""; 
      }
      return session;
    },
  },   
  debug: false,
});