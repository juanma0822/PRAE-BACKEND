-- ====================================
-- Esquema de Base de Datos para PRAE
-- ====================================

-- 1. Tabla Institucion
CREATE TABLE Institucion (
    id_institucion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    telefono TEXT,
    instagram TEXT,
    facebook TEXT,
    direccion TEXT NULL
    logo TEXT,  
    color_principal VARCHAR(10) NOT NULL DEFAULT '#157AFE',
    color_secundario VARCHAR(10) NOT NULL DEFAULT '#F5F7F9',
    fondo VARCHAR(10) NOT NULL DEFAULT '#FFFFFF',
    color_pildora1 VARCHAR(10) NOT NULL DEFAULT '#157AFE',
    color_pildora2 VARCHAR(10) NOT NULL DEFAULT '#4946E2',
    color_pildora3 VARCHAR(10) NOT NULL DEFAULT '#EF9131',
    estado BOOLEAN DEFAULT TRUE
);

-- 2. Tabla Usuario
CREATE TABLE Usuario (
    documento_identidad VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    id_institucion INT,
    color VARCHAR(50) DEFAULT 'azul',
    CONSTRAINT fk_usuario_institucion FOREIGN KEY (id_institucion)
        REFERENCES Institucion(id_institucion)
        ON DELETE SET NULL
);

-- 3. Tabla Profesor
CREATE TABLE Profesor (
    documento_identidad VARCHAR(20) PRIMARY KEY,
    area_ensenanza VARCHAR(100) NOT NULL,
    CONSTRAINT fk_profesor_usuario FOREIGN KEY (documento_identidad)
        REFERENCES Usuario(documento_identidad)
        ON DELETE CASCADE
);

-- 4. Tabla Curso
CREATE TABLE Curso (
    id_curso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    color VARCHAR(20) NOT NULL DEFAULT 'azul',
    id_institucion INT NOT NULL,
    CONSTRAINT fk_curso_institucion FOREIGN KEY (id_institucion)
        REFERENCES Institucion(id_institucion)
        ON DELETE CASCADE
);

-- 5. Tabla Estudiante
CREATE TABLE Estudiante (
    documento_identidad VARCHAR(20) PRIMARY KEY,
    id_curso INT NOT NULL,
    CONSTRAINT fk_estudiante_usuario FOREIGN KEY (documento_identidad)
        REFERENCES Usuario(documento_identidad)
        ON DELETE CASCADE,
    CONSTRAINT fk_estudiante_curso FOREIGN KEY (id_curso)
        REFERENCES Curso(id_curso)
        ON DELETE SET NULL
);

-- 6. Tabla Comentarios
CREATE TABLE Comentarios (
    id_comentario SERIAL PRIMARY KEY,
    comentario TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    documento_profe VARCHAR(20),
    documento_estudiante VARCHAR(20),
    CONSTRAINT fk_comentario_profesor FOREIGN KEY (documento_profe)
        REFERENCES Profesor(documento_identidad)
        ON DELETE SET NULL,
    CONSTRAINT fk_comentario_estudiante FOREIGN KEY (documento_estudiante)
        REFERENCES Estudiante(documento_identidad)
        ON DELETE CASCADE
);

-- 7. Tabla Materia
CREATE TABLE Materia (
    id_materia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    color VARCHAR(20) NOT NULL DEFAULT 'azul',
    id_institucion INT NOT NULL,
    CONSTRAINT fk_curso_institucion FOREIGN KEY (id_institucion)
        REFERENCES Institucion(id_institucion)
        ON DELETE CASCADE
);

-- 8. Tabla Dictar (Asignación de Materia a Profesor)
CREATE TABLE Dictar (
    id_materiadictada SERIAL PRIMARY KEY,
    documento_profe VARCHAR(20) NOT NULL,
    id_materia INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_dictar_profesor FOREIGN KEY (documento_profe)
        REFERENCES Profesor(documento_identidad)
        ON DELETE CASCADE,
    CONSTRAINT fk_dictar_materia FOREIGN KEY (id_materia)
        REFERENCES Materia(id_materia)
        ON DELETE CASCADE
);

-- 9. Tabla Actividades
CREATE TABLE Actividades (
    id_actividad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    peso INTEGER NOT NULL CHECK (peso > 0 AND peso <= 100),
    activo BOOLEAN DEFAULT TRUE,
    id_materia INT NOT NULL,
    CONSTRAINT fk_actividad_materia FOREIGN KEY (id_materia)
        REFERENCES Materia(id_materia)
        ON DELETE CASCADE
);

-- 10. Tabla Asignar (Asignación de Materia a Curso)
CREATE TABLE Asignar (
    id_asignar SERIAL PRIMARY KEY,
    id_materia INT NOT NULL,
    id_grado INT NOT NULL,
    id_docente VARCHAR(20), -- Nueva columna para almacenar el ID del profesor
    CONSTRAINT fk_asignar_materia FOREIGN KEY (id_materia) 
        REFERENCES Materia(id_materia) 
        ON DELETE CASCADE,
    CONSTRAINT fk_asignar_grado FOREIGN KEY (id_grado) 
        REFERENCES Grado(id_grado) 
        ON DELETE CASCADE,
    CONSTRAINT fk_asignar_profesor FOREIGN KEY (id_docente) 
        REFERENCES Profesor(documento_identidad) 
        ON DELETE SET NULL
);


-- 11. Tabla Calificacion
CREATE TABLE Calificacion (
    id_calificacion SERIAL PRIMARY KEY,
    id_actividad INT NOT NULL,
    id_estudiante VARCHAR(20) NOT NULL,
    nota DECIMAL(3,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_calificacion_actividad FOREIGN KEY (id_actividad)
        REFERENCES Actividades(id_actividad)
        ON DELETE CASCADE,
    CONSTRAINT fk_calificacion_estudiante FOREIGN KEY (id_estudiante)
        REFERENCES Estudiante(documento_identidad)
        ON DELETE CASCADE
);

-- 12. Tabla PeriodoAcademico
CREATE TABLE PeriodoAcademico (
    id_periodo SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    peso DECIMAL(5,2) CHECK (peso > 0 AND peso <= 100),
    id_institucion INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_periodo_institucion FOREIGN KEY (id_institucion)
        REFERENCES Institucion(id_institucion)
        ON DELETE CASCADE
);

-- 13. Tabla HistorialGrado
CREATE TABLE HistorialGrado (
    id_historial SERIAL PRIMARY KEY,
    id_estudiante VARCHAR(20) NOT NULL,
    id_curso INT NOT NULL,
    id_periodo INT NOT NULL,
    anio INT NOT NULL,  -- Año en que se cursó este grado
    estado BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_historial_estudiante FOREIGN KEY (id_estudiante)
        REFERENCES Estudiante(documento_identidad)
        ON DELETE CASCADE,
    CONSTRAINT fk_historial_curso FOREIGN KEY (id_curso)
        REFERENCES Curso(id_curso)
        ON DELETE CASCADE,
    CONSTRAINT fk_historial_periodo FOREIGN KEY (id_periodo)
        REFERENCES PeriodoAcademico(id_periodo)
        ON DELETE CASCADE
);

-- ====================================
-- Fin del esquema de Base de Datos
-- ====================================
