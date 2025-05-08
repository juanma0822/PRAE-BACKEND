const cron = require('node-cron');
const { consultarDB } = require('../db'); // Asegúrate de tener una función de consulta de DB

// Función para actualizar el estado del periodo para todas las instituciones
const actualizarPeriodoActivo = async () => {
  try {
    // Primero, obtenemos todos los id_institucion
    const institucionesQuery = `
      SELECT id_institucion 
      FROM Institucion 
      WHERE estado = TRUE;
    `;

    const instituciones = await consultarDB(institucionesQuery);

    // Iteramos sobre cada institución
    for (let institucion of instituciones) {
      const id_institucion = institucion.id_institucion;

      // Desactivar todos los periodos de la institución
      const deactivateQuery = `
        UPDATE PeriodoAcademico
        SET estado = FALSE
        WHERE id_institucion = $1;
      `;
      await consultarDB(deactivateQuery, [id_institucion]);

      // Activar el periodo correspondiente basado en las fechas
      const activateQuery = `
        UPDATE PeriodoAcademico
        SET estado = TRUE
        WHERE id_institucion = $1
          AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin;
      `;
      await consultarDB(activateQuery, [id_institucion]);

      console.log(`Periodo actualizado para la institución con id ${id_institucion}`);
    }
  } catch (error) {
    console.error("Error al actualizar los periodos:", error);
  }
};

// Configurar el cron job para que se ejecute diariamente a medianoche
cron.schedule('0 0 * * *', () => {
  console.log("Ejecutando tarea programada para actualizar los periodos activos de todas las instituciones...");
  actualizarPeriodoActivo(); // Llama a la función de actualización
});
