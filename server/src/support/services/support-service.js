import { FaqModel } from "../models/faq-model.js";

class SupportService {
    async getAnswersToQuestions() {
        try {
            const faqs = await FaqModel.find().sort({ createdAt: 1 }).lean();

            return faqs;
        } catch (error) {
            console.error("Error in FAQ:", error);
            throw error;
        }
    }
}

const supportService = new SupportService();

export { supportService };
