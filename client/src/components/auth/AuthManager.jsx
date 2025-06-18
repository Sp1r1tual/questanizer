import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { AuthModalContext } from "../../context/AuthModalContext";
import AuthModal from "../modals/AuthModal";

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
        <AuthModalContext.Provider value={{ openModal: handleOpenModal }}>
            {children}
            <AuthModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </AuthModalContext.Provider>
    );
};

export default AuthManager;
