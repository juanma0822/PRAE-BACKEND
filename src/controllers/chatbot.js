const { receiveMessage } = require("../services/chatbot.service");
const { getIo } = require("../sockets/sockets");
const { getMessagesBetweenUsers } = require("../services/chatbot.service"); 

const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    console.log(sender_id, receiver_id, message);

    const savedMessage = await receiveMessage(sender_id, receiver_id, message);
    console.log(savedMessage, 11111);

    const io = getIo();
    io.to(receiver_id.toString()).emit("newMessage", savedMessage);

    res.json(savedMessage);
  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).json({ error: "Error al procesar mensaje" });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;

    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const messages = await getMessagesBetweenUsers(sender_id, receiver_id);
    res.json(messages);
  } catch (error) {
    console.error("Error en get messages:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

module.exports = { sendMessage,getChatHistory };
