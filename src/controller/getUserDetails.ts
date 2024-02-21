import { Request, Response } from "express";
import { verifyToken } from "../token/jwtTpken";
import { UserModel } from "../model/userSchema";
import ImageUpload from "../cloudinary/uploader";
import ImageDete from "../cloudinary/deleteImage";
import { userDetails } from "../InterFace/interFace";

class userInformation {
  static getUserFun = async (req: Request, res: Response) => {
    const token = req.cookies?.PetCaresAccessToken;
    const userDetails = verifyToken(token) as userDetails;
    const user = await UserModel.findOne({ email: userDetails?.user?.email });

    try {
      if (user === null) {
        res.status(400).json({
          success: false,
          response: "user not login.",
        });
        return;
      }
      res.status(200).json({
        success: true,
        response: user,
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static getUserUpda = async (req: Request, res: Response) => {
    try {
      const { image, userName } = req.body;
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails: userDetails = verifyToken(token) as userDetails;

      const userDet = await UserModel.findOne({
        email: userDetails?.user?.email,
      });
      const id = userDet?._id;
      if (image) {
        await ImageDete(userDet?.picture ?? "");
        const response = await ImageUpload(image);
        const user = await UserModel.findByIdAndUpdate(
          id,
          {
            picture: response,
            username: userName,
          },
          { options: true }
        );
        console.log(user);
        await user?.save();
      } else {
        const user = await UserModel.findByIdAndUpdate(
          id,
          {
            username: userName,
          },
          { options: true }
        );
        await user?.save();
      }
      res.status(200).json({
        success: true,
        response: "Profile updated sucessfully..",
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default userInformation;
