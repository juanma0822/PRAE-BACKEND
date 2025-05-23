# Usa una imagen oficial de Node.js ligera
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (o yarn.lock si usas yarn)
COPY package*.json ./

# Instalar dependencias solo de producción para optimizar imagen
RUN npm install --production

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto donde escucha tu app (5000 por tu index.js)
EXPOSE 5000

# Comando para iniciar el servidor (ajusta si tu archivo principal es otro)
CMD ["node", "src/index.js"]
