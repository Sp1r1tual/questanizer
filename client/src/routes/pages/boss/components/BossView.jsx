import { useSelector } from "react-redux";

import styles from "./BossView.module.css";

const BossView = () => {
    const boss = useSelector((state) => state.bossBattle);

    if (!boss.bossId)
        return (
            <section className={styles.placeholder}>
                Boss appears here...
            </section>
        );

    return (
        <section className={styles.bossView}>
            <img
                src={boss.bossImg}
                className={styles.bossImage}
                alt={boss.bossName}
            />
        </section>
    );
};

export default BossView;
