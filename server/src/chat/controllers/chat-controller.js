import { chatService } from "../services/chat-service.js";

const getChatHistoryController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const withUserId = req.params.withUserId;

        const history = await chatService.getChatHistory(userId, withUserId);

        return res.json(history);
    } catch (error) {
        next(error);
    }
};

export { getChatHistoryController };
