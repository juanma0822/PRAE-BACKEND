const { saveMessage,getMessages}=require("../models/user.model")

const receiveMessage=async(sender_id,receiver_id,message)=>{
    if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({ error: "Faltan datos" });
      }
 const save = await saveMessage(sender_id, receiver_id, message)
 console.log(save,"entro")
 return save
}

const getMessagesBetweenUsers=async(sender_id, receiver_id)=>{
  if (!sender_id || !receiver_id ) {
    return res.status(400).json({ error: "Faltan datos" })

  }
  const save = await getMessages(sender_id, receiver_id)
 console.log(save,"entro")
 return save
}
module.exports={receiveMessage,getMessagesBetweenUsers}