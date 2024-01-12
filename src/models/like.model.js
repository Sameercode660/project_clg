import mongoose, {Schema} from "mongoose";

const likesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetType: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        enum: ['Tweet', 'Comment'],
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

}, {timestamps: true})

export const Like = mongoose.model('Like', likesSchema)