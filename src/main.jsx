import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage";  // <-- ici
import "./index.css";
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
