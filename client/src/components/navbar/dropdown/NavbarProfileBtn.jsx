import { useTranslation } from "react-i18next";

import profileIcon from "../../../assets/user-profile-svgrepo-com.png";

import styles from "./NavbarProfileBtn.module.css";

const NavbarProfileBtn = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <button className={styles.profileBtn} onClick={onClick}>
            <span className={styles.icon}>
                <img
                    className={styles.profileImg}
                    src={profileIcon}
                    alt="profile"
                />
            </span>
            <span className={styles.profileText}>{t("buttons.profile")}</span>
        </button>
    );
};

export { NavbarProfileBtn };
