import { useTranslation } from "react-i18next";

import profileIcon from "../../../assets/friends-svgrepo-com.png";

import styles from "./NavbarFriendsBtn.module.css";

const NavbarFriendsBtn = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <button className={styles.friendsBtn} onClick={onClick}>
            <span className={styles.icon}>
                <img
                    className={styles.friendsImg}
                    src={profileIcon}
                    alt="friends"
                />
            </span>
            <span className={styles.friendsText}>{t("buttons.friends")}</span>
        </button>
    );
};

export { NavbarFriendsBtn };
