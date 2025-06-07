import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";


export default function BookingForm({ listing }) {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [message, setMessage] = useState("");
  const user = useAuth();

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleBooking = async () => {
    if (!user) {
      setMessage("❌ Vous devez être connecté pour réserver.");
      return;
    }
    try {
      await addDoc(collection(db, "reservations"), {
        listingId: listing.id,
        userId: user.uid,
        startDate: Timestamp.fromDate(selectionRange.startDate),
        endDate: Timestamp.fromDate(selectionRange.endDate),
        createdAt: serverTimestamp(),
        status: "confirmed",
      });
      setMessage("✅ Réservation enregistrée ! Un e‑mail de confirmation vous sera envoyé.");
    } catch (error) {
      console.error("Erreur réservation :", error);
      setMessage("❌ Erreur lors de la réservation.");
    }
  };

  return (
    <div className="border p-4 rounded my-4">
      <h3 className="text-xl font-semibold mb-2">Réserver cette annonce</h3>
      <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        minDate={new Date()}
      />
      <button
        onClick={handleBooking}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Réserver
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
