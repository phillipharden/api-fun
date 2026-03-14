import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const baseURI = "https://api.spotify.com/v1";

function SpotifyAlbumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [album, setAlbum] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => {
        console.error(error);
        setErrorMessage("Unable to connect to Spotify.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    async function loadAlbumDetails() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const searchParams = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await fetch(`${baseURI}/albums/${id}`, searchParams);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error?.message || "Unable to load album.");
        }

        setAlbum(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message || "Unable to load album details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAlbumDetails();
  }, [accessToken, id]);

  return (
    <Container className="margin-bottom-custom">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>

      {isLoading && <p>Loading album...</p>}
      {errorMessage && <ErrorMessage Message={errorMessage} />}

      {album && (
        <Row className="spotify-detail-layout g-4">
          <Col xs={12} lg={4}>
            <div className="spotify-detail-sidebar">
              {album.images?.[0]?.url && (
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="spotify-detail-image album-detail-image"
                />
              )}

              <div className="spotify-detail-info">
                <h1 className="spotify-detail-title">{album.name}</h1>

                <p className="spotify-detail-meta">
                  <strong>Artist:</strong>{" "}
                  {album.artists?.map((artist) => artist.name).join(", ")}
                </p>

                <p className="spotify-detail-meta">
                  <strong>Release Year:</strong>{" "}
                  {album.release_date?.substring(0, 4) || "N/A"}
                </p>

                <p className="spotify-detail-meta">
                  <strong>Total Tracks:</strong> {album.total_tracks || "N/A"}
                </p>

                <p className="spotify-detail-meta">
                  <strong>Label:</strong> {album.label || "N/A"}
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} lg={8}>
            <div className="spotify-detail-main">
              <h2 className="brand-font h4 mb-3">Tracks</h2>

              <ListGroup className="spotify-track-list">
                {album.tracks?.items?.map((track) => (
                  <ListGroup.Item
                    key={track.id}
                    action
                    className="track-list spotify-track-item"
                    onClick={() => {
                      if (track.external_urls?.spotify) {
                        window.open(
                          track.external_urls.spotify,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                  >
                    <div className="spotify-track-row">
                      <span className="spotify-track-number">
                        {track.track_number}.
                      </span>
                      <span className="spotify-track-name">{track.name}</span>
                      <span className="spotify-track-duration">
                        {Math.floor(track.duration_ms / 60000)}:
                        {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
                      </span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default SpotifyAlbumDetails;
