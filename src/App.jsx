import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";
// import NotFoundPage from "./pages/NotFoundPage";
import CreateListingForm from "./components/ui/CreateListingForm";
import CheckoutForm from "./components/ui/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./App.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Navbar /> {/* Barre de navigation */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*<Route path="/about" element={<AboutPage />} />*/}
          <Route path="/create" element={<CreateListingForm />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          {/*<Route path="*" element={<NotFoundPage />} />*/}
        </Routes>
      </Elements>
    </BrowserRouter>
  );
}
