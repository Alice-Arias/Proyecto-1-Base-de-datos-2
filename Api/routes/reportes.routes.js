const express = require('express');
const { sql, poolPromise } = require('../db');

const router = express.Router();

const texto = (request, query, parameter, length) => {
    request.input(parameter, sql.NVarChar(length), query || null);
};

const entero = (request, query, parameter) => {
    if (query === undefined || query === '') {
        request.input(parameter, sql.Int, null);
        return;
    }

    const value = Number(query);

    if (!Number.isInteger(value)) {
        const error = new Error(`El parámetro ${parameter} debe ser un número entero`);
        error.statusCode = 400;
        throw error;
    }

    request.input(parameter, sql.Int, value);
};

const ejecutarReporte = (procedimiento, configurar = () => {}) => async (req, res) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        configurar(request, req.query);

        const result = await request.execute(procedimiento);
        res.json(result.recordset || []);
    } catch (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({
            error: err.statusCode ? err.message : `Error al ejecutar ${procedimiento}`
        });
    }
};

router.get('/opciones', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('SP_Reportes_Opciones');
        const categoriasProveedores = await pool.request().query(`
            SELECT
                SupplierCategoryID AS ID,
                SupplierCategoryName AS Nombre
            FROM dbo.CategoriaProveedores
            ORDER BY SupplierCategoryName
        `);

        res.json({
            aniosVentas: result.recordsets[0],
            aniosCompras: result.recordsets[1],
            meses: result.recordsets[2],
            categoriasProductos: result.recordsets[3],
            categoriasClientes: result.recordsets[4],
            proveedores: result.recordsets[5],
            categoriasProveedores: categoriasProveedores.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las opciones de reportes' });
    }
});

router.get('/compras-proveedores', ejecutarReporte(
    'SP_Reporte_ComprasProveedores',
    (request, query) => {
        texto(request, query.categoriaProveedor, 'SupplierCategoryName', 50);
        texto(request, query.proveedor, 'SupplierName', 100);
    }
));

router.get('/ventas-clientes', ejecutarReporte(
    'SP_Reporte_VentasToClientes',
    (request, query) => {
        texto(request, query.categoriaCliente, 'CustomerCategoryName', 50);
        texto(request, query.cliente, 'CustomerName', 100);
    }
));

router.get('/top-productos', ejecutarReporte(
    'SP_Top_GananciaProductos',
    (request, query) => entero(request, query.anio, 'Anio')
));

router.get('/top-clientes', ejecutarReporte(
    'SP_Top_ClientesFacturas',
    (request, query) => entero(request, query.anio, 'Anio')
));

router.get('/top-proveedores', ejecutarReporte(
    'SP_Top_ProveedoresOrdenes',
    (request, query) => entero(request, query.anio, 'Anio')
));

router.get('/ventas-categorias', ejecutarReporte('SP_Resumen_VentasCategorias'));

router.get('/seguimiento-clientes', ejecutarReporte(
    'SP_Seguimiento_Compras_Clientes',
    (request, query) => {
        entero(request, query.anio, 'Anio');
        entero(request, query.mes, 'Mes');
        texto(request, query.categoriaProducto, 'CategoriaProducto', 50);
    }
));

router.get('/seguimiento-proveedores', ejecutarReporte(
    'SP_Seguimiento_Compras_Proveedores',
    (request, query) => {
        entero(request, query.anio, 'Anio');
        entero(request, query.mes, 'Mes');
        texto(request, query.categoriaProducto, 'CategoriaProducto', 50);
    }
));

router.get('/rotacion-inventario', ejecutarReporte(
    'SP_Rotacion_Inventario',
    (request, query) => {
        texto(request, query.categoriaProducto, 'CategoriaProducto', 50);
        entero(request, query.anio, 'Anio');
        texto(request, query.proveedor, 'Proveedor', 100);
    }
));

router.get('/metodo-envio-favorito', ejecutarReporte(
    'SP_Metodo_Envio_Favorito',
    (request, query) => {
        entero(request, query.anio, 'Anio');
        entero(request, query.mes, 'Mes');
        texto(request, query.categoriaCliente, 'CategoriaCliente', 50);
        texto(request, query.categoriaProducto, 'CategoriaProducto', 50);
        texto(request, query.producto, 'Producto', 100);
    }
));

module.exports = router;