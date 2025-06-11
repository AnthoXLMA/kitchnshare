import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function MyListings() {
  const currentUser = useAuth();
  const [myListings, setMyListings] = useState([]);

  console.log("Utilisateur courant :", currentUser); //console LOG à retirer

  useEffect(() => {
    if (!currentUser) return;

    const fetchMyListings = async () => {
      const q = query(
        collection(db, "listings"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      console.log("Documents récupérés :", querySnapshot.docs); //console LOG à retirer

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyListings(results);
    };

    fetchMyListings();
  }, [currentUser]);

  if (!currentUser) return <p className="p-4">Chargement...</p>;
  console.log("Mes annonces :", myListings);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mes annonces</h2>
      {myListings.length === 0 ? (
        <p>Vous n'avez pas encore d'annonces.</p>
      ) : (
        myListings.map((listing) => (
          <div key={listing.id} className="mb-4 border p-4 rounded">
            <h3 className="text-xl font-semibold">{listing.title}</h3>
            <p className="text-sm text-gray-600">{listing.location}</p>
            <Link to={`/listing/${listing.id}`} className="text-blue-600 hover:underline">
              Voir l'annonce →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
