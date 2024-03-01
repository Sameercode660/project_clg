import { app } from "./app.js";
import connectDB from "./db/connection.db.js";
import ApiError from "./utils/ApiError.js";
import {Server} from 'socket.io'
import { createServer} from 'http'
const server = createServer(app)

connectDB().then(()=>{
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    })

    io.on('connection', (socket) => {
        console.log('Socket connected successfully')
        socket.on('setup', (userId)=> {
            socket.join(userId)
            console.log(userId)
            socket.emit('connected')
        })

        socket.on('join chat', (room) => {
            socket.join(room)
            console.log('user joined to this ', room)
        })

        socket.on('send message', (message) => {
            io.to(message.chatId).emit('recieve message' , message)
        })
    })

    server.listen(8080, ()=>{
        console.log('The server is listening on PORT 8080')
    })
}).catch((error) => {
    console.log('Error in connecting to the server', error.message )
    throw new ApiError(400, error, 'server connection establishment issue')
})