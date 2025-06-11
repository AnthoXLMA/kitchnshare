import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Map from "../components/ui/Map";
import React, { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

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
    alert(`Tu veux réserver : ${listing.title} (ID: ${listing.id})`);
  }

  // Filtrer les annonces selon les critères
  const filteredListings = listings.filter(listing => {
    const matchesLocation = listing.location?.toLowerCase().includes(location.toLowerCase());
    const matchesPeople = listing.capacity ? listing.capacity >= people : true;
    const matchesDate = startDate && endDate ? isAvailable(listing, startDate, endDate) : true;
    const matchesCategory = category ? listing.category === category : true; // filtre catégorie

    return matchesLocation && matchesPeople && matchesDate && matchesCategory;
  });

  return (
    <>
      {/* Container principal centré avec padding */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Formulaire dans un bloc blanc arrondi avec marge en bas */}
        <form className="flex flex-wrap gap-4" onSubmit={e => e.preventDefault()}>
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
            <option value="bathroom">Salles de bains</option>
            <option value="cuisine">Cuisines</option>
            <option value="love_room">Love room</option>
          </select>
        </form>

        {/* Liste des annonces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mt-8">
          {filteredListings.length > 0 ? (
            filteredListings.map(listing => (
              <Card key={listing.id} className="p-0">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                  <img
                    loading="lazy"
                    src={listing.imageUrls?.[0] || ""}
                    alt={listing.title}
                    className="w-full sm:w-40 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between">
                    <h2 className="text-xl font-semibold mb-1">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="hover:underline text-blue-600"
                      >
                        {listing.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600">{listing.location}</p>
                    <p className="text-sm mt-1">{listing.description}</p>
                    <p className="text-lg font-bold mt-2">{listing.price} € / jour</p>
                    <Button className="mt-2 self-start" onClick={() => handleReserve(listing)}>
                      Réserver
                    </Button>
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

        {/* Map */}
        <div className="mt-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Nos emplacements</h2>
          <Map listings={filteredListings} />
        </div>
      </div>
    </>
  );
}
