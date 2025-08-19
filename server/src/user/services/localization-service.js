import i18next from "../../i18n.js";

import { findUserById } from "../../shared/utils/findUserById.js";

class LocalizationService {
  async getUserLanguage(userId) {
    const user = await findUserById(userId);

    return user?.locale || "en";
  }

  async changeLanguage(userId, newLang) {
    const user = await findUserById(userId);

    user.locale = newLang;
    await user.save();

    return user.locale;
  }

  async translateForUser(userId, key, params = {}) {
    const lang = await this.getUserLanguage(userId);

    return i18next.t(key, { lng: lang, ...params });
  }
}

const localizationService = new LocalizationService();

export { localizationService };
