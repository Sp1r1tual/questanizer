import i18n from "i18next";

import { $api } from "@/http";

class SupportService {
    static async getFaqs() {
        const lang = i18n.language;

        return $api.get(`/faqs?lang=${lang}`);
    }
}

export { SupportService };
