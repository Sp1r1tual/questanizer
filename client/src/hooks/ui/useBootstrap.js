import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useImagesLoaded } from "./useImagesLoad";

import { store } from "@/store/store";
import { checkAuth } from "@/store/auth/authThunks";
import { setAuthChecked } from "@/store/auth/authSlice";

const useBootstrap = () => {
  const [ready, setReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const imagesLoaded = useImagesLoaded();
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const init = async () => {
      if (token) {
        try {
          await store.dispatch(checkAuth()).unwrap();
        } catch {
          store.dispatch(setAuthChecked(true));
        }
      } else {
        store.dispatch(setAuthChecked(true));
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (isAuthChecked && imagesLoaded) {
      setFadeOut(true);
      const timer = setTimeout(() => setReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthChecked, imagesLoaded]);

  return { ready, fadeOut };
};

export { useBootstrap };
