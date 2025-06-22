import { Request, Response } from "express";
import ImageUpload from "../cloudinary/uploader";
import { PetListModel } from "../model/listSchema";
import { verifyToken } from "../token/jwtToken";
import { userDetails } from "../InterFace/interFace";

class AddPetController {
  static ListPet = async (req: Request, res: Response) => {
    try {
      const {
        pet,
        characteristics,
        reason,
        time,
        keyFact,
        petImage,
        petStory,
      } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      const promises = petImage?.map((image: string) => ImageUpload(image));
      const uploadedImages = await Promise.all(promises);

      const petData = new PetListModel({
        petType: pet,
        petImage: uploadedImages,
        petStory,
        reason,
        time,
        characteristics,
        keyFact,
        Auth: {
          email: userDetails?.user.email,
          name: userDetails?.user?.username,
        },
        isApproved: "pending",
        isAdopted: false,
        postAddTime: new Date(),
      });
      await petData.save();
      res.status(200).json({
        success: true,
        response:
          "Your pet listing has been submitted. Admin approval pending. Thanks!",
      });
    } catch (err) {
      console.log("list pet error", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static AddFavorites = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      if (!userDetails) {
        res.status(400).json({
          success: false,
          response: "Please login to add",
        });
        return;
      }
      const docs = await PetListModel.findOne({ _id: id });
      if (docs) {
        if (!docs?.Favorites.includes(userDetails?.user?.email)) {
          docs.Favorites.push(userDetails?.user?.email);
          await docs.save();
          res.status(200).json({
            success: true,
            response: "Pet added in favorite your list",
          });
          return;
        } else {
          const newDocs = docs.Favorites.filter((Favorites) => {
            return Favorites !== userDetails?.user?.email;
          });
          docs.Favorites = newDocs;
          await docs.save();
          res.status(200).json({
            success: true,
            response: "Pet removed  from your favorite list ",
          });
        }
      }
    } catch (err) {
      console.log("add favourite error", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default AddPetController;
