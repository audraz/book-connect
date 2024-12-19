-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "belongs_to_collection" JSONB,
    "budget" INTEGER NOT NULL,
    "genres" JSONB NOT NULL,
    "homepage" TEXT,
    "imdb_id" TEXT NOT NULL,
    "original_language" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL,
    "poster_path" TEXT NOT NULL,
    "production_companies" JSONB NOT NULL,
    "production_countries" JSONB NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "runtime" DOUBLE PRECISION,
    "spoken_languages" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "tagline" TEXT,
    "title" TEXT NOT NULL,
    "video" BOOLEAN NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "poster_url" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "titleComplete" TEXT,
    "description" TEXT NOT NULL,
    "genres" JSONB NOT NULL,
    "isbn" TEXT,
    "publisher" TEXT,
    "author" TEXT NOT NULL,
    "characters" JSONB,
    "places" JSONB,
    "ratingHistogram" JSONB,
    "ratingsCount" INTEGER,
    "reviewsCount" INTEGER,
    "numPages" INTEGER,
    "language" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
