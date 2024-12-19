import fs from "fs";
import path from "path";
import Papa from "papaparse";

let recommendations = [];

function loadRecommendations() {
  const filePath = path.join(process.cwd(), "public", "data", "movies_with_posters.csv");
  if (fs.existsSync(filePath)) {
    const csvContent = fs.readFileSync(filePath, "utf8");
    const parsedData = Papa.parse(csvContent, { header: true, skipEmptyLines: true }).data;

    recommendations = parsedData.map((row) => ({
      title: row.title || "Unknown",
      genres: row.genres ? JSON.parse(row.genres.replace(/'/g, '"')) : [],
      movie: row.title || "Unknown",
      posterUrl: row.poster_url || "/placeholder-poster.png",
      score: parseFloat(row.vote_average) || 0,
      description: row.overview || "No description available",
    }));
    console.log("Movies dataset loaded successfully.");
  } else {
    console.error("movies_with_posters.csv file not found!");
    throw new Error("movies_with_posters.csv file not found!");
  }
}

// Load the dataset once when the server starts
loadRecommendations();

export default function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  // Filter based on title
  const matchedMovies = recommendations
    .filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  if (matchedMovies.length > 0) {
    return res.status(200).json({
      query,
      recommendations: matchedMovies,
    });
  }

  // If no title match, fallback to genre match
  const randomGenres =
    recommendations[Math.floor(Math.random() * recommendations.length)].genres;

  const genreFallback = recommendations
    .filter((movie) =>
      movie.genres.some((genre) =>
        randomGenres.some((randomGenre) => genre.toLowerCase() === randomGenre.toLowerCase())
      )
    )
    .slice(0, 5);

  if (genreFallback.length > 0) {
    return res.status(200).json({
      query,
      fallback: true,
      recommendations: genreFallback,
    });
  }

  // Final fallback to return random movies
  const randomMovies = recommendations.slice(0, 5);

  return res.status(200).json({
    query,
    fallback: true,
    recommendations: randomMovies,
  });
}