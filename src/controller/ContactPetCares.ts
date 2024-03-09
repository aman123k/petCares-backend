import { Request, Response } from "express";
import { ContactModel } from "../model/contactPetCares";

class contactPetCares {
  static contect = async (req: Request, res: Response) => {
    try {
      const { name, email, phone, enquriyAbout, enquriyIs } = req.body;
      const docs = new ContactModel({
        name,
        email,
        phone,
        enquriyAbout,
        enquriyIs,
      });
      await docs.save();
      res.status(200).json({
        success: true,
        response: "Enquriy successfully send to Admin",
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default contactPetCares;
