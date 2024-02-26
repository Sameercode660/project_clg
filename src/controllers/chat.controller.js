import AsyncHandler from 'express-async-handler'
import { Chat } from '../models/chat.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'


// controller function for creating the chat
const createChat = AsyncHandler(async (req, res)=> {
    try {
        const {senderId, recieverId} = req.body
        
        if(!senderId || !recieverId) {
            return res.status(400).json('senderId or recieverId is missing')
        }
        const isChatExist = await Chat.findOne({$and: [{senderId}, {recieverId}]})

        if(isChatExist) {
            return res.status(200).json({message: 'Chat already created'})
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
    try {

        const {recieverId} = req.body

        if(!recieverId) {
            return res.status(400).json({message: 'recieverId is not found'})
        }

        const chats = await Chat.find({recieverId})

        if(!chats) { 
            return res.status(400).json({message: 'Unable to fetch the chats'})
        }
 
        let chatDataPromises = chats.map(async (chat)=> {
            const user = await User.findOne({_id: chat.senderId}).select("-password -otp")

            return {
                chatId: chat._id,
                userId: user._id,
                ...chat._doc,
                ...user._doc
            }
        })

        let chatData = await Promise.all(chatDataPromises)

    
        res.status(200).json(new ApiResponse(200, chatData, 'chats fetched successfully'))

    } catch (error) {
        console.log(error)
        return res.status(400).json({message: 'There is some wrong in getChat function'})
    }
})
const deleteChat = AsyncHandler(async (req, res)=> {
    try {
        const {chatId} = req.body

        if(!chatId) {
            return res.status(400).json({message: 'chatId is not found'})
        }

        const deleteChat = await Chat.deleteOne({_id: chatId})

        if(!deleteChat) {
            return res.status(400).json({message: 'chat is not found'})
        }

        return res.status(200).json(new ApiResponse(200, deleteChat, 'chat deleted successfully'))
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: 'unable to run the code of deleteChat'})
    }
})

export {
    createChat,
    getChat,
    deleteChat
}