import styles from "./FormErrors.module.css";

const FormErrors = ({ errors = [], t }) => {
  if (!errors.length) return null;

  return (
    <div className={styles.error} role="alert">
      <p>{errors.map((error) => t(error)).join(", ")}</p>
    </div>
  );
};

export { FormErrors };
