import { useTranslation } from "react-i18next";

import { CONTACTS } from "../../data/contacts";

import styles from "./Footer.module.css";

const Footer = () => {
  const { t } = useTranslation();

  const mail = CONTACTS.email;

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
            {t("footer.about")}
          </a>
          <a href={`mailto:${mail}`} className={styles.link}>
            {t("footer.contact")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
