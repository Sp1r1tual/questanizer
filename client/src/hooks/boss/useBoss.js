import { useBossManager } from "./useBossManager";
import { useBossCombat } from "./useBossCombat";

const useBoss = () => {
    const { boss, initBoss, resetCurrentBoss } = useBossManager();
    const {
        handleTaskCompleted: handleTaskCompletedInternal,
        handleBossVictory,
    } = useBossCombat();

    const handleTaskCompleted = (difficulty, hasDeadline) => {
        const result = handleTaskCompletedInternal(difficulty, hasDeadline);

        if (result.isDead) {
            handleBossVictory();
            resetCurrentBoss(true);
        }
    };

    return {
        boss,
        initBoss,
        handleTaskCompleted,
    };
};

export { useBossManager, useBossCombat, useBoss };
