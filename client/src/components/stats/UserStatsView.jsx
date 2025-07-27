import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useUserStats } from "../../hooks/stats/useUserStats";
import { useAuth } from "../../hooks/auth/useAuth";

import { UserExperience } from "./UserExperience";
import { UserHealth } from "./UserHealth";
import { Container } from "../ui/Container";
import { DefeatUserModal } from "../modals/DefeatUserModal";
import { resetBoss } from "../../store/boss/bossBattleSlice";
import { fetchStats } from "../../store/stats/userStatsThunks";

import styles from "./UserStatsView.module.css";

const UserStatsView = () => {
    const dispatch = useDispatch();
    const { experience, level, health, maxHealth } = useUserStats();
    const [isDefeated, setIsDefeated] = useState(false);
    const defeatTriggered = useRef(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchStats());
        }
    }, [user, dispatch]);

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

export { UserStatsView };
