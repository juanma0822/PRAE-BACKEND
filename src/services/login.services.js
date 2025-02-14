const { ExistingUser } = require("../models/user.model");

const verifyEmail = async (value) => {
    
    if (!value || !value.email || !value.password) {
        throw new Error("Email y contraseña son requeridos");
    }
    
    if (typeof value.email !== "string" || typeof value.password !== "string") {
        throw new Error("Formato inválido de email o contraseña");
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
        throw new Error("Email no es válido");
    }
    console.log(value.password,232)
    console.log(typeof(value.password))
    const user = await ExistingUser(value.email, "hola");
    console.log(user,343)
    
    if (!user) {
        throw new Error("El email o la contraseña son incorrectos");
    }
    
    return user;
};

module.exports = {
    verifyEmail
};