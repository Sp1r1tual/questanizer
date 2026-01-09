import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useBoss } from "@/hooks/boss/useBoss";
import { useAuth } from "@/hooks/auth/useAuth";

import { BossStats } from "./BossStats";
import { BossStatsSkeleton } from "./BossStatsSkeleton";
import { BossView } from "./BossView";
import { BossBattleStartBtn } from "./BossBattleStartBtn";

import { fetchBoss } from "@/store/boss/bossBattleThunks";

import styles from "./BossBattle.module.css";

const BossBattle = () => {
  const dispatch = useDispatch();
  const [fetchAttempted, setFetchAttempted] = useState(false);

  const { boss, initBoss, loading } = useBoss();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id && !boss.bossId && !fetchAttempted) {
      dispatch(fetchBoss());
      setFetchAttempted(true);
    }
  }, [dispatch, user?.id, boss.bossId, fetchAttempted]);

  const handleStartBattle = () => {
    initBoss();
  };

  const shouldShowButton = fetchAttempted && !boss.bossId && !loading;
  const shouldShowBattle = boss.bossId && (boss.bossId || loading);

  return (
    <div>
      {shouldShowButton && <BossBattleStartBtn onClick={handleStartBattle} />}
      {shouldShowBattle && (
        <div className={styles.battleContainer}>
          <div className={styles.bossView}>
            <BossView />
          </div>
          <div className={styles.bossStats}>{loading ? <BossStatsSkeleton /> : <BossStats />}</div>
        </div>
      )}
    </div>
  );
};

export { BossBattle };
