import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const locations = [
  { id: 1, name: "Cuisine moderne #1", position: [48.8566, 2.3522], description: "Cuisine spacieuse avec équipement moderne" },
  { id: 2, name: "Salle de bain cosy #2", position: [48.864716, 2.349014], description: "Salle de bain élégante avec baignoire" },
  { id: 3, name: "Cuisine rustique #3", position: [48.853, 2.3499], description: "Cuisine avec charme et style ancien" },
];

// Composant pour recentrer la carte
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Map() {
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState([48.8566, 2.3522]); // Paris par défaut
  const [zoom, setZoom] = useState(13);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
      setZoom(13);
    } else {
      alert("Adresse non trouvée");
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-2">
        <input
          type="text"
          placeholder="Recherche une adresse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Rechercher</button>
      </form>

      <MapContainer center={position} zoom={zoom} style={{ height: "400px", width: "100%" }}>
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map(({ id, name, position, description }) => (
          <Marker key={id} position={position}>
            <Popup>
              <strong>{name}</strong>
              <br />
              {description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
