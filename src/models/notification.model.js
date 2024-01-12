import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recieverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    notificationType: {
        type: String,
        required: true,
      },
      content: {
        type: String, // Additional information or message associated with the notification
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: Boolean,
        default: false
      }
}, {timestamps: true})

export const Notification = mongoose.model('Notification', notificationSchema)