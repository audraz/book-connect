import path from "path";
import fs from "fs";
import csv from "csv-parser";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const csvFilePath = path.join(process.cwd(), "public", "data", "movies_with_posters.csv");
  const books = [];

  try {
    // Baca file CSV
    const stream = fs.createReadStream(csvFilePath).pipe(csv());

    stream.on("data", (row) => {
      books.push({
        title: row.title || "No Title",
        posterUrl: row.poster_url || "/placeholder-poster.png",
        description: row.overview || "No description available",
        user_id, // Simulasikan bahwa buku ini terkait dengan user_id
      });
    });

    stream.on("end", () => {
      // Kirim respons dengan data buku
      res.status(200).json(books);
    });

    stream.on("error", (error) => {
      console.error("Error reading CSV:", error);
      res.status(500).json({ error: "Failed to read books data" });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}