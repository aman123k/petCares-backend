import { UserModel } from "../model/userSchema";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "../token/jwtTpken";
interface userDetails {
  user: {
    username: string;
  };
}

class userController {
  static userRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, picture, registerType } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.findOne({ email });
      if (user) {
        if (
          user?.registerType.length === 2 ||
          user?.registerType[0] === registerType[0] ||
          user?.password === ""
        ) {
          res.status(400).json({
            success: false,
            response: `User already exist please login with ${user.loginType}`,
          });
          return;
        } else {
          user.registerType.push(registerType[0]);
          await UserModel.findByIdAndUpdate(user._id, {
            registerType: user.registerType,
          });
          res.status(201).json({
            success: true,
            response: "User added Successfully",
          });
        }
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
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
  static userLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
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
        response: "User logged in successfully",
      });
    } catch (error) {
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
        res.clearCookie("PetCaresAccessToken");
        res.status(200).json({
          success: true,
          response: "User logout successfully...",
        });
        return;
      }
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}
export default userController;