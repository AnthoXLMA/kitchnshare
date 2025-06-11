import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Map from "../components/ui/Map";
import React, { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { geocodeAdresse } from "../utils/geocode";


export default function HomePage() {
  // États pour les filtres de recherche
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(1);
  const [category, setCategory] = useState(""); // <-- State catégorie ajouté

  // Listings récupérés de Firestore
  const [listings, setListings] = useState([]);

  useEffect(() => {
  const fetchListings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "listings"));

      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const listing = {
            id: doc.id,
            ...doc.data(),
          };

          if (!listing.latitude || !listing.longitude) {
            try {
              const coords = await geocodeAdresse(listing.location);
              listing.latitude = coords.latitude;
              listing.longitude = coords.longitude;
            } catch (err) {
              console.warn(`Géocodage échoué pour : ${listing.title}`, err);
            }
          }

          return listing;
        })
      );

      console.log("📦 Listings géocodés :", data);
      setListings(data);
    } catch (error) {
      console.error("🔥 Erreur Firestore :", error);
    }
  };

  fetchListings();
}, []);


  // Vérifie si une date est dans la plage de disponibilité d'un listing
  function isAvailable(listing, start, end) {
    if (!listing.availability) return true; // Pas de données dispo = disponible
    return listing.availability.some(slot => {
      const startOk = new Date(start) >= new Date(slot.startDate);
      const endOk = new Date(end) <= new Date(slot.endDate);
      return startOk && endOk;
    });
  }

  // Au clic sur Réserver
  function handleReserve(listing) {
  const confirmReservation = window.confirm(`Veux-tu vraiment réserver : ${listing.title} ?`);
  if (confirmReservation) {
    alert(`Réservation confirmée pour : ${listing.title} (ID: ${listing.id})`);
    // Ici tu peux ajouter ta logique réelle de réservation
  } else {
    alert("Réservation annulée");
  }
}

// Filtrer les annonces selon les critères
const filteredListings = listings.filter(listing => {
  const matchesLocation = listing.location?.toLowerCase().includes(location.toLowerCase());
  const matchesPeople = listing.capacity ? listing.capacity >= people : true;
  const matchesDate = startDate && endDate ? isAvailable(listing, startDate, endDate) : true;
  const matchesCategory = category ? listing.type === category : true;

  return matchesLocation && matchesPeople && matchesDate && matchesCategory;
});

  return (
    <>
      {/* Container principal centré avec padding */}
  <div className="max-w-7xl mx-auto px-4">

        {/* Formulaire dans un bloc blanc arrondi avec marge en bas */}
        <form className="relative z-10 flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-xl shadow-lg"
  onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Ville, quartier..."
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ height: '40px', borderRadius: '20px' }}
            className="flex-1 min-w-[150px] px-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder-gray-400 text-gray-900 font-semibold text-base"
          />

          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ height: '40px', borderRadius: '20px' }}
            className="w-36 px-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder-gray-400 text-gray-900 font-semibold text-base"
            min={new Date().toISOString().split("T")[0]}
          />

          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ height: '40px', borderRadius: '20px' }}
            className="w-36 px-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder-gray-400 text-gray-900 font-semibold text-base"
            min={startDate || new Date().toISOString().split("T")[0]}
          />

          <input
            type="number"
            min="1"
            value={people}
            onChange={e => setPeople(Number(e.target.value))}
            style={{ height: '40px', borderRadius: '20px' }}
            className="w-36 px-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition placeholder-gray-400 text-gray-900 font-semibold text-base"
            placeholder="Nombre de personnes"
          />

          {/* Nouveau filtre catégorie */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-3xl px-4 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition text-gray-900 font-semibold text-base"
          >
            <option value="">Toutes catégories</option>
            <option value="Cuisine">Cuisines</option>
            <option value="Salle de bain">Salles de bain</option>
            <option value="Love Room">Love Rooms</option>
          </select>
        </form>

        {/* Map */}
        <div className="mt-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Trouvez ce que vous cherchez</h2>
          <Map listings={filteredListings} />
        </div>
        <div className="mt-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Liste des annonces</h2>
        </div>
        {/* Liste des annonces */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map(listing => (
              <Card key={listing.id} className="p-0">
  <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
    <img
      loading="lazy"
      src={listing.imageUrls?.[0] || ""}
      alt={listing.title}
      className="w-full h-48 sm:w-40 sm:h-40 object-cover rounded-lg"
    />
    <div className="flex flex-col justify-between">
      <h2 className="text-lg sm:text-xl font-semibold mb-1 truncate">
        <Link to={`/listing/${listing.id}`} className="hover:underline text-blue-600">
          {listing.title}
        </Link>
      </h2>
      <p className="text-sm text-gray-600 truncate">{listing.location}</p>
      <p className="text-sm mt-1 line-clamp-2">{listing.description}</p>
      <p className="text-lg font-bold mt-2">{listing.price} € / jour</p>
      <Link to={`/listing/${listing.id}`}>
        <Button className="mt-2 sm:w-auto">Voir détails</Button>
      </Link>
    </div>
  </CardContent>
</Card>

            ))
          ) : (
            <p className="max-w-5xl mx-auto text-center">
              Aucune cuisine trouvée correspondant à votre recherche.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
