import { useState, useRef, useEffect } from "react";

import { NavbarProfileBtn } from "./NavbarProfileBtn";
import { NavbarAuthBtn } from "./NavbarAuthBtn";
import { NavbarFriendsBtn } from "./NavbarFriendsBtn";
import { UserProfileModal } from "../../modals/profiles/UserProfileModal";
import { UserFriendsModal } from "../../modals/friends/UserFriendsModal";

import dropdownIcon from "../../../assets/nav-dropdown-svgrepo-com.png";
import dropdownActiveIcon from "../../../assets/nav-dropdown-active-svgrepo-com.png";

import styles from "./NavbarDropdown.module.css";

const NavbarDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
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
        </>
    );
};

export { NavbarDropdown };
