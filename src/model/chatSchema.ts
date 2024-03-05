import { Document, Schema, model } from "mongoose";

interface chat {
  chatId: string;
  sender: string;
  message: string;
  time: string;
}
interface ChatDocument extends chat, Document {}

const chatSchema = new Schema<ChatDocument>({
  chatId: { type: String, required: true, trim: true },
  sender: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
});
const messagesModel = model<ChatDocument>("messages", chatSchema);
export { chat, ChatDocument, messagesModel };
