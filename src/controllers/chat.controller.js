import AsyncHandler from 'express-async-handler'
import { Chat } from '../models/chat.model.js'
import ApiResponse from '../utils/ApiResponse.js'


// controller function for creating the chat
const createChat = AsyncHandler(async (req, res)=> {
    try {
        const {senderId, recieverId} = req.body
        
        if(!senderId || !recieverId) {
            return res.status(400).json('senderId or recieverId is missing')
        }

        const response = await Chat.create({senderId, recieverId})

        if(!response) {
            return res.status(500).json({message: 'Internal Server error unable to create the chat'})
        }
        res.status(200).json(new ApiResponse(200, response, 'chat created successfully'))
    } catch (error) {
        return res.status(400).json({message: 'Unable to create the chat for the user'})
    }
})
const getChat = AsyncHandler(async (req, res)=> {
    
})
const deleteChat = AsyncHandler(async (req, res)=> {})

export {
    createChat,
    getChat,
    deleteChat
}