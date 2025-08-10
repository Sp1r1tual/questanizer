import { $api } from "../http";
import i18n from "i18next";

class SupportService {
    static async getFaqs() {
        const lang = i18n.language;

        return $api.get(`/faqs?lang=${lang}`);
    }
}

export { SupportService };
