import useBossManager from "./useBossManager";

const useBoss = () => {
    const { boss, initBoss, resetCurrentBoss } = useBossManager();

    const handleTaskCompleted = (isDead) => {
        if (isDead) {
            resetCurrentBoss(true);
        }
    };

    return {
        boss,
        initBoss,
        handleTaskCompleted,
    };
};

export { useBossManager, useBoss };
