const express = require('express');
const pool = require('../db'); 
const router = express.Router();

router.get('/', (req, res) => {
    res.send('API is working!');
});

module.exports = router;
