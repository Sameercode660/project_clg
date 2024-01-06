import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)