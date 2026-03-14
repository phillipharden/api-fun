import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const TMDB_API_KEY = process.env.REACT_APP_TMDB_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function MovieSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function handleSearch() {
    const trimmedSearch = searchInput.trim();

    if (!trimmedSearch) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      setNoResultsFound(false);
      setMovies([]);

      if (!TMDB_API_KEY) {
        throw new Error("TMDB API key is missing. Check your .env file.");
      }

      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          trimmedSearch
        )}&include_adult=false`
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.status_message ||
            `Request failed: ${response.status} ${response.statusText}`
        );
      }

      const movieResults = Array.isArray(data?.results) ? data.results : [];

      setMovies(movieResults);
      setNoResultsFound(movieResults.length === 0);
    } catch (error) {
      console.error("Movie search error:", error);
      setErrorMessage(error.message || "Unable to load movies right now.");
      setNoResultsFound(true);
    } finally {
      setIsLoading(false);
    }
  }

  const getYear = (releaseDate) => {
    if (!releaseDate) return "N/A";
    return releaseDate.substring(0, 4);
  };

  const openMovieDetails = (movieId) => {
    navigate(`/MovieDetails/${movieId}`);
  };

  return (
    <Container className="margin-bottom-custom">
      <h1 className="brand-font">Movies</h1>

      <InputGroup className="input-group my-3" size="sm">
        <FormControl
          className="form"
          placeholder="Search for a movie..."
          type="text"
          value={searchInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button
          className="search-button"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <FaSearch className="search-icon" />
        </Button>
      </InputGroup>

      {isLoading && <p>Searching movies...</p>}

      {(noResultsFound || errorMessage) && !isLoading && (
        <ErrorMessage
          Message={errorMessage || "No movies found. Please try again."}
        />
      )}

      {movies.length > 0 && (
        <div>
          <p>Results for "{searchInput}"</p>

          <ListGroup className="movie-results-list">
            {movies.map((movie) => (
              <ListGroup.Item
                key={movie.id}
                action
                className="movie-result-item"
                onClick={() => openMovieDetails(movie.id)}
              >
                <div className="movie-result-row">
                  <span className="movie-result-title">{movie.title}</span>
                  <span className="movie-result-year">
                    {getYear(movie.release_date)}
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
}

export default MovieSearch;
