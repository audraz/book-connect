import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; 
import bcrypt from "bcryptjs"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { name, password, email } = req.body;
    console.log("Received request body:", req.body); 
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    let updateData: any = {};
  
    if (name) {
      updateData.name = name;
      console.log("Updating name to:", name); 
    }
  
    if (password) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
        console.log("Updating password"); 
      } catch (error) {
        return res.status(500).json({ error: "Error hashing the password" });
      }
    }
  
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const updatedUser = await prisma.user.update({
        where: { email },
        data: updateData,
      });
  
      console.log("Updated user:", updatedUser); 
  
      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }  