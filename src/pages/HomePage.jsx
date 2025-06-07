import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Map from "../components/ui/Map";
import React, { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import BookingForm from "../components/ui/BookingForm";
import { Link } from "react-router-dom";


export default function HomePage() {
  // États pour les filtres de recherche
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(1);

  // Listings récupérés de Firestore
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "listings"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("📦 Listings reçus :", data);
        setListings(data);
      } catch (error) {
        console.error("🔥 Erreur Firestore :", error);
      }
    };

    fetchListings();
  }, []);

  // Fonction qui vérifie si une date est dans la plage de disponibilité d'un listing
  function isAvailable(listing, start, end) {
    if (!listing.availability) return true; // Pas de données dispo = disponible
    return listing.availability.some(slot => {
      return !(new Date(end) < new Date(slot.startDate) || new Date(start) > new Date(slot.endDate));
    });
  }

  // Fonction appelée au clic sur Réserver
  function handleReserve(listing) {
    alert(`Tu veux réserver : ${listing.title} (ID: ${listing.id})`);
    // Ici tu pourras faire une redirection ou ouvrir un modal
  }

  // Filtrer les annonces selon les critères
  const filteredListings = listings.filter(listing => {
    const matchesLocation = listing.location?.toLowerCase().includes(location.toLowerCase());
    const matchesPeople = listing.capacity ? listing.capacity >= people : true;
    const matchesDate = startDate && endDate ? isAvailable(listing, startDate, endDate) : true;
    return matchesLocation && matchesPeople && matchesDate;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Kitch'N'Share</h1>

      {/* Barre de recherche avancée */}
      <form
        className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
        onSubmit={(e) => e.preventDefault()} // Pas de submit/reload page
      >
        {/* Localisation */}
        <input
          type="text"
          placeholder="Ville, quartier..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded col-span-1 sm:col-span-2"
        />

        {/* Date de début */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
          min={new Date().toISOString().split("T")[0]} // Date min aujourd’hui
        />

        {/* Date de fin */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
          min={startDate || new Date().toISOString().split("T")[0]}
        />

        {/* Nombre de personnes */}
        <input
          type="number"
          min="1"
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="p-2 border rounded"
          placeholder="Nombre de personnes"
        />
      </form>

      {/* Résultats filtrés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-4">
              <h2 className="text-xl font-semibold">
                <Link to={`/listing/${listing.id}`} className="hover:underline text-blue-600">
                  {listing.title}
                </Link>
              </h2>
                <img
                  src={listing.imageUrl || "https://source.unsplash.com/400x300/?kitchen"}
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p className="text-sm text-gray-600">{listing.location}</p>
                <p className="text-sm mt-1">{listing.description}</p>
                <p className="text-lg font-bold mt-2">{listing.price} € / jour</p>
                <Button className="mt-2" onClick={() => handleReserve(listing)}>
                  Réserver
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Aucune cuisine trouvée correspondant à votre recherche.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Nos emplacements</h2>
        <Map listings={filteredListings} />
      </div>
    </div>
  );
}
