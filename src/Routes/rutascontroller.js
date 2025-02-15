const{recoverPassword,validateResetToken} =require ("../controllers/recoverPssword.controller.js")
const {VerifyLogin} =require ("../controllers/login.controller.js"
)
module.exports = {
    recoverPassword,
    validateResetToken,
    VerifyLogin
};