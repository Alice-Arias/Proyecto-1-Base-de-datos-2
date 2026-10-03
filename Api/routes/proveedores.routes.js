const express = require('express');

const router = express.Router();

const { sql, poolPromise } = require('../db');


// =========================================================
// FUNCIONES AUXILIARES
// =========================================================

// Agrega al request los parametros que comparten
// SP_Proveedores_Insertar y SP_Proveedores_Actualizar.
// Asi no repetimos 25 request.input() en dos rutas.
//
// Nota: @UbicacionEntrega (GEOGRAPHY) no se envia desde la API;
// el SP lo recibe como NULL por defecto.

function agregarParametros(request, body) {

    request.input('Nombre', sql.NVarChar(100), body.Nombre);
    request.input('CategoriaID', sql.Int, body.CategoriaID);
    request.input('ContactoPrimarioID', sql.Int, body.ContactoPrimarioID);
    request.input('ContactoAlternativoID', sql.Int, body.ContactoAlternativoID ?? null);
    request.input('MetodoEntregaID', sql.Int, body.MetodoEntregaID);
    request.input('CiudadEntregaID', sql.Int, body.CiudadEntregaID);
    request.input('CiudadPostalID', sql.Int, body.CiudadPostalID);

    request.input('ReferenciaProveedor', sql.NVarChar(20), body.ReferenciaProveedor ?? null);
    request.input('NombreCuentaBancaria', sql.NVarChar(50), body.NombreCuentaBancaria ?? null);
    request.input('SucursalBancaria', sql.NVarChar(50), body.SucursalBancaria ?? null);
    request.input('CodigoBanco', sql.NVarChar(20), body.CodigoBanco ?? null);
    request.input('NumeroCuentaBancaria', sql.NVarChar(50), body.NumeroCuentaBancaria ?? null);
    request.input('CodigoInternacionalBanco', sql.NVarChar(20), body.CodigoInternacionalBanco ?? null);

    request.input('DiasPago', sql.Int, body.DiasPago ?? 7);
    request.input('ComentariosInternos', sql.NVarChar(sql.MAX), body.ComentariosInternos ?? null);

    request.input('Telefono', sql.NVarChar(20), body.Telefono);
    request.input('Fax', sql.NVarChar(20), body.Fax ?? '');
    request.input('SitioWeb', sql.NVarChar(256), body.SitioWeb ?? '');

    request.input('DireccionEntrega1', sql.NVarChar(60), body.DireccionEntrega1);
    request.input('DireccionEntrega2', sql.NVarChar(60), body.DireccionEntrega2 ?? null);
    request.input('CodigoPostalEntrega', sql.NVarChar(10), body.CodigoPostalEntrega);

    request.input('DireccionPostal1', sql.NVarChar(60), body.DireccionPostal1);
    request.input('DireccionPostal2', sql.NVarChar(60), body.DireccionPostal2 ?? null);
    request.input('CodigoPostalPostal', sql.NVarChar(10), body.CodigoPostalPostal);

    request.input('UsuarioID', sql.Int, body.UsuarioID ?? 1);
}


// Los SP lanzan errores con RAISERROR(mensaje, 16, <estado>).
// Ese "estado" llega en err.state y nos dice que tipo de error es:
//
//   1 = dato obligatorio / formato malo   -> 400
//   2 = valor fuera de rango              -> 400
//   3 = registro relacionado no existe    -> 400
//   4 = duplicado                         -> 409
//   5 = el proveedor no existe            -> 404
//   6 = tiene registros relacionados      -> 409
//
// Asi el frontend recibe un codigo HTTP correcto en vez de
// un 500 para todo.

function responderError(res, err) {

    console.error(err);

    const estados = {
        1: 400,
        2: 400,
        3: 400,
        4: 409,
        5: 404,
        6: 409
    };

    const status = estados[err.state] ?? 500;

    res.status(status).json({
        error: err.message
    });
}


// =========================================================
// 0. OPCIONES PARA EL FORMULARIO
// GET /api/proveedores/opciones
//
// IMPORTANTE: esta ruta debe ir ANTES de '/:id'.
// =========================================================

router.get('/opciones', async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().execute(
            'SP_Proveedores_Opciones'
        );

        // SP_Proveedores_Opciones devuelve 4 SELECTs:
        // categorias, contactos, metodos de entrega y ciudades.

        res.json({
            categorias: result.recordsets[0],
            contactos: result.recordsets[1],
            metodosEntrega: result.recordsets[2],
            ciudades: result.recordsets[3]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener las opciones del formulario'
        });
    }

});


// =========================================================
// 1. LISTAR PROVEEDORES
// GET /api/proveedores
// GET /api/proveedores?nombre=ABC&categoria=Servicios
// =========================================================

router.get('/', async (req, res) => {

    try {

        const { nombre, categoria, metodoEntrega } = req.query;

        const pool = await poolPromise;

        const request = pool.request();

        request.input('Nombre', sql.NVarChar(100), nombre || null);
        request.input('Categoria', sql.NVarChar(100), categoria || null);
        request.input('MetodoEntrega', sql.NVarChar(100), metodoEntrega || null);

        const result = await request.execute(
            'SP_Proveedores_Listar'
        );

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al listar proveedores'
        });
    }

});


// =========================================================
// 2. DETALLE DE UNO O VARIOS PROVEEDORES
// GET /api/proveedores/1
// GET /api/proveedores/1,2,3
// =========================================================

router.get('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'SupplierID',
            sql.NVarChar(sql.MAX),
            req.params.id
        );

        const result = await request.execute(
            'SP_Proveedores_Detalle'
        );

        if (result.recordset.length === 0) {

            return res.status(404).json({
                error: 'Proveedor no encontrado'
            });

        }

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener el detalle del proveedor'
        });
    }

});


// =========================================================
// 3. INSERTAR PROVEEDOR
// POST /api/proveedores
// =========================================================

router.post('/', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        agregarParametros(request, req.body);

        const result = await request.execute(
            'SP_Proveedores_Insertar'
        );

        res.status(201).json({
            mensaje: 'Proveedor creado correctamente',
            proveedor: result.recordset[0]
        });

    } catch (err) {

        responderError(res, err);
    }

});


// =========================================================
// 4. ACTUALIZAR PROVEEDOR
// PUT /api/proveedores/:id
// =========================================================

router.put('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input('SupplierID', sql.Int, req.params.id);

        agregarParametros(request, req.body);

        const result = await request.execute(
            'SP_Proveedores_Actualizar'
        );

        res.json({
            mensaje: 'Proveedor actualizado correctamente',
            proveedor: result.recordset[0]
        });

    } catch (err) {

        responderError(res, err);
    }

});


// =========================================================
// 5. ELIMINAR PROVEEDOR
// DELETE /api/proveedores/:id
// =========================================================

router.delete('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input('SupplierID', sql.Int, req.params.id);

        const result = await request.execute(
            'SP_Proveedores_Eliminar'
        );

        res.json({
            mensaje: 'Proveedor eliminado correctamente',
            proveedor: result.recordset[0]
        });

    } catch (err) {

        responderError(res, err);
    }

});


module.exports = router;