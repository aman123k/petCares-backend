"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const userSchema_1 = require("../model/userSchema");
const redisConnect_1 = __importDefault(require("../redis/redisConnect"));
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const OTP = Math.floor(1000 + Math.random() * 9000);
    try {
        const user = yield userSchema_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                response: "User not found..",
            });
        }
        const value = yield redisConnect_1.default.get("OTP");
        if (!value) {
            redisConnect_1.default.set("OTP", OTP.toString(), { EX: 300 });
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
            <h1 style="font-weight: bold; font-family: 'Nunito', sans-serif; margin-top: .5rem;">Hello, ${user === null || user === void 0 ? void 0 : user.username}</h1>
            <p style="font-family: 'Nunito', sans-serif; font-weight: bold; font-size: 1rem; margin-top: .5rem;">A request has been received to change the password for your PetCares account.</p>
            <div style="text-align: center; font-weight: bold; font-family: 'Nunito', sans-serif; font-size: 2.5rem; margin-top: 1rem;">${value ? value : OTP}</div>
            <p style="font-size: 0.875rem; margin-top: .5rem;">If you did not initiate this request, please live it as it is...</p>
            <p style="font-size: 0.875rem; margin-top: .5rem;">Valid for 5 minutes</p>
            <p style="font-size: 0.875rem; margin-top: .5rem;">Thank you,</p>
            <p style="font-size: 0.875rem; margin-top: .5rem;">The PetCares Team,</p>
          </div>
        </section>
        </body>`,
        };
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.SMTP_KEY,
            },
        });
        yield transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error:", error);
            }
            else {
                console.log("Email sent:", info.response);
            }
        });
        res.status(200).json({
            success: true,
            response: "OTP send to your gmail..",
        });
    }
    catch (_a) {
        res.status(400).json({
            success: false,
            response: "Server Error",
        });
    }
});
exports.default = sendOTP;
