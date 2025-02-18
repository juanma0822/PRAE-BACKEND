const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS fecha_actual');
        res.status(200).json({
            mensaje: 'Conexión exitosa con Aiven 🎯',
            fecha_actual: result.rows[0].fecha_actual
        });
    } catch (error) {
        console.error('Error al probar conexión:', error);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
});

module.exports = router;
