const users=[]
const addUser=({id,username,room})=>{
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()
  const existingUser=users.find((user)=>{
    return username===user.username&& room===user.room
  })
  if(existingUser){
    console.log("error");
    return (0)
  }
  else{
      const user={id,username,room}
    users.push(user)
    return user
  }


}
const removeUser=(id)=>{
for(i=0;i<users.length;i++){
  if(users[i].id===id){
    return(users.splice(i,1))



  }
}
return(0)
}


const getUser=(id)=>{
  for(i=0;i<users.length;i++){
    if(users[i].id===id){
      return users[i]
    }
  }
}
const getUsersInRoom=(room)=>{
  const list=users.filter((e)=>{
    return e.room==room
  })
  return(list)
}

module.exports={
  addUser,
  removeUser,
  getUser,
  getUsersInRoom

}
