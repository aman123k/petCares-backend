import express, { Request, Response } from "express";
import fetch from "cross-fetch";
import { UserModel } from "../model/userSchema";
import { createToken } from "../token/jwtTpken";

class authFile {
  static googleLogin = async (req: Request, res: Response) => {
    try {
      const { tokenResponse, registerType } = req.body;
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse}`
      );
      const result = await response.json();
      const user = await UserModel.findOne({ email: result?.email });

      if (user?.loginType !== "google") {
        res.status(400).json({
          success: false,
          response: `User already exist please login with ${user?.loginType}`,
        });
        return;
      }

      const newUser = new UserModel({
        username: result?.name,
        email: result?.email,
        password: " ",
        picture: result?.picture,
        registerType,
        loginType: "google",
      });
      await newUser.save();

      // Set Cookie
      const accessToken = createToken(newUser);
      res.cookie("PetCaresAccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });

      res.status(201).json({
        success: true,
        response: "User Register Successfully",
      });
    } catch {
      res.status(500).json({
        success: false,
        response: "Server error",
      });
    }
  };
}

export default authFile;
