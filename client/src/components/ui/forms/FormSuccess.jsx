import styles from "./FormSuccess.module.css";

const FormSuccess = ({ message, t }) => {
  if (!message) return null;

  return (
    <div className={styles.success} role="alert">
      <p>{t(message)}</p>
    </div>
  );
};

export { FormSuccess };
