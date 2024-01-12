import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }, 
    accessToken: {
        type: String, 
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String, 
        required: true,
        unique
    }, 
    userAgent: {
        type: String
    }, 
    refreshTokenExpiresAt: {
        type: Date,
        index: {expireAfterSeconds: 0}
    },
    expiresAt: {
        type: Date,
        index: {expireAfterSeconds: 0}
    }
}, {timestamps: true})

export const Session = mongoose.model('Session', sessionSchema)
  
  