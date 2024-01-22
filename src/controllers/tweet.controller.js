import { Tweet } from "../models/tweet.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const postTweet = async (req, res) => {
    try {
        if(!req.body) {
            res.status(400).json({message: 'Body is empty'})
        }

        const {user, content} = req.body

        if(!user && !content) {
            res.status(400).json({message: 'Please enter some content'})
        }

        const mediaFilePath = req.files.media[0].path
        console.log(mediaFilePath)
        const mediaResponse = await uploadOnCloudinary(mediaFilePath)

        const data = {
            user, 
            content,
            media: mediaResponse.url
        }
        const tweet = await Tweet.create(data)

        if(!tweet) {
            res.status(500).json({message: 'Unable to create tweet'})
        }

        return res.status(200).json(new ApiResponse(200, tweet, 'Successfully Tweeted'))
    } catch (error) {
        console.log(error)

        res.status(500).json({message: 'Internat Server Error'})
    }
}

const fetchTweet = async (req, res) => {
    try {
        if(!req.body) {
            res.status(400).json({message: 'empty body has sent'})
        }

        const {_id:user} = req.body
        
        const tweets = await Tweet.find({user})

        res.status(200).json(new ApiResponse(200, tweets, 'Fetched the tweets successfully'))
    }catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server Error in fetching tweets'})
    }
}
export {
    postTweet,
    fetchTweet
}