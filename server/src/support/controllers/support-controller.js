import { supportService } from "../services/support-service.js";

const getFaqs = async (req, res, next) => {
    try {
        const lang = req.query.lang || "en";

        const faqs = await supportService.getAnswersToQuestions(lang);

        return res.json(faqs);
    } catch (error) {
        next(error);
    }
};

export { getFaqs };
