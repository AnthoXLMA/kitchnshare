import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import BookingForm from "../components/ui/BookingForm";

export default function ListingPage() {
  const { id } = useParams(); // récupère l'id de l'URL
  const [listing, setListing] = useState(null);

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
      {listing.userId === currentUser?.uid && (
        <Link to={`/edit/${listing.id}`} className="text-blue-600 hover:underline">
          ✏️ Modifier cette annonce
        </Link>
      )}
      <BookingForm listing={listing} />
    </div>
  );
}
