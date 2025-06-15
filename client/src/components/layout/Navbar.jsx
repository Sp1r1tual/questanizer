import { NavLink } from "react-router-dom";

import NavbarAuthBtn from "./NavbarAuthBtn";

import headerImg from "../../assets/questanizer_header.png";

import styles from "./Navbar.module.css";

const Navbar = ({ onLoginClick }) => {
    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo}>
                        <img
                            className={styles.mainImg}
                            src={headerImg}
                            alt="main-img"
                        />
                        <h1 className={styles.title}>Questanizer</h1>
                    </div>
                    <div className={styles.navigationButtons}>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            Task Scheduler
                        </NavLink>
                        <NavLink
                            to="/boss"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            Boss Battle
                        </NavLink>
                    </div>
                </div>

                <div className={styles.navButtons}>
                    <NavbarAuthBtn onLoginClick={onLoginClick} />
                </div>
            </nav>
        </>
    );
};

export default Navbar;
