import { Document, Schema, model } from "mongoose";
import { User } from "./userSchema";

interface ChatConnection {
  firstUser: User;
  secondUser: User;
  isBlock: string[];
  lastMessage: string;
  time: string;
  userEmail: string[];
}

interface ChatDocument extends ChatConnection, Document {}

const chatConnectionSchema = new Schema<ChatDocument>({
  firstUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  secondUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isBlock: { type: [String], trim: true },
  lastMessage: { type: String, trim: true },
  time: { type: String, required: true, trim: true },
  userEmail: { type: [String], required: true, trim: true },
});

const ChatConnectionsModel = model<ChatDocument>(
  "chatConnections",
  chatConnectionSchema
);

export { ChatConnection, ChatDocument, ChatConnectionsModel };
