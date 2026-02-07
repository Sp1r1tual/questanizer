import { useEffect } from "react";

import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children, size = "medium", closeBtn = true }) => {
  useEffect(() => {
    if (!isOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
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
