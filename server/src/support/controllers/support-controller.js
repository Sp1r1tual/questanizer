import supportService from "../services/support-service.js";

const getFaqs = async (req, res, next) => {
    try {
        const faqs = await supportService.getAnswersToQuestions();

        return res.json(faqs);
    } catch (error) {
        next(error);
    }
};

export default {
    getFaqs,
};
