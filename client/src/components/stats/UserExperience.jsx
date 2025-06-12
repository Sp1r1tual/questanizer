import styles from "./UserExperience.module.css";

const UserExperience = ({ experience, level }) => {
    return (
        <div className={styles.experience}>
            <div className={styles.row}>
                <span className={styles.label}>
                    <span className={styles.icon}>⭐</span>
                    Level {level}, XP {experience}/{level * 100}
                </span>
                <progress
                    className={styles.progress}
                    value={experience}
                    max={level * 100}
                />
            </div>
        </div>
    );
};

export default UserExperience;
