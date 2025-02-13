const models = require('../models/user.model');

const addUser= async(email) =>{
    const verifyEmail = await models.ExistingUser(email);
    return verifyEmail;
}

module.exports = {
    addUser
}