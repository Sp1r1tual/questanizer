import { ApiError } from "../../shared/exceptions/api-error.js";

const SUPPORTED_LANGUAGES = ["en", "uk", "jp", "pl", "es", "de"];

const validateLanguageMiddleware = (req, res, next) => {
  const { language } = req.body;

  if (!language) {
    return next(ApiError.BadRequest("Language is required"));
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return next(ApiError.Conflict("Unsupported language"));
  }

  next();
};

export { validateLanguageMiddleware };
