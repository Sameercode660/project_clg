import mongoose, {Schema} from "mongoose";

const userSpecificLikes = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    }

}, {timestamps: true})

export const UserSpecificLike = mongoose.model('UserSpecificLike', userSpecificLikes)