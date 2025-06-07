import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Map from "../components/ui/Map";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // <-- c’est ici que tu dois l’importer
// src/pages/HomePage.jsx
import LocationCard from "../components/ui/LocationCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Assure-toi que ce fichier existe


export default function HomePage() {
  const [location, setLocation] = useState("");
  const [listings, setListings] = useState([]);

  // 🔥 Fetch depuis Firestore
  useEffect(() => {
  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "listings"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("📦 Listings reçus :", data); // 👈 pour debug
      setListings(data);
    } catch (error) {
      console.error("🔥 Erreur Firestore :", error);
    }
  };

  fetchListings();
}, []);


  // 💡 Optionnel : filtrer par localisation entrée
  const filteredListings = listings.filter(listing =>
    listing.location?.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Kitch'N'Share</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une cuisine ou une salle de bain."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-4">
              <img
                src="https://source.unsplash.com/400x300/?kitchen"
                alt={listing.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-sm text-gray-600">{listing.location}</p>
              <p className="text-sm mt-1">{listing.description}</p>
              <p className="text-lg font-bold mt-2">{listing.price} € / jour</p>
              <Button className="mt-2">Réserver</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Nos emplacements</h2>
        <Map />
      </div>
    </div>
  );
}
