import { Router } from "express";
import {
  editProfile,
  forgotPassword,
  loginUser,
  newPassword,
  profileData,
  registerUser,
  verifyOtp,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    bookmarksTweet,
  commentTweet,
  fetchLike,
  fetchTweet,
  likeTweet,
  postTweet,
  fetchAllTweet,
  fetchComment
} from "../controllers/tweet.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/verify-otp").post(verifyOtp);
userRouter.route("/login").post(loginUser);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/new-password").post(newPassword);
userRouter.route("/profile-edit").post(
  upload.fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  editProfile
);
userRouter.route("/profile-data").post(profileData);

userRouter.route("/post-tweet").post(
  upload.fields([
    {
      name: "media",
      maxCount: 1,
    },
  ]),
  postTweet
);

userRouter.route("/fetch-tweet").post(fetchTweet);
userRouter.route("/like-tweet").post(likeTweet);
userRouter.route("/like-fetch").post(fetchLike);
userRouter.route("/comment-tweet").post(commentTweet);
userRouter.route('/bookmark-tweet').post(bookmarksTweet)
userRouter.route('/fetch-all-tweet').post(fetchAllTweet)
userRouter.route('/comment-fetch').post(fetchComment)

export { userRouter };
