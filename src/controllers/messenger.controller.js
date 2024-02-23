import asyncHandler from 'express-async-handler'
import {User} from '../models/user.model.js'
import ApiResponse from '../utils/ApiResponse.js'

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

export {userInfoForChat}