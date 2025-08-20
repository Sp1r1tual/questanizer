import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children, size = "medium", closeBtn = true }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modal} ${styles[size]}`}>
        {closeBtn && (
          <button className={styles.close} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export { Modal };
