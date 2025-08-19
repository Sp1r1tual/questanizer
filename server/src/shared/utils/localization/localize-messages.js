import { localizationService } from "../../../user/services/localization-service.js";

import { success, info, warning, error } from "../notifications/notifications.js";

const typeToMessage = { success, info, warning, error };

const localizationMessages = async (userId, messageType, key, params = {}) => {
  const text = await localizationService.translateForUser(userId, key, params);
  return typeToMessage[messageType](text);
};

export { localizationMessages };
