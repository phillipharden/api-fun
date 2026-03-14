import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Figure,
} from "react-bootstrap";
import ErrorMessage from "../components/ErrorMessage";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const baseURI = "https://api.spotify.com/v1";

function ArtistSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const param = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", param)
      .then((results) => results.json())
      .then((data) => {
        setAccessToken(data.access_token);
      })
      .catch((results) => {
        console.error(results);
      });
  }, []);

  async function search() {
    const trimmedSearch = searchInput.trim();

    if (!trimmedSearch || !accessToken) return;

    console.log(`Searched for ${trimmedSearch}`);

    setError(false);
    setErrorMessage("");
    setArtistData(null);
    setAlbums([]);
    setRelatedArtists([]);

    const searchParam = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      const artistID = await fetch(
        `${baseURI}/search?q=${encodeURIComponent(trimmedSearch)}&type=artist&limit=1`,
        searchParam
      )
        .then((response) => response.json())
        .then((data) => {
          const firstArtist = data?.artists?.items?.[0];

          if (!firstArtist) {
            setErrorMessage("Sorry, no results were found. Please try again.");
            setError(true);
            return null;
          }

          setArtistData(firstArtist);
          return firstArtist.id;
        });

      if (!artistID) return;

      await fetch(
        `${baseURI}/artists/${artistID}/albums?include_groups=album&market=US&limit=40`,
        searchParam
      )
        .then((response) => response.json())
        .then((data) => {
          setAlbums(Array.isArray(data.items) ? data.items : []);
        });

      await fetch(
        `${baseURI}/artists/${artistID}/related-artists`,
        searchParam
      )
        .then((response) => response.json())
        .then((data) => {
          setRelatedArtists(Array.isArray(data.artists) ? data.artists : []);
        });
    } catch (err) {
      console.error(err);
      setErrorMessage("Sorry, something went wrong. Please try again.");
      setError(true);
    }
  }

  return (
    <Container className="margin-bottom-custom">
      <div>
        <h1 className="brand-font">Search by Artist</h1>

        <InputGroup className="input-group my-3" size="sm">
          <FormControl
            placeholder="Search for an artist..."
            type="text"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </div>

      {error && <ErrorMessage Message={errorMessage} />}

      <div>
        {artistData && (
          <div className="mx-auto">
            <h2 className="text-center my-3">{artistData.name}</h2>

            <div className="main-artist artist-img-container mx-auto">
              {artistData.images?.[0]?.url && (
                <img
                  src={artistData.images[0].url}
                  alt={`Profile picture for ${artistData.name}`}
                  className="artist-img"
                />
              )}
            </div>

            {relatedArtists.length > 0 && (
              <>
                <p className="brand-font h4 py-2 my-3 text-center">
                  Here are some artists similar to {artistData.name}...
                </p>

                <Row className="mx-2 row">
                  {relatedArtists.map((artist) => (
                    <Figure
                      key={artist.id}
                      className="text-center my-3 pb-2 col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
                    >
                      <div className="mx-auto related-artist artist-img-container">
                        {artist.images?.[0]?.url && (
                          <img
                            alt={`Profile picture for ${artist.name}`}
                            src={artist.images[0].url}
                            className="artist-img"
                          />
                        )}
                      </div>

                      <Figure.Caption className="artist-name">
                        {artist.name}
                      </Figure.Caption>
                    </Figure>
                  ))}
                </Row>
              </>
            )}
          </div>
        )}
      </div>

      <div>
        {artistData && albums.length > 0 && (
          <div>
            <p className="text-center brand-font pt-5 pb-2 h4 my-3">
              Check out these albums from {artistData.name}
            </p>

            <Row className="row m-auto">
              {albums.map((album) => (
                <Card
                  key={album.id}
                  className="album-card my-3 col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2"
                >
                  {album.images?.[0]?.url && (
                    <Card.Img
                      src={album.images[0].url}
                      alt={`Album cover for ${album.name}`}
                    />
                  )}

                  <Card.Body>
                    <Card.Title className="small">{album.name}</Card.Title>
                    <Card.Text>
                      {album.release_date?.substring(0, 4)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Container>
  );
}

export default ArtistSearch;
