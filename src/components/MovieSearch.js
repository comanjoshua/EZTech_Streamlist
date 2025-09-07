// src/MovieSearch.js
import React, { useState, useEffect } from "react";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Secure: API key loaded from environment variable
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

  // On first load, restore last query and re-fetch results
  useEffect(() => {
    const savedQuery = localStorage.getItem("movieQuery");
    if (savedQuery) {
      setQuery(savedQuery);

      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          savedQuery
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setResults(data.results);
            setError(null);
          } else {
            setResults([]);
            setError("No results found");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Error fetching movies");
        });
    }
  }, [API_KEY]);

  // Save query whenever it changes
  useEffect(() => {
    if (query) {
      localStorage.setItem("movieQuery", query);
    }
  }, [query]);

  // Save results whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem("movieResults", JSON.stringify(results));
    }
  }, [results]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setError(null);
      } else {
        setResults([]);
        setError("No results found");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching movies");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Movies</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter movie title"
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {results.map((movie) => (
          <div
            key={movie.id}
            style={{
              margin: "10px",
              width: "200px",
              textAlign: "center",
            }}
          >
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  background: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                No Image
              </div>
            )}
            <p style={{ marginTop: "10px" }}>
              <strong>{movie.title}</strong>{" "}
              {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;
