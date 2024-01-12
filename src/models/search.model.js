import mongoose, {Schema} from "mongoose";


const searchSchema = new Schema({
    query: {
        type: String,
        required: true
    },
    result: [
        {
            type: String,
            itemId: mongoose.Schema.Types.ObjectId
        }
    ]
}, {timestamps: true})

export const Search = mongoose.model('Search', searchSchema)