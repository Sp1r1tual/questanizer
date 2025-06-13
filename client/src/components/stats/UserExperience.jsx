import styles from "./UserExperience.module.css";

const UserExperience = ({ experience, level }) => {
    const expToNext = level * 100;
    const progressPercent = Math.round((experience / expToNext) * 100);

    return (
        <div className={styles.container}>
            <div className={styles.icon}>⭐</div>
            <div className={styles.info}>
                <div className={styles.text}>
                    Level {level}, XP: {experience}/{expToNext}
                </div>
                <div className={styles.bar}>
                    <div
                        className={styles.fill}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserExperience;
