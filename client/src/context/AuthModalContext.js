import { createContext, useContext } from "react";

const AuthModalContext = createContext({
    openModal: () => {},
});

const useAuthModal = () => useContext(AuthModalContext);

export { AuthModalContext, useAuthModal };
