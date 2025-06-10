import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
// import { useAuth } from "../../hooks/useAuth"; // selon ton setup

export default function CreateListingForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    capacity: "",
    location: "",
    type: "Cuisine",
    imageUrls: [""], // tableau pour plusieurs images
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "listings"), {
        ...form,
        price: Number(form.price),
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      });
      setMessage("✅ Annonce créée avec succès !");
      setForm({
        title: "",
        description: "",
        price: "",
        capacity: "",
        location: "",
        type: "Cuisine",
        imageUrls: [""],
      });
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("❌ Erreur lors de la création.");
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.imageUrls];
    updatedImages[index] = value;
    setForm({ ...form, imageUrls: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, imageUrls: [...form.imageUrls, ""] });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Créer une annonce</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Titre"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Prix (€ / jour)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacité (nombre de personnes)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Localisation"
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Cuisine">Cuisine</option>
          <option value="Salle de bain">Salle de bain</option>
        </select>

        {/* Champs dynamiques pour plusieurs images */}
        <div>
          <p className="font-semibold">Photos (URLs)</p>
          {form.imageUrls.map((url, index) => (
            <input
              key={index}
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder={`Image ${index + 1}`}
              className="w-full border p-2 rounded mt-2"
              required={index === 0} // la première image est obligatoire
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 text-blue-600 hover:underline"
          >
            ➕ Ajouter une image
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Publier
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
