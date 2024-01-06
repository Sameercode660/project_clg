import mongoose from 'mongoose'
import ApiError from '../utils/ApiError.js'


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1')
        console.log(connectionInstance.connection.host)
    } catch (error) {
        console.log('Problem in connection the DB: ', error)
        throw new ApiError(400, error, 'Problem in connecting the database')
    }
}

export default connectDB