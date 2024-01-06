class ApiError {
    constructor(statusCode, error, message)
    {
        this.statusCode = statusCode
        this.error = error
        this.message = message
    }
}

export default ApiError