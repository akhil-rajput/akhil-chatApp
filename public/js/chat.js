const socket=io()
const $messages = document.querySelector('#messages')
document.querySelector('input').focus()
socket.on('location-msg',(url)=>{
  const html=Mustache.render(document.querySelector('#location-template').innerHTML,{
    username:url.username,
    url:url.text,
    createdAt:moment(url.createdAt).format('h:mm a')
  })
  document.querySelector('#messages').insertAdjacentHTML('beforeend',html)
  autoscroll()

})


socket.on('message',(message)=>{
  const html=Mustache.render(document.querySelector('#message-template').innerHTML,{
    username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  document.querySelector('#messages').insertAdjacentHTML('beforeend',html)
  autoscroll()
})
socket.on('roomData',({room,users})=>{
  const html=Mustache.render(document.querySelector('#sidebar-template').innerHTML,{
    room,
    users
  }
)
    document.querySelector('#sidebar').innerHTML=html
})


document.querySelector('#message-form').addEventListener('submit',(e)=>{
  e.preventDefault()
   elements=document.querySelector('input').value
  document.querySelector('#message-form').reset()
  socket.emit('message',elements)
})
document.querySelector('#send-location').addEventListener('click',()=>{
  document.querySelector('#send-location').setAttribute('disabled','disabled')

  if(!navigator.geolocation){
    return alert('geolocation is not supported by browser')
  }
  else{
    navigator.geolocation.getCurrentPosition((position)=>{

      socket.emit('sendLocation',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
      })
    })

  }
  setTimeout(()=>{
    document.querySelector('#send-location').removeAttribute('disabled')

  },1500)

})

const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.emit('join',{username,room},(error)=>{
  alert(error)
  location.href='/'
})
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
