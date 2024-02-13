import express, { Request, Response } from "express";
import { UserModel } from "../model/userSchema";
import client from "../redis/redisConnect";
import bcrypt from "bcrypt";
import { createToken } from "../token/jwtTpken";

const verifyOTP = async (req: Request, res: Response) => {
  const { email, newPass, otp } = req.body;
  try {
    const value = await client.get("OTP");
    if (!otp || value !== otp) {
      return res.status(404).json({
        success: false,
        response: "Enter correct OTP...",
      });
    }
    const user = await UserModel.findOne({ email });
    const hashPassword = await bcrypt.hash(newPass, 10);
    const id = user?._id;
    const updatePass = await UserModel.findByIdAndUpdate(
      id,
      { password: hashPassword },
      { option: true }
    );
    await updatePass?.save();
    const accessToken = createToken({
      username: user?.username,
      email: email,
      password: hashPassword,
      picture: user?.picture,
      registerType: user?.registerType,
      loginType: "password",
    });
    res.cookie("PetCaresAccessToken", accessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      response: "Password updated successfully...",
    });
  } catch {
    res.status(400).json({
      success: false,
      response: "Server Error",
    });
  }
};

export default verifyOTP;
