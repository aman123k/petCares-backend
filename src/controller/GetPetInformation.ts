import { Request, Response } from "express";
import { PetListModel } from "../model/listSchema";

import { verifyToken } from "../token/jwtTpken";
import { userDetails } from "../InterFace/interFace";
class GetPetInformation {
  static GetPet = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const petType = req.query.type as string;
      const petBreed = req.query.breed as string;
      const limit = 10;
      const skip = (page - 1) * limit;

      const query: any = {
        isApproved: true,
        isAdopted: false,
      };

      if (petType !== "all") {
        query.petType = petType;
      }
      if (petBreed !== "all") {
        query["characteristics.petBreed"] = petBreed;
      }

      const PetData = await PetListModel.find({
        $and: [query],
      })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .select("-isApproved -isAdopted -Favourites");

      const totalDoc = await PetListModel.countDocuments(query);

      res.status(200).json({
        success: true,
        response: PetData,
        totalDoc,
      });
    } catch (err) {
      console.log("get pets error", err);
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
      }).select("-Favourites -isApproved -isAdopted -isApproved -isAdopted");
      res.status(200).json({
        success: true,
        response: favoritePets,
      });
    } catch (err) {
      console.log("get favourite pet", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default GetPetInformation;
