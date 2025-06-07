// seedFirestore.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 1. Configuration Firebase (copie la config de ton projet Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDqa9B1xZHCP3lXorgn5Kk_0ljt0aAcLC4",
  authDomain: "kitchnshare.firebaseapp.com",
  projectId: "kitchnshare",
  storageBucket: "kitchnshare.appspot.com",  // <-- correction ici
  messagingSenderId: "26857690872",
  appId: "1:26857690872:web:1d3b227069eb596142cd0d"
};

// 2. Initialiser Firebase et Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Tes données à insérer (seed)
const listingsSeed = [
  {
    title: "Cuisine à la Française",
    description: "Cuisine équipée avec tout le nécessaire pour cuisiner.",
    price: 50,
    location: "Strasbourg",
    type: "Cuisine",
    capacity: 4,
    imageUrl: "https://source.unsplash.com/400x300/?kitchen",
    availability: [
      { startDate: "2025-07-01", endDate: "2025-07-15" },
      { startDate: "2025-08-01", endDate: "2025-08-31" }
    ]
  },
  {
    title: "Salle de bain cosy à Lyon",
    description: "Salle de bain avec grande baignoire et douche moderne.",
    price: 30,
    location: "Lyon, centre",
    type: "Salle de bain",
    capacity: 2,
    imageUrl: "https://source.unsplash.com/400x300/?bathroom",
    availability: [
      { startDate: "2025-07-10", endDate: "2025-07-20" }
    ]
  },
  // Ajoute autant que tu veux
];

// 4. Fonction pour seed les données
async function seed() {
  try {
    for (const listing of listingsSeed) {
      const docRef = await addDoc(collection(db, "listings"), listing);
      console.log(`Ajouté ${listing.title} avec ID : ${docRef.id}`);
    }
    console.log("Seed terminé !");
  } catch (e) {
    console.error("Erreur lors du seed :", e);
  }
}

// 5. Lancer le seed
seed();
