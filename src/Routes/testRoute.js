const express = require('express');
const pool = require('../db'); 
const router = express.Router();
const {getUser} = require('../controllers/register.controller');

router.get('/', (req, res) => {
    res.send('API is working!');
});

router.post('/addRegister',getUser);

module.exports = router;
