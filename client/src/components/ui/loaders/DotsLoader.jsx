import { useEffect, useState } from "react";

import styles from "./DotsLoader.module.css";

const DotsLoader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div className={`${styles.dotsContainer} ${visible ? styles.visible : ""}`}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
};

export { DotsLoader };
