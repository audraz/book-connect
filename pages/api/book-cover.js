export default async function handler(req, res) {
    const { query } = req.query; // Input user
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }
  
    try {
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=5`;
  
      const response = await fetch(googleBooksUrl);
      const data = await response.json();
  
      if (data.items && data.items.length > 0) {
        const results = data.items.map((book) => ({
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || [],
          coverUrl: book.volumeInfo.imageLinks?.thumbnail || null,
        }));
        return res.status(200).json(results);
      } else {
        return res.status(404).json({ error: "No books found." });
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }  