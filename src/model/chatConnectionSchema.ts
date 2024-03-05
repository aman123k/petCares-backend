import { Document, Schema, model } from "mongoose";

interface ChatConnection {
  firstUser: {
    username: string;
    email: string;
    picture: string;
  };
  secondUser: {
    username: string;
    email: string;
    picture: string;
  };
  isBlock: string[];
  lastMessage: string;
  time: string;
  userEmail: string[];
}

interface ChatDocument extends ChatConnection, Document {}

const userSchema = new Schema({
  username: String,
  email: String,
  picture: String,
});

const chatConnectionSchema = new Schema<ChatDocument>({
  firstUser: { type: userSchema, required: true, trim: true },
  secondUser: { type: userSchema, required: true, trim: true },
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
