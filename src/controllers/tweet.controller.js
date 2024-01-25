import { Tweet } from "../models/tweet.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Bookmark } from "../models/bookmark.model.js";
import { User } from "../models/user.model.js";

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
    const response = await Like.create(data);
    await Tweet.updateOne(
      { _id: targetType },
      {$push : {likes: user}, $set: {}},
      {new: true}
      );

    res.status(200).json(new ApiResponse(200, response, "Like successfully"));
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

    const { user, content } = req.body;

    const data = {
      user,
      content,
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

export {
  postTweet,
  fetchTweet,
  likeTweet,
  fetchLike,
  commentTweet,
  bookmarksTweet,
  fetchAllTweet,
};
