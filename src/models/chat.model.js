import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export const Chat = mongoose.model('Chat', chatSchema)