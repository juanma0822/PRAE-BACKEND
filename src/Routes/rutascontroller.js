const{recoverPassword,validateResetToken} =require ("../controllers/recoverPssword.controller.js")
const {VerifyLogin} =require ("../controllers/login.controller.js")
const { sendMessage,getChatHistory}=require("../controllers/chatbot.js")

module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin,
    sendMessage,
    getChatHistory
};