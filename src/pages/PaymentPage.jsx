import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RX5614JtXtaS6Hx0IdUkassw7shfA8qO4lABn4Z6bRHvjLzaF8QH1hbeGSuyIo9EPj55scNG3C8c4XjOeslJm4Z00Hq1bFmOv"); // 🔐 Remplace par ta clé publique Stripe

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) return <p>Aucune donnée reçue.</p>;

  const handleStripePayment = async () => {
    const stripe = await stripePromise;

    try {
      const response = await fetch(
        "https://us-central1-kitchnshare.cloudfunctions.net/createStripeCheckout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur inconnue.");
      }

      const session = await response.json();

      if (session?.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert("Erreur : session Stripe introuvable.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la tentative de paiement : " + err.message);
    }
  };


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paiement</h1>
      <p>
        <strong>Annonce :</strong> {data.title}
      </p>
      <p>
        <strong>Dates :</strong> du{" "}
        {new Date(data.startDate).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        au{" "}
        {new Date(data.endDate).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="mb-4 font-semibold">
        <strong>Total :</strong> {data.totalPrice} €
      </p>
      <button
        onClick={handleStripePayment}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        Payer maintenant
      </button>
    </div>
  );
}
