import { useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
}
