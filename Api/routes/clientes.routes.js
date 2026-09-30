const express = require('express');

const router = express.Router();

const { sql, poolPromise } = require('../db');


// =========================================================
// 1. LISTAR CLIENTES
// GET /api/clientes
// GET /api/clientes?nombre=ABC&categoria=Minorista
// =========================================================

router.get('/', async (req, res) => {

    try {

        const {
            nombre,
            categoria,
            metodoEntrega
        } = req.query;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'Nombre',
            sql.NVarChar(100),
            nombre || null
        );

        request.input(
            'Categoria',
            sql.NVarChar(100),
            categoria || null
        );

        request.input(
            'MetodoEntrega',
            sql.NVarChar(100),
            metodoEntrega || null
        );

        const result = await request.execute(
            'SP_Clientes_Listar'
        );

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al listar clientes'
        });
    }

});


// =========================================================
// 2. DETALLE DE UNO O VARIOS CLIENTES
// GET /api/clientes/1
// GET /api/clientes/1,2,3
// =========================================================

router.get('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'CustomerID',
            sql.NVarChar(sql.MAX),
            req.params.id
        );

        const result = await request.execute(
            'SP_Clientes_Detalle'
        );

        if (result.recordset.length === 0) {

            return res.status(404).json({
                error: 'Cliente no encontrado'
            });

        }

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener el detalle del cliente'
        });
    }

});


// =========================================================
// 3. INSERTAR CLIENTE
// POST /api/clientes
// =========================================================

router.post('/', async (req, res) => {

    try {

        const {
            Nombre,
            CategoriaID,
            GrupoCompraID,
            ContactoPrimarioID,
            ContactoAlternativoID,
            ClienteFacturarID,
            MetodoEntregaID,
            CiudadEntregaID,
            LimiteCredito,
            Descuento,
            DiasGracia,
            Telefono,
            Fax,
            SitioWeb,
            DireccionEntrega1,
            DireccionEntrega2,
            CodigoPostal,
            DireccionPostal1,
            DireccionPostal2,
            UsuarioID
        } = req.body;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'Nombre',
            sql.NVarChar(100),
            Nombre
        );

        request.input(
            'CategoriaID',
            sql.Int,
            CategoriaID
        );

        request.input(
            'GrupoCompraID',
            sql.Int,
            GrupoCompraID ?? null
        );

        request.input(
            'ContactoPrimarioID',
            sql.Int,
            ContactoPrimarioID
        );

        request.input(
            'ContactoAlternativoID',
            sql.Int,
            ContactoAlternativoID ?? null
        );

        request.input(
            'ClienteFacturarID',
            sql.Int,
            ClienteFacturarID ?? null
        );

        request.input(
            'MetodoEntregaID',
            sql.Int,
            MetodoEntregaID
        );

        request.input(
            'CiudadEntregaID',
            sql.Int,
            CiudadEntregaID
        );

        request.input(
            'LimiteCredito',
            sql.Decimal(18, 2),
            LimiteCredito ?? null
        );

        request.input(
            'Descuento',
            sql.Decimal(18, 3),
            Descuento ?? 0
        );

        request.input(
            'DiasGracia',
            sql.Int,
            DiasGracia ?? 7
        );

        request.input(
            'Telefono',
            sql.NVarChar(20),
            Telefono
        );

        request.input(
            'Fax',
            sql.NVarChar(20),
            Fax ?? ''
        );

        request.input(
            'SitioWeb',
            sql.NVarChar(256),
            SitioWeb ?? ''
        );

        request.input(
            'DireccionEntrega1',
            sql.NVarChar(60),
            DireccionEntrega1
        );

        request.input(
            'DireccionEntrega2',
            sql.NVarChar(60),
            DireccionEntrega2 ?? null
        );

        request.input(
            'CodigoPostal',
            sql.NVarChar(10),
            CodigoPostal
        );

        request.input(
            'DireccionPostal1',
            sql.NVarChar(60),
            DireccionPostal1
        );

        request.input(
            'DireccionPostal2',
            sql.NVarChar(60),
            DireccionPostal2 ?? null
        );

        request.input(
            'UsuarioID',
            sql.Int,
            UsuarioID ?? 1
        );

        const result = await request.execute(
            'SP_Clientes_Insertar'
        );

        res.status(201).json({
            mensaje: 'Cliente creado correctamente',
            cliente: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }

});


// =========================================================
// 4. ACTUALIZAR CLIENTE
// PUT /api/clientes/:id
// =========================================================

router.put('/:id', async (req, res) => {

    try {

        const {
            Nombre,
            CategoriaID,
            GrupoCompraID,
            ContactoPrimarioID,
            ContactoAlternativoID,
            ClienteFacturarID,
            MetodoEntregaID,
            CiudadEntregaID,
            LimiteCredito,
            Descuento,
            DiasGracia,
            Telefono,
            Fax,
            SitioWeb,
            DireccionEntrega1,
            DireccionEntrega2,
            CodigoPostal,
            DireccionPostal1,
            DireccionPostal2,
            UsuarioID
        } = req.body;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'CustomerID',
            sql.Int,
            req.params.id
        );

        request.input(
            'Nombre',
            sql.NVarChar(100),
            Nombre
        );

        request.input(
            'CategoriaID',
            sql.Int,
            CategoriaID
        );

        request.input(
            'GrupoCompraID',
            sql.Int,
            GrupoCompraID ?? null
        );

        request.input(
            'ContactoPrimarioID',
            sql.Int,
            ContactoPrimarioID
        );

        request.input(
            'ContactoAlternativoID',
            sql.Int,
            ContactoAlternativoID ?? null
        );

        request.input(
            'ClienteFacturarID',
            sql.Int,
            ClienteFacturarID ?? null
        );

        request.input(
            'MetodoEntregaID',
            sql.Int,
            MetodoEntregaID
        );

        request.input(
            'CiudadEntregaID',
            sql.Int,
            CiudadEntregaID
        );

        request.input(
            'LimiteCredito',
            sql.Decimal(18, 2),
            LimiteCredito ?? null
        );

        request.input(
            'Descuento',
            sql.Decimal(18, 3),
            Descuento ?? 0
        );

        request.input(
            'DiasGracia',
            sql.Int,
            DiasGracia ?? 7
        );

        request.input(
            'Telefono',
            sql.NVarChar(20),
            Telefono
        );

        request.input(
            'Fax',
            sql.NVarChar(20),
            Fax ?? ''
        );

        request.input(
            'SitioWeb',
            sql.NVarChar(256),
            SitioWeb ?? ''
        );

        request.input(
            'DireccionEntrega1',
            sql.NVarChar(60),
            DireccionEntrega1
        );

        request.input(
            'DireccionEntrega2',
            sql.NVarChar(60),
            DireccionEntrega2 ?? null
        );

        request.input(
            'CodigoPostal',
            sql.NVarChar(10),
            CodigoPostal
        );

        request.input(
            'DireccionPostal1',
            sql.NVarChar(60),
            DireccionPostal1
        );

        request.input(
            'DireccionPostal2',
            sql.NVarChar(60),
            DireccionPostal2 ?? null
        );

        request.input(
            'UsuarioID',
            sql.Int,
            UsuarioID ?? 1
        );

        const result = await request.execute(
            'SP_Clientes_Actualizar'
        );

        res.json({
            mensaje: 'Cliente actualizado correctamente',
            cliente: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }

});


// =========================================================
// 5. ELIMINAR CLIENTE
// DELETE /api/clientes/:id
// =========================================================

router.delete('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'CustomerID',
            sql.Int,
            req.params.id
        );

        const result = await request.execute(
            'SP_Clientes_Eliminar'
        );

        res.json({
            mensaje: 'Cliente eliminado correctamente',
            cliente: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }

});


module.exports = router;