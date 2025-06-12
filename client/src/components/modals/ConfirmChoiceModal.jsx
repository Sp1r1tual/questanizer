import styles from "./ConfirmChoiceModal.module.css";

const ConfirmChoiceModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                </div>
                <div className={styles.body}>
                    <p className={styles.message}>{message}</p>
                </div>
                <div className={styles.footer}>
                    <button
                        className={`${styles.button} ${styles.confirmBtn}`}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className={`${styles.button} ${styles.cancelBtn}`}
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmChoiceModal;
