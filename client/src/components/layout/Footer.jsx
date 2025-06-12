import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.copyright}>
                    © {new Date().getFullYear()}{" "}
                    <a href="/" className={styles.link}>
                        Questanizer
                    </a>
                </div>

                <div className={styles.linkGroup}>
                    <a
                        href="https://github.com/Sp1r1tual/questanizer-pet-project"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        About
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        Licensing
                    </a>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
