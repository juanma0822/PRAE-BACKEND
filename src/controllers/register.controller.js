const userService = require('../services/register.service');

const getUser= async(req,res) =>{
    try {
        const {email,password} = req.body;
        const sendInfo = await userService.addUser(email);
        res.status(200).json(sendInfo);
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error');
    }
}

module.exports = {getUser}