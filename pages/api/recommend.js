import fs from "fs";
import path from "path";
import Papa from "papaparse";

let movies;

function loadMovies() {
  const filePath = path.join(process.cwd(), "public", "data", "movies_with_posters.csv");
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    movies = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    }).data;
    console.log("Movies loaded successfully.");
  } else {
    throw new Error("Movies dataset file not found!");
  }
}

loadMovies();

export default function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const matchingMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(query.toLowerCase()) ||
    movie.genres?.toLowerCase().includes(query.toLowerCase())
  );

  const recommendations = matchingMovies.slice(0, 5).map((movie) => ({
    movie: movie.title,
    posterUrl: movie.poster_url || "/placeholder-poster.png",
    score: parseFloat(movie.vote_average) || 0,
    description: movie.overview || "No description available",
  }));

  if (recommendations.length === 0) {
    return res.status(404).json({ error: "No matching movies found." });
  }

  res.status(200).json({
    query,
    recommendations,
  });
}