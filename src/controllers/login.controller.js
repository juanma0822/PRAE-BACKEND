const {verifyEmail}= require("../services/login.services")

const VerifyLogin = async(req, res)=>{
try{
    const {email,password}=req.body
    console.log(email,password)
    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }
    
    const user = await verifyEmail({email, password});
    res.status(200).json({ message: "Login exitoso", user });
} catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || "Error en la autenticación" });
}
};

module.exports = {
VerifyLogin
};