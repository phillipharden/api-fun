import React from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../data/navLinks";

const FooterNav = () => {
  return (
    <div className="footer-nav">
      <div className="footer-nav-body">
        {navLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link key={link.to} to={link.to} className="footer-nav-link">
              <Icon className="footer-nav-icon" />
              <p className="footer-nav-text">{link.shortLabel}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterNav;
