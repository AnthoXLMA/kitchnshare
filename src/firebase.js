import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqa9B1xZHCP3lXorgn5Kk_0ljt0aAcLC4",
  authDomain: "kitchnshare.firebaseapp.com",
  projectId: "kitchnshare",
  storageBucket: "kitchnshare.appspot.com",  // <-- correction ici
  messagingSenderId: "26857690872",
  appId: "1:26857690872:web:1d3b227069eb596142cd0d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function addAvailabilityToListings() {
  try {
    const listingsCol = collection(db, "listings");
    const snapshot = await getDocs(listingsCol);

    for (const docSnap of snapshot.docs) {
      const listingData = docSnap.data();

      if (listingData.availability) {
        console.log(`Listing ${docSnap.id} a déjà availability, skip.`);
        continue;
      }

      const availability = [
        { startDate: "2025-06-10", endDate: "2025-06-15" },
        { startDate: "2025-06-20", endDate: "2025-07-01" }
      ];

      await updateDoc(doc(db, "listings", docSnap.id), { availability });
      console.log(`Mise à jour de ${docSnap.id} avec availability`);
    }

    console.log("Mise à jour terminée !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
  }
}

export async function updateImageUrls() {
  try {
    const listingsCol = collection(db, "listings");
    const snapshot = await getDocs(listingsCol);

    for (const docSnap of snapshot.docs) {
      const imageUrl = "https://source.unsplash.com/400x300/?kitchen";

      await updateDoc(doc(db, "listings", docSnap.id), { imageUrl });
      console.log(`Updated imageUrl for listing ${docSnap.id}`);
    }

    console.log("Mise à jour des images terminée");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des images:", error);
  }
}
