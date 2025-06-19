import { useState } from "react";

import { NavLink } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";

import headerImg from "../../assets/questanizer_header.png";
import burgerIcon from "../../assets/burger-menu-svgrepo-com.png";
import burgerActiveIcon from "../../assets/burger-menu-active-svgrepo-com.png";

import styles from "./Navbar.module.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

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
                        <NavLink
                            to="/faq"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            FAQ
                        </NavLink>
                    </div>
                </div>

                <div className={styles.navButtons}>
                    <NavbarDropdown />
                    <button
                        className={styles.burgerToggle}
                        onClick={toggleMenu}
                    >
                        <img
                            src={!isMenuOpen ? burgerIcon : burgerActiveIcon}
                            alt="Menu"
                            className={styles.burgerIcon}
                        />
                    </button>
                    {isMenuOpen && (
                        <div className={styles.dropdownMenu}>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.navLink} ${styles.active}`
                                        : styles.navLink
                                }
                                onClick={() => setIsMenuOpen(false)}
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
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Boss Battle
                            </NavLink>
                            <NavLink
                                to="/faq"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.navLink} ${styles.active}`
                                        : styles.navLink
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                FAQ
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
