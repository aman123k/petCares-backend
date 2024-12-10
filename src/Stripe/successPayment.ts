import { config } from "dotenv";
import { Request, Response } from "express";
import { PetListModel } from "../model/listSchema";
import nodemailer from "nodemailer";
import client from "../redis/redisConnect";
config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY);

const handlePaymentSuccess = async (req: Request, res: Response) => {
  try {
    const sessionId = req.body.session_id as String;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    if (session?.customer_details?.email && lineItems?.data[0]?.description) {
      const updatePetsDetails = await PetListModel.findOneAndUpdate(
        {
          "characteristics.petName": lineItems?.data[0]?.description,
        },
        {
          "Auth.email": session?.customer_details?.email,
          "Auth.name": session?.customer_details?.name,
          isAdopted: true,
        },
        { new: true }
      );
      const updatePets = await updatePetsDetails?.save();

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: session?.customer_details?.email,
        subject: "PetCares password reset",
        html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif">
  <div
    class="container"
    style="
      margin: auto;
      gap: 20px;
      background-color: #f8f8f8;
      width: 640px;
      height: auto;
      margin-top: 100px;
      padding-bottom: 40px;
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
          line-height: 1.4;
          color: #121a26;
        "
      >
        Congratulations on Your New Friend! 🎉
      </h2>
      <p
        style="
          font-family: Arial;
          font-size: 16px;
          line-height: 1.5;
          color: #384860;
          margin: 0;
          margin-bottom: 15px;
        "
      >
        Hi ${updatePets?.Auth?.name},
      </p>
      <p
        style="
          font-family: Arial;
          font-size: 16px;
          line-height: 1.5;
          color: #384860;
          margin: 0;
          margin-bottom: 15px;
        "
      >
        We are thrilled to inform you that you've successfully adopted your new pet! Here are the details of your new companion:
      </p>

      <div
        style="
          font-family: Arial;
          font-size: 16px;
          line-height: 1.5;
          color: #384860;
          margin: 15px 0;
        "
      >
        <strong>Pet Details:</strong>
        <ul style="margin-top: 8px; padding-left: 20px;">
          <li><strong>Name:</strong> ${updatePets?.characteristics?.petName}</li>
          <li><strong>Age:</strong> ${updatePets?.characteristics?.petAge}</li>
          <li><strong>Breed:</strong> ${updatePets?.characteristics?.petBreed}</li>
        </ul>
      </div>

      <p
        style="
          font-family: Arial;
          font-size: 16px;
          line-height: 1.5;
          color: #384860;
          margin: 0;
          margin-bottom: 15px;
        "
      >
        We hope you and ${updatePets?.characteristics?.petName} will create wonderful memories together. Thank you for giving them a loving home!
      </p>

      <p
        style="
          font-family: Arial;
          font-size: 16px;
          line-height: 1.5;
          color: #384860;
          margin: 0;
          margin-bottom: 30px;
        "
      >
        With best wishes,<br />
        The PetCares Team
      </p>
    </div>
    <div class="footer" style="text-align: center; padding: 10px;">
      <span>© PetCares</span>
    </div>
  </div>
</body>
`,
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

      const keys = await client.keys("pets:*");
      if (keys.length > 0) {
        await client.del(keys);
      }

      res.status(200).json({
        success: true,
        response: "Pet adopted successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Failed to fetch line items",
      });
    }
  } catch (error) {
    console.error("Error fetching line items:", error);
    res.status(400).json({
      success: false,
      response: "Failed to fetch line items",
    });
  }
};

export default handlePaymentSuccess;
