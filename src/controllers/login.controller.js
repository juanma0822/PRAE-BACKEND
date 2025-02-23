const {verifyEmail}= require("../services/login.services")
const jwt = require("jsonwebtoken");
const VerifyLogin = async(req, res)=>{
try{
    const {email,password}=req.body
    console.log(email,password)
    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }
    
    const user = await verifyEmail({email, password});
    
    const token = jwt.sign(
        { email: user.correo, id: user.documento_identidad,rol:user.rol }, 
        "juanmateton", 
        { expiresIn: "2h" }
    );
    console.log(token)
    res.status(200).json({ message: "Login exitoso", token });
} catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || "Error en la autenticación" });
}
};

module.exports = {
VerifyLogin
};