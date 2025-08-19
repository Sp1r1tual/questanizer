import { localizationService } from "../../../user/services/localization-service.js";

const localizeKeys = (userId, keyPath) => {
  if (!keyPath) return "";

  return localizationService.translateForUser(userId, keyPath);
};

export { localizeKeys };
