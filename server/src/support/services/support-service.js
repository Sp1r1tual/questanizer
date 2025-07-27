import { FaqModel } from "../models/faq-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

class SupportService {
    async getAnswersToQuestions() {
        const faqs = await FaqModel.find().sort({ createdAt: 1 }).lean();

        if (!faqs.length) {
            throw ApiError.NotFound("No FAQs found");
        }

        return faqs;
    }
}

const supportService = new SupportService();

export { supportService };
