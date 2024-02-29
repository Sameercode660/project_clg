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
  fetchComment,
  deletedTweet,
  fetchBookmarks,
  followUnfollowUser,
  checkFollwer,
  userFollowers,
  userFollowings,
  fetchProfilePicture,
  fetchNotification,
  checkTweetLikes,
} from "../controllers/tweet.controller.js";
import { userInfoForChat } from "../controllers/messenger.controller.js";
import { createChat } from "../controllers/chat.controller.js";
import { getChat } from "../controllers/chat.controller.js";
import { deleteChat } from "../controllers/chat.controller.js";
import { sendMessage, getMessage, deleteMessage} from "../controllers/messenger.controller.js"

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
userRouter.route("/bookmark-tweet").post(bookmarksTweet);
userRouter.route("/fetch-all-tweet").post(fetchAllTweet);
userRouter.route("/comment-fetch").post(fetchComment);
userRouter.route("/delete-tweet").post(deletedTweet);
userRouter.route("/fetch-bookmark").post(fetchBookmarks);
userRouter.route("/follow-user").post(followUnfollowUser);
userRouter.route("/check-follower").post(checkFollwer);
userRouter.route('/fetch-follower').post(userFollowers);
userRouter.route('/fetch-following').post(userFollowings);
userRouter.route('/fetch-user-profile').post(fetchProfilePicture);
userRouter.route('/fetch-notifications').post(fetchNotification);
userRouter.route('/check-tweet-likes').post(checkTweetLikes)
userRouter.route('/user-chat-info').post(userInfoForChat)
userRouter.route('/create-chat').post(createChat)
userRouter.route('/get-chat').post(getChat)
userRouter.route('/delete-chat').post(deleteChat)
userRouter.route('/send-message').post(sendMessage)
userRouter.route('/get-message').post(getMessage)
userRouter.route('/delete-message').post(deleteMessage)

export { userRouter };
