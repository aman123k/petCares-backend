import { Document, Schema, model } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  picture: string;
  registerType: string[];
  loginType: string;
}

interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, trim: true },
  picture: { type: String, trim: true },
  registerType: { type: [String], trim: true, required: true },
  loginType: { type: String, trim: true, required: true },
});

const UserModel = model<UserDocument>("User", userSchema);

export { User, UserDocument, UserModel };
