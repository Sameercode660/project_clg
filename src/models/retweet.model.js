import mongoose, {Schema} from "mongoose";

const retweetSchema = new Schema({
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

export const  Retweet = mongoose.model('Retweet', retweetSchema)