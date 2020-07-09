const express=require("express")
const app=express();
const path=require('path')
app.set('view engine','ejs');
const port=process.env.PORT||3000
const root=path.join(__dirname,'../public')
app.use(express.static(root));
const socketIO=require('socket.io')
const http=require('http')
const server=http.createServer(app)
const io=socketIO(server)
const {message}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
let count=0

server.listen(port,()=>{
  console.log('server running on port 3000');
})

io.on('connection',(socket)=>{

  socket.on('join',({username,room},callback)=>{
    const user=addUser({id:socket.id,username,room})
    if(!user){
      callback("Username is in use! Try again with another username")
    }
    else{
      socket.join(user.room)
      socket.emit('message',message('Welcome!','Admin'))
      socket.broadcast.to(user.room).emit('message',message(user.username+" has joined",'Admin'))
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })

    }

  })
  /*
  google map key-AIzaSyDRgLDaZ2OhFw36hZr25Tb6kr9TlYq6eiw
  socket.emit('countUpdated',count)
  socket.on('increment',()=>{
    count++
    socket.emit('countUpdated',count)
  })*/
  socket.on('message',(msg)=>{
      const user=getUser(socket.id)

      io.to(user.room).emit('message',message(msg,user.username))

  })

   socket.on('disconnect',()=>{
     const user=removeUser(socket.id)
     if(!user){
       return
     }
    socket.broadcast.to(user[0].room).emit('message',message(user[0].username+"  has left",'Admin'))
    io.to(user[0].room).emit('roomData',{
      room:user[0].room,
      users:getUsersInRoom(user[0].room)
    })

  })
  socket.on('sendLocation',(pos)=>{
    const user=getUser(socket.id)
    io.to(user.room).emit('location-msg',message('https://google.com/maps?q='+pos.latitude+','+pos.longitude,user.username))
  })


})
