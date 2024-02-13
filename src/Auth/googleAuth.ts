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
      const token = req.cookies?.PetCaresAccessToken;
      const user = await UserModel.findOne({ email: result?.email });
      if (user) {
        if (user?.loginType !== "google") {
          res.status(400).json({
            success: false,
            response: `User already exist please login with ${user.loginType}`,
          });
          return;
        } else if (
          user?.registerType.length !== 2 &&
          user?.registerType[0] !== registerType[0]
        ) {
          user.registerType.push(registerType[0]);
          const accessToken = createToken({
            username: user?.username,
            email: user?.email,
            password: user?.password,
            picture: user?.picture,
            registerType: user?.registerType,
            loginType: user?.loginType,
          });
          res.cookie("PetCaresAccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "none",
          });
          await UserModel.findByIdAndUpdate(user._id, {
            registerType: user.registerType,
          });
          res.status(201).json({
            success: true,
            response: "User added Successfully",
          });
        } else {
          const accessToken = createToken({
            username: user?.username,
            email: user?.email,
            password: user?.password,
            picture: user?.picture,
            registerType: user?.registerType,
            loginType: user?.loginType,
          });
          res.cookie("PetCaresAccessToken", accessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: "none",
          });
          res.status(201).json({
            success: true,
            response: "User Login Successfully",
          });
        }
        return;
      }

      const accessToken = createToken({
        username: result?.name,
        email: result?.email,
        password: " ",
        picture: result?.picture,
        registerType,
        loginType: "google",
      });
      res.cookie("PetCaresAccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });

      const newUser = new UserModel({
        username: result?.name,
        email: result?.email,
        password: " ",
        picture: result?.picture,
        registerType,
        loginType: "google",
      });
      await newUser.save();
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
