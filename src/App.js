import React from "react";
//? -----REACT-ROUTER----------------------------------------------------------------
import { Routes, Route } from "react-router-dom";
//? -----PAGES-----------------------------------------------------------------------
import Home from "./pages/Home";
import ArtistSearch from "./pages/ArtistSearch";
import SongSearch from "./pages/SongSearch";
import AlbumSearch from "./pages/AlbumSearch";
import MovieSearch from "./pages/MovieSearch";
//? -----COMPONENTS-------------------------------------------------------------------
import Sidebar from "./components/Sidebar";
import FooterNav from "./components/FooterNav";
import Header from "./components/Header";
import Logo from "./images/api-fun-logo.png";
import MovieDetails from "./components/MovieDetails";

import SpotifySearch from "./pages/SpotifySearch";
import SpotifyArtistDetails from "./components/SpotifyArtistDetails";
import SpotifyAlbumDetails from "./components/SpotifyAlbumDetails";



function App() {
  return (
    <div className="app">
      <div className="app-header">
        <Header ImgUrl={Logo} ImgAlt="API Fun's Logo" Title="API Fun" />
      </div>

      <div className="main-section">
        <div className="app-sidebar">
          <Sidebar ImgUrl={Logo} ImgAlt="API Fun Logo" Title="API Fun" />
        </div>

        <div className="app-body">
          <div className="container-lg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/ArtistSearch" element={<ArtistSearch />} />
              <Route path="/AlbumSearch" element={<AlbumSearch />} />
              <Route path="/SongSearch" element={<SongSearch />} />
              <Route path="/MovieSearch" element={<MovieSearch />} />
              <Route path="/MovieDetails/:id" element={<MovieDetails />} />
              <Route path="/SpotifySearch" element={<SpotifySearch />} />
              <Route path="/SpotifyArtist/:id" element={<SpotifyArtistDetails />} />
              <Route path="/SpotifyAlbum/:id" element={<SpotifyAlbumDetails />} />


            </Routes>
          </div>
        </div>
      </div>

      <div className="app-footer-nav">
        <FooterNav />
      </div>
    </div>
  );
}

export default App;

