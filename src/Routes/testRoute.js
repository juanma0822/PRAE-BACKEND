const express = require('express');
const pool = require('../db'); 
const router = express.Router();
const {getUser} = require('../controllers/register.controller');
const {recoverPassword,validateResetToken,VerifyLogin,sendMessage,getChatHistory}=require("./rutascontroller")
router.get('/', (req, res) => {
    res.send('API is working!');
});

router.post('/addRegister',getUser);
router.post('/Login',VerifyLogin);
router.post('/chat',sendMessage)
router.get("/chat/:sender_id/:receiver_id", getChatHistory)
router.post('/recoverPassword',recoverPassword);
router.get('/validate/:token', validateResetToken);
module.exports = router;
