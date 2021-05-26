const users = []

// addUser, removeUser, getUser, getUsersInRoom

// Add User ------------
const addUser = ( { id, username, room }) => {
    username: username.trim().toLowerCase()
    room: room.trim().toLowerCase()

    // valodate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    // check for existing user 
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    // validate username
    if(existingUser) {
        return {
            error: 'Username is already in use!'
        }
    }

    // stor user
    const user = {id, username, room}
    users.push(user)
    return { user }

}

// Remove User ------------
const removeUser = (id) => {
    // -1 if we did not find any match 
    // 0 or greater if we find
    const index = users.findIndex((user) => {
        return user.id === id
    })

    
    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// Get User ------------
const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

// Get User ------------
const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room === room
    })
}

// addUser({
//     id: 22,
//     username: 'babuibrar',
//     room: 'chat room'
// })

// addUser({
//     id: 23,
//     username: 'ibrarasif',
//     room: 'chat room'
// })

// addUser({
//     id: 24,
//     username: 'babuasif',
//     room: 'chat group'
// })

const getUserFromID = getUser(22)
const getRoomFromRoom = getUsersInRoom('chat group')


// console.log(users)
// console.log(getUserFromID)
// console.log('-----------')
// console.log(getRoomFromRoom)

module.exports = ({
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
})


