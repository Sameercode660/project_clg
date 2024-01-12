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
    },
    profilePicture: {
        type: String // cloudinary url
    },
    coverImage: {
        type: String // cloudinary url
    },
    bio: {
        type: String 
    }, 
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)