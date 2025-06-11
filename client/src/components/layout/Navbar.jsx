import NavbarAuthBtn from "./NavbarAuthBtn";

import headerImg from "../../assets/questanizer_header.png";

import styles from "./Navbar.module.css";

const Navbar = ({ onLoginClick }) => {
    return (
        <>
            <nav className={styles.navbar}>
                <div className="logoContainer">
                    <div className={styles.logo}>
                        <img
                            className={styles.mainImg}
                            src={headerImg}
                            alt="main-img"
                        />
                        <h1 className={styles.title}>Questanizer</h1>
                    </div>
                </div>
                <div className="navButtons">
                    <NavbarAuthBtn onLoginClick={onLoginClick} />
                </div>
            </nav>
        </>
    );
};

export default Navbar;
