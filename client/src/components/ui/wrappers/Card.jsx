import styles from "./Card.module.css";

const Card = ({ children, size = "medium", className = "" }) => {
  return <div className={`${styles.card} ${styles[size]} ${className}`}>{children}</div>;
};

export { Card };
