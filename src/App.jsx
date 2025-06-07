import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";
// import NotFoundPage from "./pages/NotFoundPage";
import CreateListingForm from "./components/ui/CreateListingForm";
import CheckoutForm from "./components/ui/CheckoutForm";
import AuthForm from "./components/ui/AuthForm";
import useAuth from "./hooks/useAuth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ListingPage from "./pages/ListingPage";
import ListingDetail from "./pages/ListingDetail"; // Page de détail

import "./App.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function App() {
  const user = useAuth(); // <- ici, DANS le composant fonctionnel

  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Navbar /> {/* Barre de navigation */}
        <div>
          {!user ? (
            <AuthForm />
          ) : (
            <p>Bienvenue {user.email} ! Vous êtes connecté.</p>
          )}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}
            <Route path="/create" element={<CreateListingForm />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </div>
      </Elements>
    </BrowserRouter>
  );
}
