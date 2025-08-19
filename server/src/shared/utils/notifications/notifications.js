const createMessage = (type, text) => ({ type, text });
const success = (text) => createMessage("success", text);
const info = (text) => createMessage("info", text);
const warning = (text) => createMessage("warning", text);
const error = (text) => createMessage("error", text);
const normalizeMessages = (messages) =>
  messages.map((msg) => (typeof msg === "string" ? info(msg) : msg));

export { createMessage, success, info, warning, error, normalizeMessages };
