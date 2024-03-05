import { Document, Schema, model } from "mongoose";

interface User {
  petType: string;
  petImage: string[];
  petStory: string;
  reason: string;
  time: string;
  characteristics: { [key: string]: string };
  keyFact: { [key: string]: string };
  Auth: { [key: string]: string };
  Favourites: string[];
  postAddTime: string;
}

interface UserDocument extends User, Document {}

const petlistSchema = new Schema<UserDocument>({
  petType: { type: String, required: true, trim: true },
  petImage: { type: [String], required: true, trim: true },
  petStory: { type: String, trim: true },
  reason: { type: String, trim: true },
  time: { type: String, trim: true, required: true },
  characteristics: { type: Object, trim: true, required: true },
  keyFact: { type: Object, trim: true, required: true },
  Auth: { type: Object, trim: true, required: true },
  Favourites: { type: [String], trim: true },
  postAddTime: { type: String, trim: true, required: true },
});

const PetListModel = model<UserDocument>("PetList", petlistSchema);

export { User, UserDocument, PetListModel };
