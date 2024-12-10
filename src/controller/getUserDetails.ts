import { Request, Response } from "express";
import { verifyToken } from "../token/jwtTpken";
import { UserModel } from "../model/userSchema";
import ImageUpload from "../cloudinary/uploader";
import ImageDete from "../cloudinary/deleteImage";
import { userDetails } from "../InterFace/interFace";
import client from "../redis/redisConnect";

class userInformation {
  static getUserFun = async (req: Request, res: Response) => {
    try {
      const token = req.cookies?.PetCaresAccessToken;
      const userDetails = verifyToken(token) as userDetails;
      const userEmail: string = userDetails?.user?.email;

      // Check Redis cache first if user data is there then retun the user data

      const RedisUser = await client.get(userEmail);
      if (RedisUser) {
        return res.status(200).json({
          success: true,
          response: JSON.parse(RedisUser),
        });
      }

      // If not found in cache, fetch from database
      const user = await UserModel.findOne({ email: userEmail }).select(
        "-password -registerType"
      );

      if (user === null) {
        res.status(400).json({
          success: false,
          response: "user not login.",
        });
        return;
      }

      // Cache the user data in Redis
      await client.set(userEmail, JSON.stringify(user), { EX: 86400 });

      res.status(200).json({
        success: true,
        response: user,
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
      const userDetails = verifyToken(token) as userDetails;
      const userEmail: string = userDetails?.user?.email;

      const userDet = await UserModel.findOne({
        email: userDetails?.user?.email,
      });

      if (!userDet) {
        return res.status(404).json({
          success: false,
          response: "User not found.",
        });
      }

      const id = userDet?._id;

      // Function to update user and chat connections
      const updateUserAndChat = async (updateData: any) => {
        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
          new: true,
        });
        // update user in radis
        await client.set(userEmail, JSON.stringify(updatedUser), { EX: 86400 });
      };

      if (image) {
        await ImageDete(userDet.picture ?? "");
        const response = await ImageUpload(image);
        await updateUserAndChat({ picture: response, username: userName });
      } else {
        await updateUserAndChat({ username: userName });
      }

      res.status(200).json({
        success: true,
        response: "Profile updated successfully.",
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
