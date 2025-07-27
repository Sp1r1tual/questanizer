import FaqModel from "../models/faq-model.js";

const getAnswersToQuestions = async () => {
    const faqs = await FaqModel.find().sort({ createdAt: 1 }).lean();

    return faqs;
};

export default {
    getAnswersToQuestions,
};
