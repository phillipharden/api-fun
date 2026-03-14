import React from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../data/navLinks";

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="sidebar-body">
        <div className="sidebar-logo-container">
          <img src={props.ImgUrl} alt={props.ImgAlt} className="sidebar-logo" />
        </div>

        <h1 className="brand-font m-3">{props.Title}</h1>

        {navLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link key={link.to} to={link.to} className="sidebar-link">
              <Icon className="sidebar-icon" /> {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
