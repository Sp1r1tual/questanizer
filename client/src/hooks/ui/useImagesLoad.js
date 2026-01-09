import { useState, useEffect } from "react";

export const useImagesLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const images = Array.from(document.images);

    if (images.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        setIsLoaded(true);
      }
    };

    const processedImages = new WeakMap();

    images.forEach((img) => {
      if (processedImages.has(img)) return;
      processedImages.set(img, true);

      if (img.complete && img.naturalHeight !== 0) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded, { once: true });
        img.addEventListener("error", checkAllLoaded, { once: true });
      }
    });

    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setIsLoaded(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  return isLoaded;
};
