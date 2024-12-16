import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Load datasets
books = pd.read_csv('public/data/books.csv')
movies = pd.read_csv('public/data/movies.csv')

books['combined_features'] = (
    books['title'] + " " + books['genres'] + " " + books['description']
).fillna("").str.lower()

movies['combined_features'] = (
    movies['title'] + " " + movies['genres'] + " " + movies['overview']
).fillna("").str.lower()

tfidf_vectorizer = TfidfVectorizer(stop_words='english')
book_vectors = tfidf_vectorizer.fit_transform(books['combined_features'])
movie_vectors = tfidf_vectorizer.transform(movies['combined_features'])

recommendations = {}

for i, book in books.iterrows():
    sim_scores = cosine_similarity(book_vectors[i], movie_vectors).flatten()
    top_movies = sorted(
        enumerate(sim_scores), key=lambda x: x[1], reverse=True
    )[:5]
    recommendations[book['title']] = [
        {"movie": movies.iloc[j]['title'], "score": round(score, 2)}
        for j, score in top_movies
    ]

with open('recommendations.json', 'w') as f:
    json.dump(recommendations, f)

print("Recommendations precomputed and saved to 'recommendations.json'")