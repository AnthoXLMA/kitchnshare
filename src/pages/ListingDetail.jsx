import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
      } else {
        setListing(null);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!listing) return <p>Listing introuvable.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <img
        src={listing.imageUrl || "https://source.unsplash.com/600x400/?kitchen,bathroom"}
        alt={listing.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="mb-2"><strong>Type :</strong> {listing.type}</p>
      <p className="mb-2"><strong>Localisation :</strong> {listing.location}</p>
      <p className="mb-2"><strong>Description :</strong> {listing.description}</p>
      <p className="mb-2"><strong>Prix :</strong> {listing.price} € / jour</p>
      {/* Tu peux ajouter d’autres infos ici : capacité, disponibilité, etc. */}
    </div>
  );
}
