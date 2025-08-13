const formatMessage = (msg, senderName = null) => ({
    id: msg._id,
    from: String(msg.from),
    fromUsername: senderName || null,
    to: String(msg.to),
    text: msg.text,
    createdAt: msg.createdAt,
    readBy: msg.readBy || [],
    read: msg.read || false,
    readAt: msg.readAt,
});

export { formatMessage };
