import { Request, Response } from "express";
import { PetListModel } from "../model/listSchema";

import { verifyToken } from "../token/jwtTpken";
import { userDetails } from "../InterFace/interFace";
class GetPetInformation {
  static GetPet = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 15;
      const skip = (page - 1) * limit;
      const PetData = await PetListModel.find().skip(skip).limit(limit);
      const totalDoc = await PetListModel.countDocuments();
      res.status(200).json({
        success: true,
        response: PetData,
        totalDoc,
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static GetFavouritesPets = async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      const favoritePets = await PetListModel.find({
        Favourites: userDetails?.user?.email,
      });
      res.status(200).json({
        success: true,
        response: favoritePets,
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default GetPetInformation;
