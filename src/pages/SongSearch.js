import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
} from "react-bootstrap";

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const baseURI = "https://api.spotify.com/v1";

function SongSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [song, setSong] = useState(null);
  const [otherSongs, setOtherSongs] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

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
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => {
        console.error("Token error:", error);
      });
  }, []);

  async function search() {
    const trimmedSearch = searchInput.trim();

    if (!trimmedSearch || !accessToken) return;

    console.log(`Searched for ${trimmedSearch}`);

    const searchParam = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      const data = await fetch(
        `${baseURI}/search?q=${encodeURIComponent(trimmedSearch)}&type=track&limit=10`,
        searchParam
      ).then((response) => response.json());

      const trackItems = data?.tracks?.items || [];

      if (!trackItems.length) {
        setNoResultsFound(true);
        setSong(null);
        setOtherSongs([]);
        return;
      }

      setNoResultsFound(false);
      setSong(trackItems[0]);
      setOtherSongs(trackItems.slice(1));
    } catch (error) {
      console.error("Song search error:", error);
      setNoResultsFound(true);
      setSong(null);
      setOtherSongs([]);
    }
  }

  return (
    <Container className="margin-bottom-custom">
      <div>
        <h1 className="brand-font">Search by Song</h1>

        <InputGroup className="my-3" size="sm">
          <FormControl
            placeholder="Search for song..."
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

      {noResultsFound && <p>No results found. Please try another search.</p>}

      <div>
        {song && (
          <div className="song-info d-flex flex-column">
            <h2 className="brand-font h1 my-3">Top Result</h2>

            <div className="song-info-container d-flex">
              <div>
                {song.album?.images?.[0]?.url && (
                  <img
                    src={song.album.images[0].url}
                    alt={`Album cover for ${song.album.name}`}
                    className="top-result-album-image"
                  />
                )}
              </div>

              <div className="song-info-text my-3">
                <h2 className="d-flex flex-column">
                  <span className="type">Song</span>
                  {song.name}
                </h2>

                <p className="d-flex flex-column">
                  <span className="type">Artist</span>
                  {song.artists?.[0]?.name}
                </p>

                <p className="d-flex flex-column">
                  <span className="type">Album</span>
                  {song.album?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        {song && otherSongs.length > 0 && (
          <div>
            <h2 className="brand-font h4 my-3">More Songs</h2>

            <ListGroup className="mt-3">
              {otherSongs.map((track) => (
                <ListGroup.Item
                  key={track.id}
                  className="song-info-container more-songs-info d-flex my-3"
                >
                  <div>
                    {track.album?.images?.[0]?.url && (
                      <img
                        src={track.album.images[0].url}
                        alt={`Album cover for ${track.album.name}`}
                        className="song-album-image"
                      />
                    )}
                  </div>

                  <div className="song-info-text my-3">
                    <h2 className="h6 d-flex flex-column">
                      <span className="type">Song</span>
                      {track.name}
                    </h2>

                    <p className="d-flex flex-column">
                      <span className="type">Artist</span>
                      {track.artists?.[0]?.name}
                    </p>

                    <p className="d-flex flex-column">
                      <span className="type">Album</span>
                      {track.album?.name}
                    </p>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>
    </Container>
  );
}

export default SongSearch;
