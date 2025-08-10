import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { changeUserLanguage } from "../../store/user/localizationThunks";
import { setLanguage } from "../../store/user/localizationSlice";
import { LANGUAGES } from "../../data/languages";

const useLanguageChange = () => {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    const currentLang =
        useSelector((state) => state.localization.language) ||
        i18n.language ||
        "en";

    const loading = useSelector((state) => state.localization.loading);

    const changeLanguage = (languageCode) => {
        if (languageCode === currentLang) return;

        i18n.changeLanguage(languageCode);

        const token = localStorage.getItem("token");

        if (token) {
            dispatch(changeUserLanguage(languageCode));
            return;
        }

        dispatch(setLanguage(languageCode));
        localStorage.setItem("preferredLanguage", languageCode);
    };

    const getCurrentLanguage = () =>
        LANGUAGES.find((lang) => lang.code === currentLang) || LANGUAGES[0];

    return {
        currentLang,
        languages: LANGUAGES,
        changeLanguage,
        getCurrentLanguage,
        loading,
    };
};

export { useLanguageChange };
