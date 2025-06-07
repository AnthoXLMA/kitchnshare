import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const response = await fetch("http://localhost:4242/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // 10€ en centimes
      });

      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (payload.error) {
        setError(`Erreur: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setSuccess(true);
        setProcessing(false);
      }
    } catch (error) {
      setError(`Erreur serveur: ${error.message}`);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? "Traitement..." : "Payer"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Paiement réussi !</div>}
    </form>
  );
}
