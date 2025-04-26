const{recoverPassword, validateResetToken} =require ("./recoverPassword.controller.js")
const {VerifyLogin} =require ("./login.controller.js"
)
module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin
};