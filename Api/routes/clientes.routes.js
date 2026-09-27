const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { nombre, categoria, metodoEntrega } = req.query;
    const pool = await poolPromise;
    const request = pool.request();

    request.input('Nombre', sql.NVarChar(100), nombre || null);
    request.input('Categoria', sql.NVarChar(100), categoria || null);
    request.input('MetodoEntrega', sql.NVarChar(100), metodoEntrega || null);

    const result = await request.execute('SP_Clientes_Listar');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar clientes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('CustomerID', sql.VarChar(sql.MAX), req.params.id);

    const result = await request.execute('SP_Clientes_Detalle');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.recordset); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el detalle del cliente' });
  }
});
module.exports = router;