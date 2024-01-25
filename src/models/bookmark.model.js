import mongoose, {Schema} from "mongoose";

const bookmarkSchema = new Schema({
    tweetId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true  
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema)