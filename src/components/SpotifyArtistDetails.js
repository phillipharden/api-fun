import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const baseURI = "https://api.spotify.com/v1";

function SpotifyArtistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
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

    async function loadArtistDetails() {
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

        const artistResponse = await fetch(`${baseURI}/artists/${id}`, searchParams);
        const artistData = await artistResponse.json();

        if (!artistResponse.ok) {
          throw new Error(artistData?.error?.message || "Unable to load artist.");
        }

        setArtist(artistData);

        const albumsResponse = await fetch(
          `${baseURI}/artists/${id}/albums?include_groups=album&market=US&limit=50`,
          searchParams
        );
        const albumsData = await albumsResponse.json();

        if (!albumsResponse.ok) {
          throw new Error(albumsData?.error?.message || "Unable to load albums.");
        }

        setAlbums(albumsData.items || []);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message || "Unable to load artist details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadArtistDetails();
  }, [accessToken, id]);

  return (
    <Container className="margin-bottom-custom">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>

      {isLoading && <p>Loading artist...</p>}
      {errorMessage && <ErrorMessage Message={errorMessage} />}

      {artist && (
        <Row className="spotify-detail-layout g-4">
          <Col xs={12} lg={4}>
            <div className="spotify-detail-sidebar">
              {artist.images?.[0]?.url && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="spotify-detail-image artist-detail-image"
                />
              )}

              <div className="spotify-detail-info">
                <h1 className="spotify-detail-title">{artist.name}</h1>

                <p className="spotify-detail-meta">
                  <strong>Followers:</strong>{" "}
                  {artist.followers?.total?.toLocaleString() || "N/A"}
                </p>

                <p className="spotify-detail-meta">
                  <strong>Genres:</strong>{" "}
                  {artist.genres?.length ? artist.genres.join(", ") : "N/A"}
                </p>

                <p className="spotify-detail-meta">
                  <strong>Popularity:</strong> {artist.popularity ?? "N/A"}
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} lg={8}>
            <div className="spotify-detail-main">
              <h2 className="brand-font h4 mb-3">Albums</h2>

              <Row>
                {albums.map((album) => (
                  <Col xs={12} sm={6} xl={4} key={album.id} className="mb-4">
                    <Card
                      className="album-card h-100 spotify-click-card"
                      onClick={() => navigate(`/SpotifyAlbum/${album.id}`)}
                    >
                      {album.images?.[0]?.url && (
                        <Card.Img src={album.images[0].url} alt={album.name} />
                      )}
                      <Card.Body>
                        <Card.Title>{album.name}</Card.Title>
                        <Card.Text>
                          {album.release_date?.substring(0, 4)}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default SpotifyArtistDetails;
