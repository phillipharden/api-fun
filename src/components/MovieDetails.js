import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const TMDB_API_KEY = process.env.REACT_APP_TMDB_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMovieDetails() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (!TMDB_API_KEY) {
          throw new Error("TMDB API key is missing. Check your .env file.");
        }

        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.status_message ||
              `Request failed: ${response.status} ${response.statusText}`
          );
        }

        setMovie(data);
      } catch (error) {
        console.error("Movie details error:", error);
        setErrorMessage(error.message || "Unable to load movie details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMovieDetails();
  }, [id]);

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
  };

  const getYear = (releaseDate) => {
    if (!releaseDate) return "N/A";
    return releaseDate.substring(0, 4);
  };

  const getRating = (rating) => {
    if (typeof rating !== "number") return "N/A";
    return rating.toFixed(1);
  };

  return (
    <Container className="margin-bottom-custom movie-details-page">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>

      {isLoading && <p>Loading movie details...</p>}

      {errorMessage && !isLoading && <ErrorMessage Message={errorMessage} />}

      {movie && !isLoading && (
        <Row className="movie-details-layout g-4">
          <Col xs={12} md={4}>
            <div className="movie-poster-wrap">
              {getPosterUrl(movie.poster_path) && (
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={`Poster for ${movie.title}`}
                  className="movie-details-poster"
                />
              )}
            </div>
          </Col>

          <Col xs={12} md={8}>
            <div className="movie-details-content">
              <h1 className="movie-details-title">{movie.title}</h1>

              <p className="movie-details-meta">
                <strong>Release Year:</strong> {getYear(movie.release_date)}
              </p>

              <p className="movie-details-meta">
                <strong>Rating:</strong> {getRating(movie.vote_average)}
              </p>

              <p className="movie-details-meta">
                <strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </p>

              <p className="movie-details-meta">
                <strong>Genres:</strong>{" "}
                {movie.genres?.length
                  ? movie.genres.map((genre) => genre.name).join(", ")
                  : "N/A"}
              </p>

              <p className="movie-details-meta">
                <strong>Original Language:</strong> {movie.original_language?.toUpperCase()}
              </p>

              <div className="movie-details-overview">
                <h2 className="h4">Overview</h2>
                <p>{movie.overview || "No overview available."}</p>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default MovieDetails;
