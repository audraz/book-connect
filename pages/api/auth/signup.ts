// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; // Ensure prisma is set up properly
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request Method:", req.method); // Log request method to confirm it's POST

  if (req.method === "POST") {
    try {
      console.log("Request Body:", req.body); // Log the body content to check if it's coming correctly
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ message: "Signup successful", user: newUser });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.log("Method not allowed"); // Log to track when method is not POST
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}