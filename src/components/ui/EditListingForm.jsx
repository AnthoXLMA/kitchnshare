import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";


export default function EditListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuth(); // ✅ correct : currentUser est bien défini
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const fetchListing = async () => {
    if (!currentUser) return; // attendre que l'utilisateur soit défini
    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.userId !== currentUser.uid) {
        setMessage("⛔ Accès refusé");
        return;
      }
      setForm({
        ...data,
        imageUrls: Array.isArray(data.imageUrls) && data.imageUrls[0]
          ? data.imageUrls
          : data.imageUrl
            ? [data.imageUrl]
            : [""],
      });
    } else {
      setMessage("❌ Annonce introuvable.");
    }
  };
  fetchListing();
}, [id, currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.imageUrls];
    updatedImages[index] = value;
    setForm({ ...form, imageUrls: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, imageUrls: [...form.imageUrls, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "listings", id);
      await updateDoc(docRef, {
        ...form,
        price: Number(form.price),
        updatedAt: serverTimestamp(),
      });
      setMessage("✅ Annonce mise à jour !");
      navigate(`/listing/${id}`);
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("❌ Erreur lors de la mise à jour.");
    }
  };

  if (!form) return <p className="p-4">{message || "Chargement..."}</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Modifier l'annonce</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className="w-full border p-2 rounded" required />
        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Cuisine">Cuisine</option>
          <option value="Salle de bain">Salle de bain</option>
        </select>
        <div>
          <p className="font-semibold">Photos (URLs)</p>
          {form.imageUrls.map((url, index) => (
            <input key={index} value={url} onChange={(e) => handleImageChange(index, e.target.value)} placeholder={`Image ${index + 1}`} className="w-full border p-2 rounded mt-2" />
          ))}
          <div className="mt-4">
            <p className="font-semibold mb-2">Aperçu des images :</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {form.imageUrls.map((url, index) => (
                url ? (
                  <div
                    key={index}
                    className="w-full h-32 overflow-hidden rounded-lg border shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null
              ))}
            </div>
          </div>
          <button type="button" onClick={addImageField} className="mt-2 text-blue-600 hover:underline">
            ➕ Ajouter une image
          </button>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Mettre à jour</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
