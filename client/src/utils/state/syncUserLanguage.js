import { changeUserLanguage } from "@/store/user/localizationThunks";

const syncUserLanguage = async (thunkAPI) => {
    const preferredLang = localStorage.getItem("preferredLanguage");

    if (preferredLang) {
        await thunkAPI.dispatch(changeUserLanguage(preferredLang));

        localStorage.removeItem("preferredLanguage");
    }
};

export { syncUserLanguage };
