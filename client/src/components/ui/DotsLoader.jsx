import styles from "./DotsLoader.module.css";

const DotsLoader = () => {
    return (
        <div className={styles.dotsContainer}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
        </div>
    );
};

export default DotsLoader;
