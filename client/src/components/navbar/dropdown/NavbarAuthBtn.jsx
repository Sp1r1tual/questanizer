import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/auth/useAuth";
import { ConfirmChoiceModal } from "@/components/ui/modals/ConfirmChoiceModal";

import authLoginImg from "@/assets/user-authentication-svgrepo-login.png";
import authLoggedInImg from "@/assets/user-authentication-svgrepo-logged-in.png";

import styles from "./NavbarAuthBtn.module.css";

const NavbarAuthBtn = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, signOut } = useAuth();

  const { t } = useTranslation();

  const handleAuthBtn = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      navigate("/authentication");
    }
  };

  const handleConfirmLogout = () => {
    signOut();
    setIsModalOpen(false);
  };

  return (
    <>
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

      <ConfirmChoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title={t("buttons.logout")}
        message={t("support.confirmLogout") || "Are you sure you want to logout?"}
      />
    </>
  );
};

export { NavbarAuthBtn };
