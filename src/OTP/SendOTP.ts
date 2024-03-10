import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { UserModel } from "../model/userSchema";
import client from "../redis/redisConnect";

const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  const OTP: number = Math.floor(1000 + Math.random() * 9000);
  try {
    const user = await UserModel.findOne({
      email: { $regex: email, $options: "i" },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        response: "User not found..",
      });
    }
    const value = await client.get("OTP");
    if (!value) {
      client.set("OTP", OTP.toString(), { EX: 300 });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "PetCares password reset",
      html: `<body style="font-family: 'Nunito', sans-serif;">
        <section style=" width:800px; box-shadow: 0px 0px 20px rgba(0, 0, 0, 10);background-color: #f3f3f3f3;
         border-radius:10px; padding-left:5%; padding-right:5%; padding-top:3%; padding-bottom:3%;">
          <h1 style="text-align: center; font-weight: bold; font-size: 2rem;">PetCares</h1>
          <p style="text-align: center;font-size: 1rem; color: #5EAE46; font-weight: bold;">Confirm and Update your password</p>
          <div style="">
            <h1 style="font-weight: bold; font-family: 'Nunito', sans-serif; margin-top: .5rem;">Hello, ${
              user?.username
            }</h1>
            <p style="font-family: 'Nunito', sans-serif; font-weight: bold; font-size: 1rem; margin-top: .5rem;">A request has been received to change the password for your PetCares account.</p>
            <div style="text-align: center; font-weight: bold; font-family: 'Nunito', sans-serif; font-size: 2.5rem; margin-top: 1rem;">${
              value ? value : OTP
            }</div>
            <p style="font-size: 0.875rem; margin-top: .5rem;">If you did not initiate this request, please live it as it is...</p>
            <p style="font-size: 0.875rem; margin-top: .5rem;">Valid for 5 minutes</p>
            <p style="font-size: 0.875rem; margin-top: .5rem;">Thank you,</p>
            <p style="font-size: 0.875rem; margin-top: .5rem;">The PetCares Team,</p>
          </div>
        </section>
        </body>`,
    };
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.SMTP_KEY,
      },
    });
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.status(200).json({
      success: true,
      response: "OTP send to your gmail..",
    });
  } catch {
    res.status(400).json({
      success: false,
      response: "Server Error",
    });
  }
};
export default sendOTP;
