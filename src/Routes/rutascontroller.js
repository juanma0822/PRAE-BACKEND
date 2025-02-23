const{recoverPassword, validateResetToken } =require ("../controllers/recoverPssword.controller.js")
const {VerifyLogin} =require ("../controllers/login.controller.js")
const { sendMessage,getChatHistory}=require("../controllers/chatbot.js")
const {generatePdf}=require("../controllers/generatePdf.controller.js")
const {NotesBySubject}=require("../controllers/notes.controller.js")
module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin,
    sendMessage,
    getChatHistory,
    generatePdf,
    NotesBySubject

};