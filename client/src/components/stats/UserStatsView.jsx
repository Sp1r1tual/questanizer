import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useAuth } from "@/hooks/auth/useAuth";

import { UserExperience } from "./UserExperience";
import { UserHealth } from "./UserHealth";
import { UserGold } from "./UserGold";
import { DefeatUserModal } from "./modals/DefeatUserModal";

import { resetBoss } from "@/store/boss/bossBattleSlice";

import { fetchStats } from "@/store/stats/userStatsThunks";

import styles from "./UserStatsView.module.css";

const UserStatsView = () => {
    const dispatch = useDispatch();

    const [isDefeated, setIsDefeated] = useState(false);

    const defeatTriggered = useRef(false);

    const { experience, level, health, maxHealth, gold, isLoaded } =
        useSelector((state) => state.stats);

    const { user } = useAuth();

    useEffect(() => {
        if (user?.id && !isLoaded) {
            dispatch(fetchStats());
        }
    }, [user, isLoaded, dispatch]);

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

            <div className={styles.statsInner}>
                <UserExperience experience={experience} level={level} />
                <UserHealth health={health} maxHealth={maxHealth} />
                <UserGold gold={gold} />
            </div>
        </>
    );
};

export { UserStatsView };
