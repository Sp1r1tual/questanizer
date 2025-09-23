import { useState, useEffect } from "react";

const useImagesLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const images = Array.from(document.images);

    if (images.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount >= images.length) {
        setIsLoaded(true);
      }
    };

    images.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        handleLoad();
      } else {
        img.addEventListener("load", handleLoad, { once: true });
        img.addEventListener("error", handleLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleLoad);
      });
    };
  }, []);

  return isLoaded;
};

export { useImagesLoaded };
