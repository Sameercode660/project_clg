import mongoose from "mongoose";

const followerSchema = mongoose.Schema({
    followerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export const Follower = mongoose.model('Follower', followerSchema)