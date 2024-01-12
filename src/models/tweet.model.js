import mongoose, {Schema} from 'mongoose'


const tweetSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
      maxlength: 280,
    },
    media: {
      type: String, // url from cloudinary
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    retweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ], // Reference to the Comment model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
export const Tweet = mongoose.model('Tweet', tweetSchema);