import AuthForm from "../auth/AuthForm";
import styles from "./AuthModal.module.css";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const handleFormSubmit = () => {
        onLoginSuccess();
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null; // Проста умова для рендерингу

    return (
        <div className={styles.modal}>
            <div className={styles.content}>
                <AuthForm onSubmit={handleFormSubmit} onClose={handleClose} />
            </div>
        </div>
    );
};

export default AuthModal;
