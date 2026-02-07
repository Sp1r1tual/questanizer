import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import styles from "./BossView.module.css";

const BossView = () => {
  const [loaded, setLoaded] = useState(false);

  const boss = useSelector((state) => state.bossBattle);

  useEffect(() => {
    setLoaded(false);
  }, [boss.bossImg]);

  return (
    <section className={styles.bossView}>
      <div className={styles.imageWrapper}>
        {!loaded && <div className={styles.skeleton} />}
        <img
          src={boss.bossImg}
          alt={boss.bossName}
          className={`${styles.bossImage} ${loaded ? styles.loaded : ""}`}
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </section>
  );
};

export { BossView };
