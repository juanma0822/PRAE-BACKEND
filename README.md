# PRAE - Backend 📚

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
- **Socket.IO** - Comunicación en tiempo real.
- **Puppeteer** - Generación de archivos PDF con contenido HTML.
- **Firebase Admin** - Para integración con Firebase (almacenamiento).
- **Nodemailer** - Envío de correos personalizados.

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
# Puerto de ejecución
PORT=5000

# Base de datos PostgreSQL
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=tu_host
DB_PORT=tu_puerto
DB_DATABASE=tu_nombre_base_datos

# JWT
JWT_SECRET=tu_clave_secreta

# Firebase (reemplazar con tus propias credenciales)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=...
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
FIREBASE_BUCKET=tu_bucket_name

# Nodemailer (correo de salida)
EMAIL_USER=tu_email
EMAIL_PASS=tu_contraseña_app

# Browserless (PDF)
BROWSERLESS_TOKEN=tu_token_browserless

# URL frontend para restablecer contraseña
CLIENT_URL=https://tusitiofrontend.com
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
 ┣ 📂 Routes                # Rutas API organizadas por entidad
 ┣ 📂 Controllers           # Lógica de negocio
 ┣ 📂 Services              # Servicios de apoyo (correo, JWT, etc.)
 ┣ 📂 Models                # Consultas SQL a base de datos
 ┣ 📂 Middlewares           # Middlewares para autenticación, validaciones
 ┣ 📂 sockets               # WebSockets para estadísticas en tiempo real
 ┣ 📂 swagger               # Documentación de API con Swagger
 ┣ 📂 config                # Configuraciones de Firebase, Nodemailer, etc.
 ┣ 📜 server.js             # Punto de entrada del servidor
 ┣ 📜 .env                  # Variables de entorno
 ┗ 📜 README.md             # Documentación
```

---

## ⚙️ Funcionalidades Implementadas

### ✅ CRUD completos
- Usuarios (registro, edición, borrado lógico)
- Cursos y Materias
- Comentarios entre docentes y estudiantes
- Asignación de materias a docentes y cursos
- Actividades evaluativas con peso
- Calificaciones individuales y masivas

### ✅ Autenticación y Seguridad
- JWT para login seguro
- Recuperación de contraseña por correo
- Verificación de token antes de restablecer contraseña

### ✅ Estadísticas en Tiempo Real (WebSocket)
- Emisión de estadísticas dinámicas al docente tras asignar calificaciones
- Canales privados por usuario o curso

### ✅ Generación de Boletines PDF (Puppeteer)
- PDFs institucionales personalizados
- Diseño moderno y adaptable

### ✅ Correos Personalizados (Nodemailer)
- Correos con plantilla HTML para recuperación de clave y notificación de calificaciones
- Incluye logo, colores y pie institucional

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

## 📌 Rutas Principales

| Módulo         | Archivo Ruta                | Funcionalidad Principal                           |
|----------------|-----------------------------|---------------------------------------------------|
| Usuarios       | `/usuario`                  | CRUD de usuarios, validaciones, cambio de clave   |
| Cursos         | `/cursos`                   | Crear, actualizar y listar cursos                 |
| Materias       | `/materias`                 | Gestión de materias por institución               |
| Dictar         | `/dictar`                   | Asignar materias a docentes                       |
| Asignar        | `/asignar`                  | Relación curso-materia-docente                   |
| Actividades    | `/actividad`                | Crear y listar actividades evaluativas            |
| Calificaciones | `/calificacion`             | Asignar y obtener notas de estudiantes            |
| Comentarios    | `/comentarios`              | Crear comentarios entre docente y estudiante      |
| Auth           | `/auth`                     | Login, recuperación de contraseña, validación     |
| Instituciones  | `/instituciones`            | Configuración institucional y logos               |
| Periodos       | `/periodosAcademicos`       | Crear y asignar periodos académicos              |
| Historial      | `/historialGrado`           | Historial académico del estudiante                |
| Estadísticas   | `/estadisticas`             | Estadísticas globales por docente y admin         |
| Boletines      | `/boletines`                | Generación de PDF con notas por periodo           |
| Upload         | `/upload`                   | Subida de logos institucionales a Firebase        |
| Test           | `/test`                     | Ruta auxiliar para pruebas                        |
| Documentación  | `/api-docs`                 | Swagger UI de todas las rutas                     |

---

## 🧪 Swagger

Puedes acceder a la documentación Swagger de toda la API en:  
📍 `http://localhost:5000/api-docs`

Allí se encuentran todos los endpoints con sus parámetros, descripciones, respuestas esperadas y códigos de error.

---

## 🛠 Autores

- **Juan Manuel Valencia Triana**
- **Juan Camilo Henao**
- **Jean Carlo Londoño Neira**
- 📧 Contacto: [juanmanuelva3243@gmail.com]
- 🔗 GitHub: [juanma0822]

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.

---

¡Contribuciones y sugerencias son bienvenidas! 🎉
Si tienes dudas o sugerencias, abre un **issue** en el repositorio.
