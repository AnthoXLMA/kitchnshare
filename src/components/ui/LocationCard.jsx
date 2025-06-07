// src/components/LocationCard.jsx
import React from "react";

export default function LocationCard({ title, image, price, description, location, type }) {
  return (
    <div className="card">
      <img src={image} alt={title} style={{ borderRadius: '0.5rem', width: '100%' }} />
      <h2 style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#333' }}>{title}</h2>
      <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>{location} — {type}</p>
      <p style={{ color: '#666', fontSize: '0.95rem' }}>{description}</p>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#007B55' }}>{price} € / jour</p>
    </div>
  );
}
