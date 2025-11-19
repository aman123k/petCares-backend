import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { UserModel } from "../model/userSchema";
import client from "../redis/redisConnect";
import { Resend } from "resend";

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
      await client.set("OTP", OTP.toString(), { EX: 300 });
    }

    // Send OTP via email using Resend service
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    // Send the email
    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL as string,
      to: email,
      subject: "Your OTP for Password Reset",
      html: ` <body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
    <div
      class="container"
      style="
        margin: auto;
        gap: 20px;
        background-color: #f8f8f8;
        width: 640px;
        height: 700px;
        margin-top: 100px;
      "
    >
      <div class="header" style="padding: 30px 38px; text-align: center">
        <img src="https://res.cloudinary.com/dytcbjjlv/image/upload/v1727263943/pet_f6zun1.png" style="width: 250px" alt="" />
      </div>
      <div
        class="content-box"
        style="
          width: 480px;
          background-color: #fff;
          border-radius: 5px;
          gap: 16px;
          margin: 0 48px;
          padding: 40px 32px;
          margin-bottom: 40px;
        "
      >
        <h2
          style="
            margin-top: 0;
            font-family: Helvetica;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.4;
            letter-spacing: normal;
            color: #121a26;
          "
        >
          Confirm and Update your password 🔒 !
        </h2>
        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          Hey , ${user?.username}
        </p>
        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          We have received a request to update the password for your PetCares
          account.
        </p>

        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          Your verification code is:
          <span
            style="
              text-align: center;
              font-weight: bold;
              font-family: 'Nunito', sans-serif;
              font-size: 25px;
              margin-top: 1rem;
              color: #5eae46;
            "
          >
    ${value ? value : OTP}</span
          >
        </p>

        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 15px;
          "
        >
          If you did not initiate this request, please disregard this message.
        </p>
        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 30px;
          "
        >
          Please note that this code is valid for 5 minutes.
        </p>

        <p
          style="
            font-family: Arial;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: 0.2px;
            text-align: left;
            color: #384860;
            margin: 0;
            margin-bottom: 30px;
          "
        >
          Best Wishes <br />
          The PetCares Team
        </p>
      </div>
      <div class="footer" style="text-align: center">
        <span>© PetCares</span>
      </div>
    </div>
  </body>`,
    });
    // Handle any errors during email sending
    if (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to send OTP. Please try again later.",
      });
    }

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
