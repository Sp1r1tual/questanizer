import { useState } from "react";
import AuthModal from "../modals/AuthModal";
import { useAuth } from "../../hooks/useAuth";

const AuthManager = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { signIn } = useAuth();

    const handleLoginSuccess = (credentials) => {
        signIn(credentials);
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {children({ onLoginClick: handleOpenModal })}
            <AuthModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default AuthManager;
