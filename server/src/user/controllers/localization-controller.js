import { localizationService } from "../services/localization-service.js";

const getUserLanguage = async (req, res, next) => {
  try {
    const language = await localizationService.getUserLanguage(req.user.id);

    return res.json({ language });
  } catch (error) {
    next(error);
  }
};

const changeUserLanguage = async (req, res, next) => {
  try {
    const { language } = req.body;

    const updatedLanguage = await localizationService.changeLanguage(req.user.id, language);

    return res.json({ language: updatedLanguage });
  } catch (error) {
    next(error);
  }
};

export { getUserLanguage, changeUserLanguage };
