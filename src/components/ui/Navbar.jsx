import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const activeStyle = {
  textDecoration: "underline",
  fontWeight: "bold",
};

export default function Navbar() {
  const currentUser = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#1e3a8a", // bleu foncé (tailwind blue-800)
        padding: "1rem 2rem",
        color: "white",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Nom du site */}
        <div
          style={{
            fontWeight: "700",
            fontSize: "1.5rem",
            cursor: "default",
          }}
        >
          Kitch'N'Share
        </div>

        {/* Menu */}
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            margin: 0,
            padding: 0,
            listStyle: "none", // supprime les puces
            alignItems: "center",
          }}
        >
          <li>
            <NavLink
              to="/"
              end
              style={({ isActive }) => (isActive ? activeStyle : { color: "white", textDecoration: "none" })}
            >
              Accueil
            </NavLink>
          </li>

          {currentUser && (
            <>
              <li>
                <NavLink
                  to="/my-listings"
                  style={({ isActive }) => (isActive ? activeStyle : { color: "white", textDecoration: "none" })}
                >
                  Mes annonces
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/create"
                  style={({ isActive }) => (isActive ? activeStyle : { color: "white", textDecoration: "none" })}
                >
                  Créer une annonce
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  style={({ isActive }) => (isActive ? activeStyle : { color: "white", textDecoration: "none" })}
                >
                  À propos
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    padding: 0,
                  }}
                  aria-label="Se déconnecter"
                >
                  🔓 Se déconnecter
                </button>
              </li>
            </>
          )}

          {!currentUser && (
            <li>
              <NavLink
                to="/login"
                style={({ isActive }) => (isActive ? activeStyle : { color: "white", textDecoration: "none" })}
              >
                🔐 Se connecter
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
