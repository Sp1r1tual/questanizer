import { useEffect, useRef, useState } from "react";
import { useTasks } from "../../hooks/tasks/useTasks";
import { useUserStats } from "../../hooks/stats/useUserStats";
import { useDispatch } from "react-redux";

import UserExperience from "./UserExperience";
import UserHealth from "./UserHealth";
import Container from "../ui/Container";
import DefeatUserModal from "../modals/DefeatUserModal";
import { resetBoss } from "../../store/boss/bossBattleSlice";

import styles from "./UserStatsView.module.css";

const UserStatsView = () => {
    const dispatch = useDispatch();
    const { experience, level, health, maxHealth } = useUserStats();
    const { checkOverdueTasks } = useTasks();

    const [isDefeated, setIsDefeated] = useState(false);
    const defeatTriggered = useRef(false);

    useEffect(() => {
        checkOverdueTasks();
        const interval = setInterval(() => {
            checkOverdueTasks();
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [checkOverdueTasks]);

    useEffect(() => {
        if (health <= 0 && !defeatTriggered.current) {
            setIsDefeated(true);
            defeatTriggered.current = true;
        }
    }, [health]);

    const handleRestart = () => {
        setIsDefeated(false);
        defeatTriggered.current = false;
        dispatch(resetBoss({ defeated: true }));
    };

    return (
        <>
            {isDefeated && <DefeatUserModal onRestart={handleRestart} />}
            <Container className={styles.statsContainer}>
                <div className={styles.statsInner}>
                    <UserExperience experience={experience} level={level} />
                    <UserHealth health={health} maxHealth={maxHealth} />
                </div>
            </Container>
        </>
    );
};

export default UserStatsView;
