import { useSelector } from "react-redux";

import styles from "./BossView.module.css";

const BossView = () => {
    const boss = useSelector((state) => state.bossBattle);

    if (!boss.bossId)
        return (
            <section className={styles.placeholder}>
                🧟 Boss appears here...
            </section>
        );

    return (
        <section className={styles.bossView}>
            <img
                src={boss.bossImg}
                alt={boss.bossName}
                className={styles.bossImage}
            />
        </section>
    );
};

export default BossView;
