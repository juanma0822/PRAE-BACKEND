const { ExistingUser } = require("../models/usuario.model");

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

    const user = await ExistingUser(value.email,value.password);
    
    
    if (!user) {
        throw new Error("El email o la contraseña son incorrectos");
    }
    
    return user;
};

module.exports = {
    verifyEmail
};