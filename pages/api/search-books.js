import fs from "fs";
import path from "path";
import Papa from "papaparse";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "data", "books_cleaned.csv");
    const fileContent = fs.readFileSync(filePath, "utf8");

    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    }).data;

    const matchingBooks = parsedData.filter(
      (book) =>
        book.title?.toLowerCase().includes(query.toLowerCase()) ||
        book.author?.toLowerCase().includes(query.toLowerCase())
    );

    const uniqueBooks = Array.from(
      new Map(matchingBooks.map((book) => [book.title, book])).values()
    );

    const booksWithCovers = uniqueBooks.slice(0, 5).map((book) => {
      let cleanAuthor = "Unknown Author";

      if (book.author) {
        try {
          const parsedAuthors = JSON.parse(book.author.replace(/'/g, '"'));
          cleanAuthor = Array.isArray(parsedAuthors)
            ? parsedAuthors.join(", ")
            : parsedAuthors;
        } catch (e) {
          cleanAuthor = book.author
            .replace(/[\[\]']/g, "")
            .split(",")
            .map((a) => a.trim())
            .join(", ");
        }
      }

      return {
        title: book.title,
        author: cleanAuthor,
        description: book.description || "No description available",
        coverUrl: book.coverUrl || null, 
      };
    });

    if (booksWithCovers.length === 0) {
      return res.status(404).json({ error: "No books found." });
    }

    res.status(200).json(booksWithCovers);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}