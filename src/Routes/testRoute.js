const express = require('express');
const router = express.Router();
const {getUser} = require('../controllers/register.controller');
const {recoverPassword,validateResetToken,VerifyLogin}=require("../controllers/rutas.controller")
router.get('/', (req, res) => {
    res.send('API is working!');
});

router.post('/addRegister',getUser);
router.post('/Login',VerifyLogin);
router.post('/recoverPassword',recoverPassword);
router.get('/validate/:token', validateResetToken);

module.exports = router;
