# PRAE - Backend

Backend de la aplicación web **PRAE (Plataforma de Registro Académico Estudiantil)**.  
Este servicio gestiona usuarios, cursos, materias, actividades y calificaciones, permitiendo la autenticación y administración de datos académicos.

---

## 🚀 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución para JavaScript.
- **Express.js** - Framework para manejar rutas y middleware.
- **PostgreSQL** - Base de datos relacional.
- **pg** - Cliente de PostgreSQL para Node.js.
- **CORS** - Middleware para manejo de seguridad en solicitudes HTTP.
- **bcrypt** - Para encriptación de contraseñas.
- **jsonwebtoken (JWT)** - Para autenticación basada en tokens.

---

## 📌 Instalación y Configuración

### **1️⃣ Clonar el repositorio**
```sh
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

### **2️⃣ Instalar dependencias**
```sh
npm install
```

### **3️⃣ Configurar variables de entorno**
Crear un archivo **.env** en la raíz del proyecto con los siguientes valores:

```env
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=prae_db
JWT_SECRET=clave_secreta
```

### **4️⃣ Ejecutar el servidor**
```sh
npm start
```
> El servidor se ejecutará en `http://localhost:5000/`.

---

## 📂 Estructura del Proyecto

```
📦 backend
 ┣ 📂 node_modules
 ┣ 📂 src
 ┃ ┣ 📂 config
 ┃ ┃ ┗ database.js  # Configuración de PostgreSQL
 ┃ ┣ 📂 middleware
 ┃ ┃ ┗ auth.js      # Middleware de autenticación JWT
 ┃ ┣ 📂 models
 ┃ ┃ ┗ user.model.js # Modelo de usuario
 ┃ ┣ 📂 routes
 ┃ ┃ ┗ auth.routes.js # (Pendiente) Rutas de autenticación
 ┃ ┣ server.js       # Archivo principal
 ┣ .env              # Variables de entorno
 ┣ .gitignore        # Archivos ignorados en Git
 ┣ package.json      # Dependencias del proyecto
 ┗ README.md         # Documentación del proyecto
```

---

## 🔐 Autenticación con JWT

El backend utiliza **JSON Web Tokens (JWT)** para la autenticación de usuarios.  
Para generar un token, se debe iniciar sesión con un usuario válido.

### **📌 Ejemplo de Token**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```
> Este token debe enviarse en el **header** de cada petición protegida con `Authorization: Bearer <token>`.

---

## ⚡ Endpoints (Pendientes de Implementar)

### **Autenticación**
| Método | Ruta        | Descripción |
|--------|------------|-------------|
| POST   | `/api/auth/register` | Registro de usuario |
| POST   | `/api/auth/login` | Inicio de sesión |

### **Usuarios**
| Método | Ruta        | Descripción |
|--------|------------|-------------|
| GET    | `/api/users` | Obtener todos los usuarios |
| GET    | `/api/users/:id` | Obtener un usuario por ID |
| PUT    | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Desactivar usuario (borrado lógico) |

### **Cursos**
| Método | Ruta        | Descripción |
|--------|------------|-------------|
| GET    | `/api/cursos` | Obtener todos los cursos |
| POST   | `/api/cursos` | Crear un nuevo curso |
| PUT    | `/api/cursos/:id` | Actualizar curso |
| DELETE | `/api/cursos/:id` | Desactivar curso (borrado lógico) |

### **Materias**
| Método | Ruta        | Descripción |
|--------|------------|-------------|
| GET    | `/api/materias` | Obtener todas las materias |
| POST   | `/api/materias` | Crear una nueva materia |
| PUT    | `/api/materias/:id` | Actualizar materia |
| DELETE | `/api/materias/:id` | Desactivar materia (borrado lógico) |

---

## ✨ Próximos Pasos

✅ **Base del proyecto configurada**  
🔜 Implementación de modelos y rutas CRUD para usuarios, cursos y materias  
🔜 Creación de autenticación JWT  
🔜 Middleware para validación de roles  

¡Contribuciones y sugerencias son bienvenidas! 🎉  
Si tienes dudas o sugerencias, abre un **issue** en el repositorio.  

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.  

---

## 🛠 Autores

- **[Juan Manuel Valencia Triana]**
- **[Juan Camilo Henao]**
- **[Esteban Castro]**
- **[Jean Carlo Londoño Neira]**
- **[Julian Castro]**
- **[Jhon Rodas]**  
- 📧 Contacto: [juanmanuelva3243@gmail.com]  
- 🔗 GitHub: [juanma0822]  

---
```
