import { AiFillHome } from "react-icons/ai";
import { FaFilm, FaMusic } from "react-icons/fa";

export const navLinks = [
  {
    to: "/Home",
    label: "Home",
    shortLabel: "Home",
    icon: AiFillHome,
  },
  {
    to: "/SpotifySearch",
    label: "Search Spotify",
    shortLabel: "Spotify",
    icon: FaMusic,
  },
  {
    to: "/MovieSearch",
    label: "Search Movies",
    shortLabel: "Movies",
    icon: FaFilm,
  },
];
