import { useLanguageChange } from "@/hooks/user/useLanguageChange";

import styles from "./changeLanguageBtn.module.css";

const ChangeLanguageBtn = () => {
    const { currentLang, languages, changeLanguage, loading } =
        useLanguageChange();

    const handleChange = (event) => {
        const selectedLang = event.target.value;

        if (selectedLang !== currentLang) {
            changeLanguage(selectedLang);
        }
    };

    return (
        <div className={styles.languageChange}>
            <select
                id="language-select"
                value={currentLang}
                onChange={handleChange}
                className={styles.select}
                disabled={loading}
            >
                {languages.map(({ code, label }) => (
                    <option key={code} value={code}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export { ChangeLanguageBtn };
