import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";

export const useAuth = () => {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const isLogin = user ? true : false;

  return {
    user,
    isLogin,
  };
};

