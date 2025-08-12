import { MessageModel } from "../models/chat-model.js";

class ChatService {
    async saveMessage({ from, to, text }) {
        const message = new MessageModel({ from, to, text });

        await message.save();

        return message;
    }

    async getChatHistory(userId1, userId2) {
        return MessageModel.find({
            $or: [
                { from: userId1, to: userId2 },
                { from: userId2, to: userId1 },
            ],
        })
            .sort({ createdAt: 1 })
            .exec();
    }

    async markMessageAsRead(messageId) {
        return MessageModel.findByIdAndUpdate(
            messageId,
            { read: true, readAt: new Date() },
            { new: true }
        );
    }

    async deleteMessage(messageId) {
        return MessageModel.findByIdAndDelete(messageId);
    }

    async getMessageById(messageId) {
        return MessageModel.findById(messageId).exec();
    }
}

const chatService = new ChatService();

export { chatService };
