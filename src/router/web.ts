import express from "express";
import userController from "../controller/userController";
import authFile from "../Auth/googleAuth";
import AuthFile from "../Auth/githubAuth";
import sendOTP from "../OTP/SendOTP";
import limiter from "../middelware/limiter";
import verifyOTP from "../OTP/VerifyOTP";
import AddPetController from "../controller/ListPet";
import userInformation from "../controller/getUserDetails";
import GetPetInformation from "../controller/GetPetInformation";

const router = express.Router();

router.post("/registration", userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/googleAuth", authFile.googleLogin);
router.post("/githubAuth", AuthFile.githubAuth);
router.get("/getUser", userInformation.getUserFun);
router.post("/logOut", userController.userLogOut);
router.post("/updateUserProfile", userInformation.getUserUpda);
router.post("/sendMail", limiter, sendOTP);
router.post("/verifyOtp", verifyOTP);
router.post("/listApet", AddPetController.ListPet);
router.post("/addFavourite", AddPetController.AddFavourites);
router.get("/getPet", GetPetInformation.GetPet);
router.get("/getFavourites", GetPetInformation.GetFavouritesPets);

export default router;
