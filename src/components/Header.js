import React from "react";
import { Container } from "react-bootstrap";

const Header = (props) => {
  return (
      <Container className="header-container">
        <header>
          <img src={props.ImgUrl} alt={props.ImgAlt} className="header-logo" />
          <h1 className="brand-font header-title">{props.Title}</h1>
        </header>
      </Container>
  );
};

export default Header;
