import profileIcon from "../../assets/user-profile-svgrepo-com.png";

import styles from "./NavbarProfileBtn.module.css";

const NavbarProfileBtn = ({ onClick }) => {
    return (
        <button className={styles.profileBtn} onClick={onClick}>
            <span className={styles.icon}>
                <img
                    className={styles.profileImg}
                    src={profileIcon}
                    alt="profile"
                />
            </span>
            <span className={styles.profileText}>Profile</span>
        </button>
    );
};

export default NavbarProfileBtn;
