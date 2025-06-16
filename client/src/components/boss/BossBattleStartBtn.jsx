import { useBossBattle } from "../../hooks/useBossBattle";

const BossBattleStartBtn = () => {
    const { initBoss } = useBossBattle();

    return <button onClick={() => initBoss(1)}>Start a boss fight</button>;
};

export default BossBattleStartBtn;
