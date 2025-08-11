import { $api } from "@/http";

class LocalizationService {
    static async getUserLanguage() {
        return $api.get("/language");
    }

    static async changeUserLanguage(language) {
        return $api.post("/language/change", { language });
    }
}

export { LocalizationService };
