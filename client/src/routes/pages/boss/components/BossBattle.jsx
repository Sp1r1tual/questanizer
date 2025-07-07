import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useBoss from "../../../../hooks/boss/useBoss";
import useAuth from "../../../../hooks/auth/useAuth";

import BossStats from "./BossStats";
import BossView from "./BossView";
import BossBattleStartBtn from "./BossBattleStartBtn";
import { fetchBoss } from "../../../../store/boss/bossBattleSlice";

import styles from "./BossBattle.module.css";

const BossBattle = () => {
    const dispatch = useDispatch();
    const { boss, initBoss } = useBoss();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchBoss());
        }
    }, [dispatch, user]);

    const handleStartBattle = () => {
        initBoss();
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
