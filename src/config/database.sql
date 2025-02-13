-- Aquí irá el esquema de la base de datos
CREATE TABLE Usuario (
    documento_identidad VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    institucion VARCHAR(100) NOT NULL
);

CREATE TABLE Profesor (
    documento_identidad VARCHAR(20) PRIMARY KEY REFERENCES Usuario(documento_identidad),
    area_ensenanza VARCHAR(100) NOT NULL
);

CREATE TABLE Curso (
    id_curso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Estudiante (
    documento_identidad VARCHAR(20) PRIMARY KEY REFERENCES Usuario(documento_identidad),
    id_curso INT NOT NULL REFERENCES Curso(id_curso) 
);


CREATE TABLE Comentarios (
    id_comentario SERIAL PRIMARY KEY,
    comentario TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    documento_profe VARCHAR(20),
    documento_estudiante VARCHAR(20),
    FOREIGN KEY (documento_profe) REFERENCES Profesor(documento_identidad),
    FOREIGN KEY (documento_estudiante) REFERENCES Estudiante(documento_identidad)
);

CREATE TABLE Materia (
    id_materia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Dictar(
    id_materiadictada SERIAL PRIMARY KEY,
    documento_profe VARCHAR(20) NOT NULL,
    id_materia INT NOT NULL,
    FOREIGN KEY (documento_profe) REFERENCES Profesor(documento_identidad),
    FOREIGN KEY (id_materia) REFERENCES Materia(id_materia) 
);


CREATE TABLE Actividades (
    id_actividad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    peso INTEGER NOT NULL CHECK (peso > 0 AND peso <= 100),
    activo BOOLEAN DEFAULT TRUE,
    id_materia INT NOT NULL,
    FOREIGN KEY (id_materia) REFERENCES Materia(id_materia) 
);

CREATE TABLE Asignar (
    id_asignacion SERIAL PRIMARY KEY,
    id_curso INT NOT NULL,
    id_materia INT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES Curso(id_curso),
    FOREIGN KEY (id_materia) REFERENCES Materia(id_materia) 
);

CREATE TABLE Calificacion (
    id_calificacion SERIAL PRIMARY KEY,
    id_actividad INT NOT NULL,
    id_estudiante VARCHAR(20) NOT NULL,
    nota DECIMAL(3,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_actividad) REFERENCES Actividades(id_actividad),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiante(documento_identidad)
);