const{recoverPassword, validateResetToken } =require ("./recoverPassword.controller.js")
const {VerifyLogin} =require ("./login.controller.js")
const { sendMessage,getChatHistory}=require("./chatbot.js")
const {generatePdf}=require("./generatePdf.controller.js")
const {NotesBySubject}=require("./notes.controller.js")
module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin,
    sendMessage,
    getChatHistory,
    generatePdf,
    NotesBySubject

};