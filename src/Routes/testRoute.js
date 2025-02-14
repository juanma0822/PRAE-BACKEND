const express = require('express');
const pool = require('../db'); 
const router = express.Router();
const {getUser} = require('../controllers/register.controller');
const {VerifyLogin}=require('../controllers/login.controller')

router.get('/', (req, res) => {
    res.send('API is working!');
});

router.post('/addRegister',getUser);
router.post('/Login',VerifyLogin);

module.exports = router;
