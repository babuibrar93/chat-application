const socket = io()

// Elements --------------
const $chatForm = document.querySelector('form')
const $input = $chatForm.querySelector('input')
const $button = $chatForm.querySelector('button')

const $sendLocation = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')
// Location to render the messageTemplate
const $location = document.querySelector('#send-location')
const $locationMessage = document.querySelector('#location')

// Message template ---------
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// Sidebar template 
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options ---------
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
}) 

socket.on('locationMessage', (locationURL) => {
    const html = Mustache.render(locationTemplate, {
        username: locationURL.username,
        locationURL: locationURL.url,
        createdAt: moment(locationURL.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomMembers', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disable
    $button.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $button.removeAttribute('disabled')
        $input.value = ''
        $input.focus()

        if(error){ 
            return console.log(error)
        }
        console.log('Message has been sent!')
    })
})

$location.addEventListener(('click'), () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    // disabled 
    $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(('sendLocation'), {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            
            $sendLocation.removeAttribute('disabled')
            console.log('Location is shared.')
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})