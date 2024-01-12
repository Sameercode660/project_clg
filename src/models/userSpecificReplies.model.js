import mongoose, {Schema} from "mongoose";

const userSpecificReplies = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        require: true
    }
}, {timestamps: true})