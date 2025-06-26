import styles from "./Loader.module.css";

const Loader = ({ visible = false }) => {
    if (!visible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default Loader;
