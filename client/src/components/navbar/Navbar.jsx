import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { NavbarDropdown } from "./dropdown/NavbarDropdown";

import headerImg from "@/assets/questanizer_header.png";
import burgerIcon from "@/assets/burger-menu-svgrepo-com.png";
import burgerActiveIcon from "@/assets/burger-menu-active-svgrepo-com.png";

import styles from "./Navbar.module.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { t } = useTranslation();

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => setIsMenuOpen(false);

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
                            {t("navbar.taskScheduler")}
                        </NavLink>
                        <NavLink
                            to="/boss"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            {t("navbar.bossBattle")}
                        </NavLink>
                        <NavLink
                            to="/market"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("navbar.market")}
                        </NavLink>
                        <NavLink
                            to="/inventory"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("navbar.inventory")}
                        </NavLink>
                        <NavLink
                            to="/faq"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navLink} ${styles.active}`
                                    : styles.navLink
                            }
                        >
                            {t("navbar.faq")}
                        </NavLink>
                    </div>
                </div>

                <div className={styles.navButtons}>
                    <NavbarDropdown closeMenu={closeMenu} />
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
                        <div
                            className={styles.dropdownMenu}
                            data-testid="dropdown-menu"
                        >
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.navLink} ${styles.active}`
                                        : styles.navLink
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t("navbar.taskScheduler")}
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
                                {t("navbar.bossBattle")}
                            </NavLink>
                            <NavLink
                                to="/market"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.navLink} ${styles.active}`
                                        : styles.navLink
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t("navbar.market")}
                            </NavLink>
                            <NavLink
                                to="/inventory"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.navLink} ${styles.active}`
                                        : styles.navLink
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t("navbar.inventory")}
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
                                {t("navbar.faq")}
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export { Navbar };
