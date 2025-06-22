import { Document, Schema, model } from "mongoose";

interface Enquiry {
  email: string;
  phone: number;
  name: string;
  enquiryAbout: string;
  enquiryIs: string;
}
interface contactPetCares extends Enquiry, Document {}

const contactSchema = new Schema<contactPetCares>({
  email: { type: String, required: true, trim: true },
  phone: { type: Number, trim: true },
  name: { type: String, required: true, trim: true },
  enquiryAbout: { type: String, required: true, trim: true },
  enquiryIs: { type: String, required: true, trim: true },
});
const ContactModel = model<contactPetCares>("contactPetCares", contactSchema);
export { Enquiry, contactPetCares, ContactModel };
