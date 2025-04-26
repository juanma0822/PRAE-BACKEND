const{recoverPassword, validateResetToken, validateToken} =require ("./recoverPassword.controller.js")
const {VerifyLogin} =require ("./login.controller.js"
)
module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin,
    validateToken,
};