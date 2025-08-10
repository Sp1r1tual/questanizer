import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";

import authLoginImg from "../../../assets/user-authentication-svgrepo-login.png";
import authLoggedInImg from "../../../assets/user-authentication-svgrepo-logged-in.png";

import styles from "./NavbarAuthBtn.module.css";

const NavbarAuthBtn = () => {
    const navigate = useNavigate();
    const { isAuthenticated, signOut } = useAuth();
    const { t } = useTranslation();

    const handleAuthBtn = () => {
        if (isAuthenticated) {
            signOut();
        } else {
            navigate("/authentication");
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
                {isAuthenticated ? t("buttons.logout") : t("buttons.login")}
            </span>
        </button>
    );
};

export { NavbarAuthBtn };
