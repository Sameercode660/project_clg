import { Router } from "express";
import { editProfile, forgotPassword, loginUser, newPassword, registerUser, verifyOtp } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/verify-otp').post(verifyOtp)
userRouter.route('/login').post(loginUser)
userRouter.route('/forgot-password').post(forgotPassword)
userRouter.route('/new-password').post(newPassword)
userRouter.route('/profile-edit').post(upload.fields([
    {
        name: 'profilePicture',
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    }
]), editProfile
)


export {
    userRouter
}