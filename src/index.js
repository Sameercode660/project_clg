import { app } from "./app.js";
import connectDB from "./db/connection.db.js";
import ApiError from "./utils/ApiError.js";

connectDB().then(()=>{
    app.listen(8080, ()=>{
        console.log('The server is listening on PORT 8080')
    })
}).catch((error) => {
    console.log('Error in connecting to the server', error.message )
    throw new ApiError(400, error, 'server connection establishment issue')
})