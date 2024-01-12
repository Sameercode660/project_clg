import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
      lowercase: true, // Store hashtags in lowercase to ensure case-insensitive uniqueness
    },
    tweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
      },
    ],
  });
  
  const Hashtag = mongoose.model('Hashtag', hashtagSchema);