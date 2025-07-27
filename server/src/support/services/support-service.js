import { FaqModel } from "../models/faq-model.js";

class SupportService {
    async getAnswersToQuestions() {
        const faqs = await FaqModel.find().sort({ createdAt: 1 }).lean();

        return faqs;
    }
}

const supportService = new SupportService();

export { supportService };
