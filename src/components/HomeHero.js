import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import HeroImage from "../images/hero-img.png";

function HomeHero() {
  return (
    <>
      <section className="home-hero">
        <Row className="align-items-center g-4">
          <Col xs={12} lg={6}>
            <div className="home-hero__content">
              <p className="home-hero__eyebrow">Creative API Playground</p>

              <h1 className="brand-font home-hero__title">
                Welcome to API Fun
              </h1>

              <p className="home-hero__text">
                Search Spotify, explore movies, and experiment with fun API-powered
                tools in one clean experience.
              </p>

              <div className="home-hero__actions">
                <Link to="/SpotifySearch">
                  <Button className="home-btn home-btn--primary">
                    Search Spotify
                  </Button>
                </Link>

                <Link to="/MovieSearch">
                  <Button className="home-btn home-btn--secondary">
                    Search Movies
                  </Button>
                </Link>
              </div>
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <div className="home-hero__image-wrap">
              <img
                src={HeroImage}
                alt="API Fun character"
                className="home-hero__image"
              />
            </div>
          </Col>
        </Row>
      </section>

      <section className="home-features">
        <Row className="g-4">
          <Col xs={12} md={6} xl={4}>
            <Card className="home-feature-card h-100">
              <Card.Body>
                <Card.Title className="home-feature-card__title">
                  Spotify Search
                </Card.Title>
                <Card.Text className="home-feature-card__text">
                  Search artists, albums, and songs from one page.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} xl={4}>
            <Card className="home-feature-card h-100">
              <Card.Body>
                <Card.Title className="home-feature-card__title">
                  Movie Search
                </Card.Title>
                <Card.Text className="home-feature-card__text">
                  Find movies, browse results, and open detail pages.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} xl={4}>
            <Card className="home-feature-card h-100">
              <Card.Body>
                <Card.Title className="home-feature-card__title">
                  More API Fun
                </Card.Title>
                <Card.Text className="home-feature-card__text">
                  More API-powered experiments and tools are coming soon.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default HomeHero;
