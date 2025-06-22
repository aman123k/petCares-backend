import { Request, Response } from "express";
import { ContactModel } from "../model/contactPetCares";

class contactPetCares {
  static contact = async (req: Request, res: Response) => {
    try {
      const { name, email, phone, enquiryAbout, enquiryIs } = req.body;
      const docs = new ContactModel({
        name,
        email,
        phone,
        enquiryAbout,
        enquiryIs,
      });
      await docs.save();
      res.status(200).json({
        success: true,
        response: "Enquiry successfully send to Admin",
      });
    } catch (err) {
      console.log("contact page", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default contactPetCares;
