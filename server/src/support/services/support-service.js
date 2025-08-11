import { FaqModel } from "../models/faq-model.js";

import { ApiError } from "../../shared/exceptions/api-error.js";

class SupportService {
    async getAnswersToQuestions(lang = "en") {
        const faqs = await FaqModel.find().sort({ createdAt: 1 }).lean();

        if (!faqs.length) {
            throw ApiError.NotFound("No FAQs found");
        }

        return faqs.map((faq) => {
            return {
                question: faq.question?.[lang] || faq.question?.en || "",
                answer: faq.answer?.[lang] || faq.answer?.en || "",
            };
        });
    }
}

const supportService = new SupportService();

export { supportService };
