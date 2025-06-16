import { useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useUserStats } from "../../hooks/useUserStats";

import UserExperience from "./UserExperience";
import UserHealth from "./UserHealth";
import Container from "../ui/Container";

import styles from "./UserStatsView.module.css";

const UserStatsView = () => {
    const { experience, level, health, maxHealth } = useUserStats();
    const { checkOverdueTasks } = useTasks();

    useEffect(() => {
        checkOverdueTasks();

        const interval = setInterval(() => {
            checkOverdueTasks();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [checkOverdueTasks]);

    return (
        <Container className={styles.statsContainer}>
            <div className={styles.statsInner}>
                <UserExperience experience={experience} level={level} />
                <UserHealth health={health} maxHealth={maxHealth} />
            </div>
        </Container>
    );
};

export default UserStatsView;
