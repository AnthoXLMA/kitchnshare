import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import BookingForm from "../components/ui/BookingForm";
import EditListingForm from "../components/ui/EditListingForm";
import useAuth from "../hooks/useAuth"; // adapte le chemin si nécessaire

import { useNavigate } from "react-router-dom";


export default function ListingPage() {
  const { id } = useParams(); // récupère l'id de l'URL
  const [listing, setListing] = useState(null);
  const currentUser = useAuth();

  const navigate = useNavigate();


  useEffect(() => {
    async function fetchListing() {
      const ref = doc(db, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data() });
      }
    }
    fetchListing();
  }, [id]);


  function handleReserve(startDate, endDate) {
  if (!startDate || !endDate) {
    alert("Merci de choisir une période.");
    return;
  }

  const totalPrice = calculateTotalPrice(listing.price, startDate, endDate);

  const reservationData = {
    listingId: listing.id,
    title: listing.title,
    price: listing.price,
    startDate,
    endDate,
    totalPrice,
  };

  navigate("/payment", { state: reservationData });
}


  function calculateTotalPrice(pricePerDay, start, end) {
    const startD = new Date(start);
    const endD = new Date(end);
    const diffDays = Math.ceil((endD - startD) / (1000 * 60 * 60 * 24));
    return diffDays * pricePerDay;
  }
  if (!listing) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="text-gray-700 mb-2">{listing.description}</p>
      <p className="text-lg font-semibold">{listing.price} € / jour</p>
      <p className="text-sm text-gray-600">Capacité : {listing.capacity} personnes</p>
      <p className="text-sm text-gray-600">Localisation : {listing.location}</p>
      <img
        src={listing.imageUrl || "https://unsplash.com/fr/photos/white-ceramic-bathtub-PibraWHb4h8"}
        alt={listing.title}
        className="my-4 w-full max-w-md rounded"
      />
      <EditListingForm listing={listing} />
      {currentUser?.uid === listing.userId ? (
        <Link to={`/edit/${listing.id}`} className="text-blue-600 hover:underline">
          ✏️ Modifier cette annonce
        </Link>
      ) : null}

<BookingForm listing={listing} onReserve={handleReserve} />
    </div>
  );
}

