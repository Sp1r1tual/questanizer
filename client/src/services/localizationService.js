import { $api } from "@/http";

class LocalizationService {
  static getUserLanguage() {
    return $api.get("/language");
  }

  static changeUserLanguage(language) {
    return $api.post("/language/change", { language });
  }
}

export { LocalizationService };
