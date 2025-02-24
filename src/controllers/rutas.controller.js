const{recoverPassword,validateResetToken} =require ("./recoverPssword.controller.js")
const {VerifyLogin} =require ("./login.controller.js"
)
module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin
};