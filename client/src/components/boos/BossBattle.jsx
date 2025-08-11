import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useBoss } from "@/hooks/boss/useBoss";
import { useAuth } from "@/hooks/auth/useAuth";

import { Loader } from "../ui/loaders/Loader";
import { BossStats } from "./BossStats";
import { BossView } from "./BossView";
import { BossBattleStartBtn } from "./BossBattleStartBtn";

import { fetchBoss } from "@/store/boss/bossBattleThunks";

import styles from "./BossBattle.module.css";

const BossBattle = () => {
    const dispatch = useDispatch();

    const { boss, initBoss, loading } = useBoss();

    const { user } = useAuth();

    useEffect(() => {
        if (user?.id && !boss.bossId) {
            dispatch(fetchBoss());
        }
    }, [dispatch, user, boss.bossId]);

    const handleStartBattle = () => {
        initBoss();
    };

    return (
        <div>
            <Loader visible={loading} />
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

export { BossBattle };
