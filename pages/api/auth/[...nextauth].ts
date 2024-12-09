import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        users: { label: "Users", type: "text" }, 
      },
      authorize: async (credentials) => {
        const users = JSON.parse(credentials?.users || "[]");
        console.log("Received users from frontend:", users);

        const user = users.find(
          (user: { email: string; password: string }) =>
            user.email === credentials?.email && user.password === credentials?.password
        );

        console.log("User found:", user);

        if (user) {
          return {
            id: user.id || "unknown",
            name: user.name || "Unknown User",
            email: user.email || "unknown@example.com",
          };
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
});