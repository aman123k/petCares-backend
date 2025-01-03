import { Request, Response } from "express";
import ImageUpload from "../cloudinary/uploader";
import { PetListModel } from "../model/listSchema";
import { verifyToken } from "../token/jwtTpken";
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
  static AddFavourites = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetais = verifyToken(token) as userDetails;
      if (!userDetais) {
        res.status(400).json({
          success: false,
          response: "Please login to add",
        });
        return;
      }
      const docs = await PetListModel.findOne({ _id: id });
      if (docs) {
        if (!docs?.Favourites.includes(userDetais?.user?.email)) {
          docs.Favourites.push(userDetais?.user?.email);
          await docs.save();
          res.status(200).json({
            success: true,
            response: "Pet added in favorite your list",
          });
          return;
        } else {
          const newdocs = docs.Favourites.filter((favourites) => {
            return favourites !== userDetais?.user?.email;
          });
          docs.Favourites = newdocs;
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
