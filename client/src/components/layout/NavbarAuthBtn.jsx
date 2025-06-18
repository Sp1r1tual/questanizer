import { useAuth } from "../../hooks/useAuth";
import { useAuthModal } from "../../context/AuthModalContext";

import authLoginImg from "../../assets/user-authentication-svgrepo-login.png";
import authLoggedInImg from "../../assets/user-authentication-svgrepo-logged-in.png";

import styles from "./NavbarAuthBtn.module.css";

const NavbarAuthBtn = () => {
    const { isAuthenticated, signOut } = useAuth();
    const { openModal } = useAuthModal();

    const handleAuthBtn = () => {
        if (isAuthenticated) {
            signOut();
        } else {
            openModal();
        }
    };

    return (
        <button className={styles.authBtn} onClick={handleAuthBtn}>
            <span className={styles.icon}>
                <img
                    className={styles.loginImg}
                    src={isAuthenticated ? authLoggedInImg : authLoginImg}
                    alt="auth-img"
                />
            </span>
            <span className={styles.loginText}>
                {isAuthenticated ? "Logout" : "Login"}
            </span>
        </button>
    );
};

export default NavbarAuthBtn;
