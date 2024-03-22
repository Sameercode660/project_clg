import { Tweet } from "../models/tweet.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Bookmark } from "../models/bookmark.model.js";
import { User } from "../models/user.model.js";
import { Follower } from "../models/follower.model.js";
import { Notification } from "../models/notification.model.js";

const postTweet = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Body is empty" });
    }

    const { user, content } = req.body;

    if (!user && !content) {
      res.status(400).json({ message: "Please enter some content" });
    }

    const mediaFilePath = req.files.media[0].path;
    console.log(mediaFilePath);
    const mediaResponse = await uploadOnCloudinary(mediaFilePath);
    console.log(mediaResponse);
    if (!mediaResponse) {
      res.status(401).json({ message: "Unable to upload image on cloudinary" });
    }
    const data = {
      user,
      content,
      media: mediaResponse.url,
    };
    const tweet = await Tweet.create(data);

    if (!tweet) {
      res.status(500).json({ message: "Unable to create tweet" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Successfully Tweeted"));
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internat Server Error" });
  }
};

const fetchTweet = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "empty body has sent" });
    }

    const { _id: user } = req.body;

    const tweets = await Tweet.find({ user });

    const userData = await User.findById(req.body._id);

    const mergedData = [];

    tweets.forEach((tweet) => {
      const mergedObject = {
        tweetId: tweet._id,
        userId: user._id,
        ...tweet._doc,
        ...userData._doc,
      };
      mergedData.push(mergedObject);
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, mergedData, "Fetched the tweets successfully")
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in fetching tweets" });
  }
};

const likeTweet = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Body is empty" });
    }

    const { user, targetType, targetId } = req.body;

    if (!(user && targetType && targetId)) {
      res.status(400).json({ message: "Unable to like the post" });
    }

    const data = {
      user,
      targetType,
      targetId,
    };

    const isLiked = await Like.findOne({ $and: [{ user }, { targetType }] });

    if (isLiked) {
      await Like.findByIdAndDelete(isLiked._id);
      const totalLike = await Like.find({ targetType });
      await Tweet.updateOne(
        { _id: targetType },
        { $pull: { likes: user }, $set: {} },
        { new: true }
      );
      return res.status(201).json({
        message: "Like deleted successfully",
        totalLike: totalLike.length,
        toggle: false,
      });
    }
    await Like.create(data);
    await Tweet.updateOne(
      { _id: targetType },
      { $push: { likes: user }, $set: {} },
      { new: true }
    );
    const totalLike = await Like.find({ targetType });
    res.status(200).json({ totalLike: totalLike.length, toggle: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Initial error in like section" });
  }
};

const fetchLike = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "req body element is missing" });
    }

    const { targetType } = req.body;

    const response = (await Like.find({ targetType })).length;

    res
      .status(200)
      .json(new ApiResponse(200, response, "Like fetched successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to fetch the likes" });
  }
};

const commentTweet = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Body is empty" });
    }

    const { user, content, tweetId } = req.body;

    const data = {
      user,
      content,
      tweetId,
    };
    const response = await Comment.create(data);

    res
      .status(200)
      .json(new ApiResponse(200, response, "Comment added successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to comment to tweet" });
  }
};

const bookmarksTweet = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "body is empty" });
    }

    const { tweetId, userId } = req.body;

    const data = {
      tweetId,
      userId,
    };
    const response = await Bookmark.create(data);

    res
      .status(200)
      .json(new ApiResponse("200", response, "Bookmark created successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Unable to bookmark" });
  }
};

const fetchAllTweet = async (req, res) => {
  try {
    const tweets = await Tweet.find();

    const userIds = tweets.map((tweet) => tweet.user);

    const users = await User.find({ _id: { $in: userIds } }).select(
      "-password -otp"
    );

    const mergedData = [];

    users.forEach((user) => {
      const matchingTweets = tweets.filter(
        (tweet) => tweet.user.toString() == user._id.toString()
      );
      matchingTweets.forEach((tweet) => {
        const mergedObject = {
          userId: user._id,
          tweetId: tweet._id,
          ...tweet._doc,
          ...user._doc,
        };
        mergedData.push(mergedObject);
      });
    });

    res
      .status(200)
      .json(new ApiResponse(200, mergedData, "fetch the data successfully"));
  } catch (error) {
    console.log(error);

    res.status(401).json({ message: "Unable to fetch the data" });
  }
};

const fetchComment = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json("Body is empty");
    }

    const { tweetId } = req.body;

    const comments = await Comment.find({ tweetId });

    let mergedArray = [];

    // comments.forEach(async (comment) => {
    //   const user = await User.findById({_id : comment.user})
    //   if(user) {
    //     const mergedObject = {
    //       ...comment._doc,
    //       userId: user._id,
    //       fullName: user.fullName,
    //       username: user.username,
    //       profilePictue: user.profilePicture
    //     }
    //     mergedArray.push(mergedObject)
    //     console.log(mergedArray)
    //   }
    // })

    const commentPromises = comments.map(async (comment) => {
      const user = await User.findById({ _id: comment.user });

      if (user) {
        return {
          ...comment._doc,
          userId: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePicture: user.profilePicture,
        };
      }
    });

    mergedArray = await Promise.all(commentPromises);

    return res
      .status(200)
      .json(new ApiResponse(200, mergedArray, "comment fetched successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Initial comment error" });
  }
};

// const deletedTweet = async (req, res) => {
//   try {
//     const { _id, user } = req.body;

//     const response = await Tweet.deleteOne({ $and: [{ _id }, { user }] });

//     if (!response) {
//       res.status(400).json({ message: "Unable to delete the tweet" });
//     }

//     res
//       .status(200)
//       .json(new ApiResponse(200, response, "Tweet deleted successfully"));
//   } catch (error) {
//     console.log(error);

//     res
//       .status(400)
//       .json({ message: "Error in executing the deleted function code" });
//   }
// };

const fetchBookmarks = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Empty body is sent" });
    }

    const { userId } = req.body;

    const bookmarks = await Bookmark.find({ userId });

    const TweetIds = bookmarks.map((id) => id.tweetId);

    const TweetsPromises = TweetIds.map(async (_id) => {
      return await Tweet.findById(_id);
    });

    const TweetsData = await Promise.all(TweetsPromises);

    const mergedArray = [];

    const tweetAndUserDataPromises = TweetsData.map(async (tweet) => {
      const user = await User.findById({ _id: tweet.user }).select(
        "-password -otp"
      );
      if (user) {
        return {
          tweetId: tweet._id,
          userId: user._id,
          ...tweet._doc,
          ...user._doc,
        };
      }
    });

    const tweetAndUserData = await Promise.all(tweetAndUserDataPromises);
    res.send(tweetAndUserData);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unable to execute the code of fetchBookmarks code successfully",
    });
  }
};

const followUnfollowUser = async (req, res) => {
  // 1. check for whether the body is empty or not
  // 2. check for each field seperately for accuracy
  // 3. check for whether the follower has already followed a person
  // 4. if found followed already logic for unfollow
  // 5. if not found, logic for follow
  if (!req.body) {
    return res.status(400).json({ message: "Empty body is sent" });
  }

  const { followerID, followedID } = req.body;

  if (!followerID || !followedID) {
    return res.status(400).json({ message: "Any field is empty" });
  }

  const data = {
    followerID,
    followedID,
  };

  const checkFollower = await Follower.findOne({
    $and: [{ followerID, followedID }],
  });

  if (checkFollower) {
    const response = await Follower.deleteOne({ _id: checkFollower._id });
    const followerUser = await User.updateOne(
      { _id: followerID },
      { $pull: { following: followedID }, $set: {} },
      { new: true }
    );

    const followedUser = await User.updateOne(
      { _id: followedID },
      { $pull: { followers: followerID }, $set: {} },
      { new: true }
    );
    return res
      .status(200)
      .json({ response, followedUser, followerUser, toggle: false });
  }

  const response = await Follower.create(data);

  const follwerUser = await User.updateOne(
    { _id: followerID },
    { $push: { following: followedID }, $set: {} },
    { new: true }
  );

  const followedUser = await User.updateOne(
    { _id: followedID },
    { $push: { followers: followerID }, $set: {} },
    { new: true }
  );

  // creating and sending the notification to the user
  const notificationData = {
    senderID: followerID,
    recieverID: followedID,
    notificationType: "new follower",
    content: "New follower is added",
  };
  const notification = await Notification.create(notificationData);

  res
    .status(200)
    .json({ response, follwerUser, followedUser, notification, toggle: true });
};

const checkFollwer = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Body is sent empty" });
    }

    const { followerID, followedID } = req.body;

    if (!followerID || !followedID) {
      return res.status(400).json({ message: "Any field is empty" });
    }

    const response = await Follower.findOne({
      $and: [{ followerID, followedID }],
    });

    if (response) {
      return res.status(200).json({ found: true });
    }

    res.status(200).json({ found: false });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Error in executing the checkfollowers Code" });
  }
};

// fetch user followers
// const userFollowers = async (req, res) => {
//   try {
//     //1. check body is empty or not
//     //2. check for the user id
//     // 3. fetch data based on userId in Follower model
//     // 4. then return the userId and follower Id and necessary data
//     if(!req.body) {
//       return res.status(400).json({message: 'Empty Body is send'})
//     }
//     // checking for userId
//     const {userId} = req.body

//     // if user id is not found , return a response of undefined
//     if(!userId) {
//       return res.status(400).json({message: 'userId is undefined'})
//     }

//     // fetching all the follower of  a particular user based on user id and stores as an array
//     const allFollowerList = await Follower.find({followedID: userId})

//     // seperating the follwer Id for fetching the data of each  follower1
//     const allFollwersIds = allFollowerList.map((follower) => (follower.followerID))

//     // fetching the data of each follower using map that creates an array of promises
//     const followersDataPromises = allFollwersIds.map(async (follower) => {
//       return await User.findOne({_id: follower}).select('-password -otp')
//     })

//     // Promise.all resolved each promise array, created by followerDataPromises
//     const followerData = await Promise.all(followersDataPromises)

//     // sending the response to the frontend, a follwerData which is an array of resolved promise that contains the necessary user informantion
//     res.status(200).json(new ApiResponse(400, followerData, 'Fetch follower successfully'))

//   } catch (error) {
//     // logging the error catched by catched block
//     console.log(error)
//     // sending the responsse to the user that there is something wrong in try block
//     return res.status(400).json({message: 'There is something wrong in userFollower try block'})
//   }
// }

// const userFollowings = async (req, res) => {
//   try {
//     // algorithms
//     // 1. Check whether the body is empty or not , if found empty then return a response of empty body found
//     // 2. fetch the userId from the req.body
//     // 3. check whether the userId is successfully fetched from req.body or not, if not found return response of not found
//     // 4. fetch the data based on userId form follwer model as followerID
//     // 5. create a separate array of followed Id
//     // 6. fetch all the data of followed user and send that to the user(frontend)
//     // checking whether the body is empty or not
//     if(!req.body) {
//       return res.status(400).json({message: 'Body is sent empty'})
//     }

//     // fetching the user id from req.body
//     const {userId} = req.body

//     // checking whether the req.body is fetched successfully or not
//     if(!userId) {
//       return res.status(400).json({message: 'userId is undedfined '})
//     }

//     // fetchig all the field where the user is a follower
//     const allFollowedList = await Follower.find({followerID: userId})

//     // fetching all the ids of the user which is follower by this user
//     const allFollowedIds = allFollowedList.map((followed)=> (followed.followedID))

//     // fetching the information from db of the followed user
//     const allFollowedUserPromises = allFollowedIds.map(async (followedUserId) => {
//       return await User.findOne({_id: followedUserId}).select('-password -otp')
//     })

//     // resolving all the promises of the followed user Data
//     const followedUserData = await Promise.all(allFollowedUserPromises)

//     // returning the resolve data
//     res.status(400).json(new ApiResponse(400, followedUserData, 'following sent successfully'))

//   } catch (error) {
//     // logging the error
//     console.log(error)
//     // returning the response to the user that there is something wrong in the try block
//     return res.status(400).json({message: 'There is something wrong the try block code'})
//   }
// }

const userFollowers = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Empty body is sent" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User id is undefind" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(500).json({ message: "Unable to fetch the data" });
    }

    if (user.followers.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "Follower array is empty"));
    }

    const userDataPromises = user.followers.map(async (follower) => {
      return await User.findOne({ _id: follower }).select("-password -otp");
    });

    const userData = await Promise.all(userDataPromises);
    res
      .status(200)
      .json({ data: userData, message: "fetched successfully", toggle: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};
//fetch user followings
const userFollowings = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Empty body is sent" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User id is undefind" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(500).json({ message: "Unable to fetch the data" });
    }

    if (user.following.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No following is available"));
    }

    const userDataPromises = user.following.map(async (following) => {
      return await User.findOne({ _id: following }).select("-password -otp");
    });

    const userData = await Promise.all(userDataPromises);
    res
      .status(200)
      .json({ data: userData, message: "fetched successfully", toggle: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "There is something wrong in try block of user followings",
    });
  }
};

const fetchProfilePicture = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "empty body is sent" });
    }

    const { _id } = req.body;

    const response = await User.findById(_id, { profilePicture: 1 });

    if (!response) {
      res.status(400).json({ message: "Unable to find the user" });
    }
    res.status(200).json({ data: response });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "There is something wrong with fetchProfilePicture code",
    });
  }
};

const fetchNotification = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Empty body is sent" });
    }

    const { recieverID } = req.body;

    if (!recieverID) {
      return res.status(400).json({ message: "recieverID is not found" });
    }

    const notifications = await Notification.find({ recieverID });

    const notificationsDataPromises = notifications.map(
      async (notification) => {
        const senderUserDAta = await User.findOne({
          _id: notification.senderID,
        }).select("-password -otp");
        return {
          notificationID: notification._id,
          ...notification._doc,
          ...senderUserDAta._doc,
        };
      }
    );

    const notificationData = await Promise.all(notificationsDataPromises);

    res.status(200).json({ notificationData });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "there is something wrong with the notificatoin try block",
    });
  }
};

const checkTweetLikes = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Body is empty" });
    }

    const { user, targetType, targetId } = req.body;

    if (!user || !targetType || !targetId) {
      return res
        .status(400)
        .json({ message: "Any one or more fields are empty" });
    }

    const response = await Like.findOne({
      $and: [{ user }, { targetType }, { targetId }],
    });

    if (!response) {
      return res.status(200).json({ Liked: false });
    }

    return res.status(200).json({ Liked: true });
  } catch (error) {
    console.log("Error in cheching the Tweets like");
    return res
      .status(400)
      .json({ message: "Unable to run the code of checkTweetLikes properly" });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const { tweetId } = req.body;

    if (!tweetId) {
      return res.status(400).json({ message: "tweet id is not found" });
    }

    const tweetDeleteResponse = await Tweet.deleteOne({ _id: tweetId });

    if (!tweetDeleteResponse) {
      return res.status(400).json({
        message: "unable to delete the tweet or not found",
        status: false,
      });
    }

    return res.status(200).json({ deleteTweet, status: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "unable to run the code for deleteTweet controller" });
  }
};

// update tweet controller
const updateTweet = async (req, res) => {
  try {
    const { tweetId, content } = req.body;

    const mediaFilePath = req.files.media[0].path;

    if (!tweetId) {
      return res.status(400).json({ message: "TweetId is not found" });
    }

    if (!content || !mediaFilePath) {
      return res
        .status(400)
        .json({ message: "file path and content is missing" });
    }

    const fileUrl = await uploadOnCloudinary(mediaFilePath);

    console.log(fileUrl)
    const tweetUpdateResponse = await Tweet.updateOne(
      { _id: tweetId },
      {
        content,
        media: fileUrl.url,
      },
      { new: true }
    );

    if(!tweetUpdateResponse) {
      return res.status(400).json({message: 'Unable to update the tweet'})
    }

    return res.status(200).json(new ApiResponse(200, tweetUpdateResponse, 'successfully updated the tweet'))
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "unable to run the code for deleteTweet controller" });
  }
};

const fetchSingleTweet = async( req, res) => {
  try {
    const {tweetId} = req.body

    if(!tweetId) {
      return res.status(400).json({message: 'TweetId is not found'})
    }

    const tweetData = await Tweet.findOne({_id: tweetId})

    if(!tweetData) {
      return res.status(400).json({message: 'Tweet is not found in db'})
    }

    return res.status(200).json(new ApiResponse(200, tweetData, 'tweet Fetched successfully'))

  } catch (error) {
    console.log(error)
    return res.status(400).json({message: 'unable to run the fetch single tweet'})
  }
}
export {
  fetchSingleTweet,
  updateTweet,
  deleteTweet,
  postTweet,
  fetchTweet,
  likeTweet,
  fetchLike,
  commentTweet,
  bookmarksTweet,
  fetchAllTweet,
  fetchComment,
  fetchBookmarks,
  followUnfollowUser,
  checkFollwer,
  userFollowers,
  userFollowings,
  fetchProfilePicture,
  fetchNotification,
  checkTweetLikes,
};
