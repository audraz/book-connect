import fs from "fs";
import path from "path";

let recommendations;

function loadRecommendations() {
  const filePath = path.join(process.cwd(), "public", "data", "recommendations.json");
  if (fs.existsSync(filePath)) {
    recommendations = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log("Recommendations loaded successfully.");
  } else {
    throw new Error("Recommendations file not found!");
  }
}

loadRecommendations();

export default function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const matchedBook = Object.keys(recommendations).find((book) =>
    book.toLowerCase().includes(query.toLowerCase())
  );

  if (!matchedBook) {
    return res.status(404).json({ error: "No matching book found." });
  }

  res.status(200).json({
    book: matchedBook,
    recommendations: recommendations[matchedBook],
  });
}