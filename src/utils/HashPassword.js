import bcrypt from 'bcrypt'
import ApiError from './ApiError.js'

const passwordHashing = async (password) => {
    try {
        return await bcrypt.hash(password, 10)
    }
     catch (error) {
        throw new ApiError(400, error, 'Unable to generate incrypted password')
    }
}

export {
    passwordHashing
}