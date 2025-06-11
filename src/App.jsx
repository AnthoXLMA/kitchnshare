import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import HomePage from "./pages/HomePage";
import CreateListingForm from "./components/ui/CreateListingForm";
import CheckoutForm from "./components/ui/CheckoutForm";
import AuthForm from "./components/ui/AuthForm";
import useAuth from "./hooks/useAuth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ListingPage from "./pages/ListingPage";
import EditListingForm from "./components/ui/EditListingForm";
import MyListings from "./pages/MyListings";
import PaymentPage from "./pages/PaymentPage"; // adapte le chemin


import "./App.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function App() {
  const user = useAuth(); // vérifie si ça retourne bien `user`

  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Navbar />
        <div className="p-4">
          {!user ? (
            <AuthForm />
          ) : (
            <p className="mb-4">Bienvenue {user.email} ! Vous êtes connecté.</p>
          )}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/create" element={<CreateListingForm />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/edit/:id" element={<EditListingForm />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/payment" element={<PaymentPage />} />

            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </div>
      </Elements>
    </BrowserRouter>
  );
}
