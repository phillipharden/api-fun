import React from "react";
import { Container } from "react-bootstrap";
import HomeHero from "../components/HomeHero";

function Home() {
  return (
    <Container className="home-page margin-bottom-custom">
      <HomeHero />
    </Container>
  );
}

export default Home;
