import express, { Request, Response } from "express";
import { config } from "dotenv";
import fetch from "cross-fetch";
import { UserModel } from "../model/userSchema";
import { createToken } from "../token/jwtTpken";
config();

class AuthFile {
  static githubAuth = async (req: Request, res: Response) => {
    try {
      const { tokenResponse } = req.body;
      const response = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_KEY,
            code: tokenResponse,
          }),
        }
      );
      const data = await response.json();
      const GithubAccessToken = data.access_token;

      const userDetailsResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${GithubAccessToken}`,
        },
      });
      const userDetails = await userDetailsResponse.json();

      const user = await UserModel.findOne({ email: userDetails?.email });
      const token = req.cookies?.PetCaresAccessToken;

      if (user) {
        if (user?.loginType !== "github") {
          res.status(400).json({
            success: false,
            response: `User already exist please login with ${user.loginType}`,
          });
          return;
        } else if (
          user?.registerType.length !== 2 &&
          user?.registerType[0] !== "rehouser"
        ) {
          user.registerType.push("rehouser");
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
        username: userDetails?.name,
        email: userDetails?.email,
        password: " ",
        picture: userDetails?.avatar_url,
        registerType: ["adopter"],
        loginType: "github",
      });
      res.cookie("PetCaresAccessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });
      const newUser = new UserModel({
        username: userDetails?.name,
        email: userDetails?.email,
        password: " ",
        picture: userDetails?.avatar_url,
        registerType: ["adopter"],
        loginType: "github",
      });
      await newUser.save();
      res.status(201).json({
        success: true,
        response: "User Register Successfully",
      });
    } catch {
      console.log("error");
    }
  };
}
export default AuthFile;
