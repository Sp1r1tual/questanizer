import profileIcon from "../../../assets/friends-svgrepo-com.png";

import styles from "./NavbarFriendsBtn.module.css";

const NavbarFriendsBtn = ({ onClick }) => {
    return (
        <button className={styles.friendsBtn} onClick={onClick}>
            <span className={styles.icon}>
                <img
                    className={styles.friendsImg}
                    src={profileIcon}
                    alt="profile"
                />
            </span>
            <span className={styles.friendsText}>Friends</span>
        </button>
    );
};

export { NavbarFriendsBtn };
