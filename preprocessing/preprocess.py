import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import fuzz, process

books = pd.read_csv("public/data/books.csv", low_memory=False)
movies = pd.read_csv("public/data/movies.csv", low_memory=False)

def clean_and_combine(df, title_col, genre_col, description_col):
    df = df.fillna("")  
    df['combined_features'] = (
        df[title_col].str.lower().str.strip() + " " +
        df[genre_col].str.lower().str.strip() + " " +
        df[description_col].str.lower().str.strip()
    )
    return df

books_cleaned = clean_and_combine(books, "title", "genres", "description").drop_duplicates(subset="title")
movies_cleaned = clean_and_combine(movies, "title", "genres", "overview").drop_duplicates(subset="title")

vectorizer = TfidfVectorizer(stop_words="english")
book_vectors = vectorizer.fit_transform(books_cleaned['combined_features'])
movie_vectors = vectorizer.transform(movies_cleaned['combined_features'])

def recommend_movies_by_book(input_title, books_df, movies_df, book_vecs, movie_vecs):
    normalized_input = input_title.lower().strip()

    books_df['normalized_title'] = books_df['title'].str.lower().str.strip()

    book_matches = process.extract(
        normalized_input, books_df['normalized_title'].tolist(), scorer=fuzz.partial_ratio, limit=5
    )

    filtered_matches = [match for match in book_matches if match[1] > 85]

    if not filtered_matches:
        print("No matching book found!")
        return

    print("Books matching your input:")
    unique_titles = []
    for i, (normalized_title, score, index) in enumerate(filtered_matches, start=1):
        original_title = books_df.iloc[index]['title']  
        if original_title not in unique_titles: 
            unique_titles.append(original_title)
            print(f"{i}. {original_title} (Score: {score})")

    if len(unique_titles) == 1:
        chosen_match = filtered_matches[0]
    else:
        while True:  
            try:
                choice = int(input("Choose the correct book by entering its number: ")) - 1
                if 0 <= choice < len(unique_titles):  
                    chosen_match = filtered_matches[choice]
                    break
                else:
                    print("Invalid number. Please choose a valid option.")
            except ValueError:
                print("Invalid input. Please enter a number.")

    matched_title = books_df.iloc[chosen_match[2]]['title']  
    book_idx = books_df[books_df['title'] == matched_title].index[0]
    print(f"\nYou selected: {matched_title}")

    book_vector = book_vecs[book_idx]

    similarity_scores = cosine_similarity(book_vector, movie_vectors).flatten()

    top_indices = similarity_scores.argsort()[-5:][::-1]  
    print(f"\nTop movie recommendations for '{matched_title}':")
    for i, idx in enumerate(top_indices):
        print(f"{i+1}. {movies_df.iloc[idx]['title']} (Score: {similarity_scores[idx]:.2f})")

user_input = input("Enter a book title: ")
recommend_movies_by_book(user_input, books_cleaned, movies_cleaned, book_vectors, movie_vectors)