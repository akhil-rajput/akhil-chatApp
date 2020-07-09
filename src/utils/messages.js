const message=(text,username)=>{
  return {
    username:username,
    text:text,
    createdAt:new Date()
  }
}
module.exports={
  message
}
