import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const appTitle = "Explore Spotify";
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const baseURI = "https://api.spotify.com/v1";

function AlbumSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);

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
        console.log("token response:", data);
        setAccessToken(data.access_token);
      })
      .catch((error) => {
        console.error("Token error:", error);
      });
  }, [clientId, clientSecret]);

  async function search() {
    console.log(`Searched for ${searchInput}`);

    const searchParam = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      const albumID = await fetch(
        `${baseURI}/search?q=${encodeURIComponent(searchInput)}&type=album`,
        searchParam
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("album search response:", data);

          if (!data.albums || !data.albums.items || !data.albums.items.length) {
            setAlbum(null);
            setTracks([]);
            return null;
          }

          setAlbum(data.albums.items[0]);
          return data.albums.items[0].id;
        });

      if (!albumID) return;

      await fetch(
        `${baseURI}/albums/${albumID}/tracks?market=US&limit=40`,
        searchParam
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("tracks response:", data);
          setTracks(data.items || []);
        });
    } catch (error) {
      console.error("Search error:", error);
      setAlbum(null);
      setTracks([]);
    }
  }

  return (
    <Container className="margin-bottom-custom">
      <div>
        <h1 className="brand-font">{appTitle}</h1>
        <InputGroup className="input-group my-3" size="sm">
          <FormControl
            placeholder="Search for an album..."
            type="input"
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

      <div>
        {album && (
          <div>
            <img
              src={album.images?.[0]?.url}
              alt={album.name}
              className="album-image"
            />
            <p className="h3 my-3">{album.name}</p>
            <p>{album.artists?.[0]?.name}</p>
          </div>
        )}
      </div>

      {album && (
        <div className="mb-6">
          <h2 className="brand-font h4">Album Tracks</h2>
          <ListGroup className="my-3">
            {tracks.map((track) => {
              return (
                <ListGroup.Item key={track.id} className="track-list">
                  <p className="h6">
                    {track.track_number}. {track.name}
                  </p>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      )}
    </Container>
  );
}

export default AlbumSearch;
