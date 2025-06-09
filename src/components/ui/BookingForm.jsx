import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import emailjs from "emailjs-com";

export default function BookingForm({ listing }) {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [message, setMessage] = useState("");
  const [reservedRanges, setReservedRanges] = useState([]);
  const user = useAuth();

  useEffect(() => {
    async function fetchReservations() {
      if (!listing?.id) return;

      const q = query(
        collection(db, "reservations"),
        where("listingId", "==", listing.id),
        where("status", "==", "confirmed")
      );

      const snapshot = await getDocs(q);
      const ranges = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          start: data.startDate.toDate(),
          end: data.endDate.toDate(),
        };
      });
      setReservedRanges(ranges);
    }

    fetchReservations();
  }, [listing?.id]);

  // Générer la liste des dates désactivées
  const getDisabledDates = () => {
    const dates = [];
    reservedRanges.forEach(({ start, end }) => {
      let current = new Date(start);
      // On met l'heure à 0 pour éviter les problèmes de comparaison
      current.setHours(0, 0, 0, 0);
      const last = new Date(end);
      last.setHours(0, 0, 0, 0);
      while (current <= last) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleBooking = async () => {
    if (!user) {
      setMessage("❌ Vous devez être connecté pour réserver.");
      return;
    }

    // Vérification de chevauchement côté client
    const overlap = reservedRanges.some(({ start, end }) => {
      return (
        selectionRange.startDate <= end &&
        selectionRange.endDate >= start
      );
    });

    if (overlap) {
      setMessage("❌ Ces dates sont déjà réservées. Veuillez en choisir d'autres.");
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

      await emailjs.send(
        "service_o8hrryp",     // <-- Remplace par ton service ID
        "template_7u1g3t8",    // <-- Remplace par ton template ID
        {
          to_name: user.displayName || "Utilisateur",
          to_email: user.email,
          listing_title: listing.title,
          start_date: selectionRange.startDate.toLocaleDateString(),
          end_date: selectionRange.endDate.toLocaleDateString(),
        },
        "oXEaqZ2fuolWa_SnH"         // <-- Remplace par ta clé publique EmailJS
      );

      setMessage("✅ Réservation enregistrée ! Un e‑mail de confirmation vous a été envoyé.");
    } catch (error) {
      console.error("Erreur réservation ou e‑mail :", error);
      setMessage("❌ Erreur lors de la réservation ou de l’envoi de l’e‑mail.");
    }
  };

  return (
    <div className="border p-4 rounded my-4">
      <h3 className="text-xl font-semibold mb-2">Réserver cette annonce</h3>
      <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        minDate={new Date()}
        disabledDates={getDisabledDates()}
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
