import { useEffect } from "react";

import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children, size = "medium", closeBtn = true }) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={`${styles.modal} ${styles[size]}`} onClick={(e) => e.stopPropagation()}>
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
