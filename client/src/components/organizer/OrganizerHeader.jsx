import { useTranslation } from "react-i18next";

import headerImg from "@/assets/questanizer_header.png";

import styles from "./OrganizerHeader.module.css";

const OrganizerHeader = () => {
    const { t } = useTranslation();

    return (
        <h2 className={styles.h2}>
            <img className={styles.mainImg} src={headerImg} alt="img" />
            {t("organizer.organizerHeader")}
        </h2>
    );
};

export { OrganizerHeader };
