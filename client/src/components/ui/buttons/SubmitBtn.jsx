import styles from "./SubmitBtn.module.css";

const SubmitBtn = ({
  isLoading,
  loadingText,
  children,
  cooldown = 0,
  cooldownTemplate,
  disabled = false,
  className = "",
  ...props
}) => {
  const getButtonText = () => {
    if (isLoading && loadingText) {
      return loadingText;
    }

    if (cooldown > 0 && cooldownTemplate) {
      return cooldownTemplate.replace("{seconds}", cooldown);
    }

    return children;
  };

  return (
    <button
      type="submit"
      className={`${styles.submitButton} ${className}`}
      disabled={isLoading || cooldown > 0 || disabled}
      {...props}
    >
      {getButtonText()}
    </button>
  );
};

export { SubmitBtn };
