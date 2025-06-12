import { useUserStats } from "../../hooks/useUserStats";

import Container from "../ui/Container";
import UserExperience from "../stats/UserExperience";
import UserHealth from "../stats/UserHealth";

import styles from "./UserStatsPanel.module.css";

const UserStatsPanel = () => {
    const { experience, level, health, maxHealth } = useUserStats();

    return (
        <Container className={styles.statsContainer}>
            <div className={styles.statsInner}>
                <UserExperience experience={experience} level={level} />
                <UserHealth health={health} maxHealth={maxHealth} />
            </div>
        </Container>
    );
};

export default UserStatsPanel;
