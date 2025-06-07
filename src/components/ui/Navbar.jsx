import React from "react";
import { NavLink } from "react-router-dom";

const activeStyle = {
  textDecoration: "underline",
  fontWeight: "bold",
};

export default function Navbar() {
  return (
    <nav
      style={{ backgroundColor: "#222", padding: "1rem", color: "white" }}
    >
      <ul
        style={{
          display: "flex",
          gap: "2rem",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        <li>
          <NavLink
            to="/"
            end
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/create"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Créer une annonce
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            À propos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
