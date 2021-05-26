const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { gernerateMessage, geneateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({id: socket.id, username, room})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        // socket.emit, io.emit, socket.braodcast.emit
        // io.to.emit, socket.braodcast.to.emit

        
    socket.emit('message', gernerateMessage('Admin', 'Welcome!'))
    socket.broadcast.to(user.room).emit('message', gernerateMessage('Admin', `${user.username} has joined!`))

    io.to(user.room).emit('roomMembers', {
        room: user.room,
        users: getUsersInRoom(user.room)
    })
    callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const users = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Bad words are not allowed.')
        }

        io.to(users.room).emit('message', gernerateMessage(users.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const users = getUser(socket.id)
        io.to(users.room).emit('locationMessage', geneateLocationMessage(users.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', gernerateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomMembers', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})