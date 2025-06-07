import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

export default function UploadImage({ listingId }) {
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setSuccess(false);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!imageFile) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    const storageRef = ref(storage, `listing-images/${listingId}/${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (err) => {
        setError(err.message);
      },
      async () => {
        // Upload terminé, récupère l'URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // Mets à jour Firestore
        await updateDoc(doc(db, "listings", listingId), {
          imageUrl: downloadURL,
        });
        setSuccess(true);
        setError(null);
      }
    );
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!imageFile}>
        Upload Image
      </button>
      {uploadProgress > 0 && <p>Progression : {uploadProgress}%</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      {success && <p style={{ color: "green" }}>Image uploadée avec succès !</p>}
    </div>
  );
}
