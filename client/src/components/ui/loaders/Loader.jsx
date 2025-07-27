import styles from "./Loader.module.css";

const Loader = ({ visible = false }) => {
    if (!visible) return null;

    return (
        <div data-testid="loader" className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export { Loader };
