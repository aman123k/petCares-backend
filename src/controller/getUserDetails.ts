import { Request, Response } from "express";
import { verifyToken } from "../token/jwtTpken";
import { UserModel } from "../model/userSchema";
import ImageUpload from "../cloudinary/uploader";
import ImageDete from "../cloudinary/deleteImage";
import { userDetails } from "../InterFace/interFace";
import { ChatConnectionsModel } from "../model/chatConnectionSchema";
import client from "../redis/redisConnect";

class userInformation {
  static getUserFun = async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      const user = await UserModel.findOne({
        email: userDetails?.user?.email,
      })
        .select("-password")
        .select("-registerType");
      if (user === null) {
        res.status(400).json({
          success: false,
          response: "user not login.",
        });
        return;
      }
      const RedisUser = await client.get(user.email);
      if (!RedisUser || RedisUser !== JSON.stringify(user)) {
        await client.set(user?.email, JSON.stringify(user), { EX: 86400 });
      }
      res.status(200).json({
        success: true,
        response: RedisUser ? JSON.parse(RedisUser) : user,
      });
    } catch (err) {
      console.log("get user function", err);
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
        const updated = await ChatConnectionsModel.findOneAndUpdate(
          {
            "firstUser.email": userDetails?.user?.email,
          },
          {
            "firstUser.picture": response,
            "firstUser.username": userName,
          },
          { options: true }
        );
        const updated2 = await ChatConnectionsModel.findOneAndUpdate(
          {
            "secondUser.email": userDetails?.user?.email,
            "secondUser.username": userName,
          },
          {
            "secondUser.picture": response,
          },
          { options: true }
        );
        if (updated) {
          await updated.save();
        } else {
          updated2?.save();
        }
        await user?.save();
      } else {
        const user = await UserModel.findByIdAndUpdate(
          id,
          {
            username: userName,
          },
          { options: true }
        );
        const updated = await ChatConnectionsModel.findOneAndUpdate(
          {
            "firstUser.email": userDetails?.user?.email,
          },
          {
            "firstUser.username": userName,
          },
          { options: true }
        );
        const updated2 = await ChatConnectionsModel.findOneAndUpdate(
          {
            "secondUser.email": userDetails?.user?.email,
          },
          {
            "secondUser.username": userName,
          },
          { options: true }
        );
        if (updated) {
          await updated.save();
        } else {
          updated2?.save();
        }
        await user?.save();
      }
      res.status(200).json({
        success: true,
        response: "Profile updated sucessfully..",
      });
    } catch (err) {
      console.log("update user", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default userInformation;
