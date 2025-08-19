import { MessageModel } from "../models/chat-model.js";

class ChatService {
  constructor() {
    this.clients = new Map();
  }

  addClient(userId, socket) {
    this.clients.set(userId, socket);
  }

  removeClient(userId) {
    this.clients.delete(userId);
  }

  getClient(userId) {
    return this.clients.get(userId);
  }

  getChatHistory(userId1, userId2, limit = 100) {
    return MessageModel.find({
      $or: [
        { from: userId1, to: userId2 },
        { from: userId2, to: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .exec();
  }

  async saveMessage({ from, to, text }) {
    const message = new MessageModel({
      from,
      to,
      text,
      readBy: [],
      read: false,
    });
    await message.save();
    return message;
  }

  async markMessageAsRead(messageId, readerId) {
    const message = await MessageModel.findById(messageId);

    if (!message) return null;

    if (!message.readBy.includes(readerId)) message.readBy.push(readerId);

    message.read = true;
    message.readAt = new Date();

    await message.save();

    return message;
  }

  deleteMessage(messageId) {
    return MessageModel.findByIdAndDelete(messageId);
  }

  getMessageById(messageId) {
    return MessageModel.findById(messageId);
  }
}

const chatService = new ChatService();

export { chatService };
