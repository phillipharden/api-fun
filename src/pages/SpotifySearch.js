import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const baseURI = "https://api.spotify.com/v1";

function SpotifySearch() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", params)
      .then((results) => results.json())
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((error) => {
        console.error("Spotify token error:", error);
        setErrorMessage("Unable to connect to Spotify.");
      });
  }, []);

  async function handleSearch() {
    const trimmedSearch = searchInput.trim();

    if (!trimmedSearch || !accessToken) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      setResults([]);

      const searchParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(
        `${baseURI}/search?q=${encodeURIComponent(
          trimmedSearch
        )}&type=artist,album,track&limit=8`,
        searchParams
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Spotify search failed.");
      }

      const artistResults = (data.artists?.items || []).map((item) => ({
        id: item.id,
        type: "artist",
        name: item.name,
        subtitle: "Artist",
        image: item.images?.[0]?.url || null,
        spotifyUrl: item.external_urls?.spotify || "",
      }));

      const albumResults = (data.albums?.items || []).map((item) => ({
        id: item.id,
        type: "album",
        name: item.name,
        subtitle: item.artists?.map((artist) => artist.name).join(", ") || "Album",
        image: item.images?.[0]?.url || null,
        spotifyUrl: item.external_urls?.spotify || "",
      }));

      const trackResults = (data.tracks?.items || []).map((item) => ({
        id: item.id,
        type: "track",
        name: item.name,
        subtitle: item.artists?.map((artist) => artist.name).join(", ") || "Track",
        image: item.album?.images?.[0]?.url || null,
        spotifyUrl: item.external_urls?.spotify || "",
      }));

      setResults([...artistResults, ...albumResults, ...trackResults]);
    } catch (error) {
      console.error("Spotify search error:", error);
      setErrorMessage(error.message || "Unable to search Spotify.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleResultClick(item) {
    if (item.type === "artist") {
      navigate(`/SpotifyArtist/${item.id}`);
      return;
    }

    if (item.type === "album") {
      navigate(`/SpotifyAlbum/${item.id}`);
      return;
    }

    if (item.type === "track" && item.spotifyUrl) {
      window.open(item.spotifyUrl, "_blank", "noopener,noreferrer");
    }
  }

  function getBadgeText(type) {
    if (type === "artist") return "Artist";
    if (type === "album") return "Album";
    return "Song";
  }

  return (
    <Container className="margin-bottom-custom">
      <h1 className="brand-font">Spotify Search</h1>

      <InputGroup className="input-group my-3" size="sm">
        <FormControl
          className="form"
          placeholder="Search artists, albums, or songs..."
          type="text"
          value={searchInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button className="search-button" onClick={handleSearch} disabled={isLoading}>
          <FaSearch className="search-icon" />
        </Button>
      </InputGroup>

      {isLoading && <p>Searching Spotify...</p>}

      {errorMessage && <ErrorMessage Message={errorMessage} />}

      {results.length > 0 && (
        <ListGroup className="spotify-results-list">
          {results.map((item) => (
            <ListGroup.Item
              key={`${item.type}-${item.id}`}
              action
              className="spotify-result-item"
              onClick={() => handleResultClick(item)}
            >
              <div className="spotify-result-row">
                <div className="spotify-result-left">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="spotify-result-image"
                    />
                  )}

                  <div className="spotify-result-text">
                    <div className="spotify-result-name">{item.name}</div>
                    <div className="spotify-result-subtitle">{item.subtitle}</div>
                  </div>
                </div>

                <Badge bg="dark" className="spotify-result-badge">
                  {getBadgeText(item.type)}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default SpotifySearch;
