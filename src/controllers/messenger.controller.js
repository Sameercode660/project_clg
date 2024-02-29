import asyncHandler from 'express-async-handler'
import {User} from '../models/user.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import { Message } from '../models/message.model.js'

const userInfoForChat = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.body

        if(!userId) {
            return res.status(400).json({message: 'userId is not found'})
        }

        const user = await User.findOne({_id: userId}).select("-password -otp")

        if(!user) {
            return res.status(401).json({message: 'User does not found in db'})
        }

        res.status(200).json(new ApiResponse(200, user, 'user successfully fetched'))
    } catch (error) {
        return res.status(400).json({message: 'Unable to run the code of userInfoForChat'})
    }
})


const sendMessage = asyncHandler(async (req, res) => {
    try {
        const {chatId, senderId, recieverId, message} = req.body

        if(!chatId || !senderId || !recieverId || !message) {
            return res.status(400).json({message: 'Any one or more fields are empty'})
        }

        const messageResponse = await Message.create({chatId, senderId, recieverId, message})

        if(!messageResponse) {
            return res.status(500).json({message: 'Internal server Error: Unable to create the message'})
        }

        res.status(200).json(new ApiResponse(200, messageResponse, 'Message successfully created'))

    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Unable to run the code of sendMessage'})
    }
})

const getMessage = asyncHandler(async (req, res) => {
    try {
        const {chatId} = req.body

        if(!chatId) {
            return res.status(400).json({message: 'Chat is not found' })
        }

        const messages = await Message.find({chatId}).populate('senderId', 'fullName profilePicture ')

        if(!messages) {
            return res.status(200).json(new ApiResponse(200, [], 'messages are not found'))
        }

        return res.status(200).json(new ApiResponse(200, messages, 'messages are fetched successfully'))

    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Unable to run the code of getMessage'})
    }
})

const deleteMessage = asyncHandler(async (req, res) => {
    try {
        const {messageId} = req.body

        if(!messageId) {
            return res.status(400).json({message: 'message Id is not found'})
        }

        const response = await Message.deleteOne({_id: messageId})

        if(!response) {
            return res.status(500).json({message: 'internal server error: unable to delete the message'})
        }

        return res.status(200).json(new ApiResponse(200, response, 'message Deleted successfully'))  
              
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Unable to run the code of delete Message'})
    }
})
export {
    userInfoForChat,
    sendMessage, 
    getMessage,
    deleteMessage
}