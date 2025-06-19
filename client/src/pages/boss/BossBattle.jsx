import { useBoss } from "../../hooks/boss/useBoss";

import BossBattleStartBtn from "./BossBattleStartBtn";
import BossStats from "./BossStats";
import BossView from "./BossView";

import styles from "./BossBattle.module.css";

const BossBattle = () => {
    const { initBoss, boss } = useBoss();

    const handleStartBattle = () => {
        console.log("Starting battle with boss ID: 1");
        initBoss(1);
    };

    return (
        <div>
            {!boss.bossId && <BossBattleStartBtn onClick={handleStartBattle} />}
            {boss.bossId && (
                <div className={styles.battleContainer}>
                    <div className={styles.bossView}>
                        <BossView />
                    </div>
                    <div className={styles.bossStats}>
                        <BossStats />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BossBattle;
