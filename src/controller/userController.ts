import { UserModel } from "../model/userSchema";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "../token/jwtTpken";
import { userDetails } from "../InterFace/interFace";
import client from "../redis/redisConnect";

class userController {
  static userRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, picture, registerType } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.findOne({
        email: { $regex: email, $options: "i" },
      });

      if (user?.password.trim() === "") {
        res.status(400).json({
          success: false,
          response: `User already exists. Please log in using ${user.loginType}.`,
        });
        return;
      }
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        picture,
        registerType,
        loginType: "password",
      });
      await newUser.save();
      res.status(201).json({
        success: true,
        response: "User Register Successfully",
      });
    } catch (error) {
      console.log("user register error", error);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static userLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({
        email: { $regex: email, $options: "i" },
      });
      if (!user) {
        res.status(400).json({
          success: false,
          response: "User not found",
        });
        return;
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (user.password === "") {
        res.status(400).json({
          success: false,
          response: `Please login with ${user.loginType}`,
        });
        return;
      }
      if (!isPasswordMatch) {
        res.status(400).json({
          success: false,
          response: "Invalid password",
        });
        return;
      }
      const accessToken = createToken(user);
      res.cookie("PetCaresAccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });
      res.status(200).json({
        success: true,
        response: "Login successful",
      });
    } catch (error) {
      console.log("user login error", error);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static userLogOut = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.PetCaresAccessToken;
    const userDetais = verifyToken(token) as userDetails;
    try {
      if (userDetais) {
        res.cookie("PetCaresAccessToken", "", {
          httpOnly: true,
          secure: true,
          path: "/",
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          sameSite: "none",
        });
        await client.set("user", ""),
          res.status(200).json({
            success: true,
            response: "User logout successfully...",
          });
        return;
      }

      res.status(200).json({
        success: true,
        response: "User already logedout",
      });
    } catch (err) {
      console.log("user log out", err);
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}
export default userController;
