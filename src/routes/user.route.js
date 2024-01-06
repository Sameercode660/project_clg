import { Router } from "express";
import { forgotPassword, loginUser, newPassword, registerUser, verifyOtp } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/verify-otp').post(verifyOtp)
userRouter.route('/login').post(loginUser)
userRouter.route('/forgot-password').post(forgotPassword)
userRouter.route('/new-password').post(newPassword)


export {
    userRouter
}