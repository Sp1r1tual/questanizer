import { useState, useRef, useEffect } from "react";

import { UserProfileModal } from "../../profile/modals/UserProfileModal";
import { UserFriendsModal } from "../../friends/modals/UserFriendsModal";
import { SettingsModal } from "../../settings/modals/SettingsModal";
import { NavbarProfileBtn } from "./NavbarProfileBtn";
import { NavbarAuthBtn } from "./NavbarAuthBtn";
import { SettingsBtn } from "./SettingsBtn";
import { NavbarFriendsBtn } from "./NavbarFriendsBtn";

import dropdownIcon from "@/assets/nav-dropdown-svgrepo-com.png";
import dropdownActiveIcon from "@/assets/nav-dropdown-active-svgrepo-com.png";

import styles from "./NavbarDropdown.module.css";

const NavbarDropdown = ({ closeMenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen((prev) => {
            const newState = !prev;

            if (newState && closeMenu) closeMenu();

            return newState;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div
                className={`${styles.dropdownContainer} ${
                    isOpen ? styles.open : ""
                }`}
                ref={dropdownRef}
            >
                <button
                    className={styles.dropdownToggle}
                    onClick={toggleDropdown}
                >
                    <img
                        src={isOpen ? dropdownActiveIcon : dropdownIcon}
                        alt="Dropdown"
                    />
                </button>

                {isOpen && (
                    <div className={styles.dropdownMenu}>
                        <NavbarProfileBtn
                            onClick={() => {
                                setShowProfileModal(true);
                                setIsOpen(false);
                            }}
                        />
                        <NavbarFriendsBtn
                            onClick={() => {
                                setIsOpen(false);
                                setShowFriendsModal(true);
                            }}
                        />
                        <SettingsBtn
                            onClick={() => {
                                setIsOpen(false);
                                setShowSettingsModal(true);
                            }}
                        />
                        <NavbarAuthBtn />
                    </div>
                )}
            </div>

            {showProfileModal && (
                <UserProfileModal onClose={() => setShowProfileModal(false)} />
            )}

            {showFriendsModal && (
                <UserFriendsModal onClose={() => setShowFriendsModal(false)} />
            )}

            {showSettingsModal && (
                <SettingsModal onClose={() => setShowSettingsModal(false)} />
            )}
        </>
    );
};

export { NavbarDropdown };
