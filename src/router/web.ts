import express from "express";
import userController from "../controller/userController";
import authFile from "../Auth/googleAuth";
import AuthFile from "../Auth/githubAuth";
import userDetails from "../controller/getUserDetails";
import ImageUpload from "../cloudinary/uploader";
import sendOTP from "../OTP/SendOTP";
import limiter from "../middelware/limiter";
import verifyOTP from "../OTP/VerifyOTP";

const router = express.Router();

router.post("/registration", userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/googleAuth", authFile.googleLogin);
router.post("/githubAuth", AuthFile.githubAuth);
router.get("/getUser", userDetails.getUserFun);
router.post("/logOut", userController.userLogOut);
router.post("/updateUserProfile", userDetails.getUserUpda);
router.post("/sendMail", limiter, sendOTP);
router.post("/verifyOtp", verifyOTP);

export default router;
