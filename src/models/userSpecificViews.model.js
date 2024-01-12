import mongoose, {Schema} from "mongoose";

const userSpecificViews = new Schema({
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

export const UserSpecificView = mongoose.model('UserSpecificView', userSpecificViews)