import { $api } from "../http";

class SupportService {
    static async getFaqs() {
        return $api.get("/faqs");
    }
}

export { SupportService };
