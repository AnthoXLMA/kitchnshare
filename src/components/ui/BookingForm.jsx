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
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";

const functions = getFunctions(getApp());

export default function BookingForm({ listing, onReserve }) {
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

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const getDisabledDates = () => {
    const dateSet = new Set();
    reservedRanges.forEach(({ start, end }) => {
      let current = new Date(start);
      current.setHours(0, 0, 0, 0);
      const last = new Date(end);
      last.setHours(0, 0, 0, 0);
      while (current <= last) {
        dateSet.add(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    return Array.from(dateSet).map(dateStr => new Date(dateStr));
  };

  const renderDayContent = (day) => {
    const disabledDates = getDisabledDates().map((d) => d.toDateString());
    const isDisabled = disabledDates.includes(day.toDateString());

    return (
      <div
        className="w-full h-full flex items-center justify-center rounded-full"
        style={
          isDisabled
            ? { backgroundColor: "#FF00AA", color: "white", fontWeight: "bold" }
            : {}
        }
      >
        {day.getDate()}
      </div>
    );
  };

  return (
    <div className="border p-4 rounded my-4">
      <h3 className="text-xl font-semibold mb-2">Réserver cette annonce</h3>
      <DateRange
        ranges={[selectionRange]}
        onChange={handleSelect}
        minDate={new Date()}
        disabledDates={getDisabledDates()}
        dayContentRenderer={renderDayContent}
      />
      <button
        onClick={() => onReserve(selectionRange.startDate, selectionRange.endDate)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Réserver
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
