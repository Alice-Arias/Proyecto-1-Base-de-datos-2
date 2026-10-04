const express = require('express');

const router = express.Router();

const { sql, poolPromise } = require('../db');

router.get('/opciones', async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().execute(
            'SP_Inventario_Opciones'
        );

        res.json({

            proveedores: result.recordsets[0],

            colores: result.recordsets[1],

            tiposPaquete: result.recordsets[2]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener las opciones del formulario'
        });

    }

});

router.get('/', async (req, res) => {

    try {

        const {
            nombre,
            grupo,
            cantidad
        } = req.query;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'Nombre',
            sql.NVarChar(100),
            nombre || null
        );

        request.input(
            'Grupo',
            sql.NVarChar(100),
            grupo || null
        );

        request.input(
            'Cantidad',
            sql.Int,
            cantidad !== undefined && cantidad !== ''
                ? Number(cantidad)
                : null
        );

        const result = await request.execute(
            'SP_Inventarios_Listar'
        );

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al listar inventarios'
        });

    }

});

router.get('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'StockItemID',
            sql.NVarChar(sql.MAX),
            req.params.id
        );

        const result = await request.execute(
            'SP_Inventarios_Detalle'
        );

        if (result.recordset.length === 0) {

            return res.status(404).json({
                error: 'Producto no encontrado'
            });

        }

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener el detalle del producto'
        });

    }

});

router.post('/', async (req, res) => {

    try {

        const {

            StockItemName,
            SupplierID,
            ColorID,
            UnitPackageID,
            OuterPackageID,
            Brand,
            Size,
            LeadTimeDays,
            QuantityPerOuter,
            IsChillerStock,
            Barcode,
            TaxRate,
            UnitPrice,
            RecommendedRetailPrice,
            Weight,
            MarketingComments,
            InternalComments,
            Photo,
            CustomFields,
            LastEditedBy

        } = req.body;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'StockItemName',
            sql.NVarChar(100),
            StockItemName
        );

        request.input(
            'SupplierID',
            sql.Int,
            SupplierID
        );

        request.input(
            'ColorID',
            sql.Int,
            ColorID ?? null
        );

        request.input(
            'UnitPackageID',
            sql.Int,
            UnitPackageID
        );

        request.input(
            'OuterPackageID',
            sql.Int,
            OuterPackageID
        );

        request.input(
            'Brand',
            sql.NVarChar(50),
            Brand ?? null
        );

        request.input(
            'Size',
            sql.NVarChar(20),
            Size ?? null
        );

        request.input(
            'LeadTimeDays',
            sql.Int,
            LeadTimeDays
        );

        request.input(
            'QuantityPerOuter',
            sql.Int,
            QuantityPerOuter
        );

        request.input(
            'IsChillerStock',
            sql.Bit,
            IsChillerStock
        );

        request.input(
            'Barcode',
            sql.NVarChar(50),
            Barcode ?? null
        );

        request.input(
            'TaxRate',
            sql.Decimal(18, 3),
            TaxRate
        );

        request.input(
            'UnitPrice',
            sql.Decimal(18, 2),
            UnitPrice
        );

        request.input(
            'RecommendedRetailPrice',
            sql.Decimal(18, 2),
            RecommendedRetailPrice ?? null
        );

        request.input(
            'Weight',
            sql.Decimal(18, 3),
            Weight
        );

        request.input(
            'MarketingComments',
            sql.NVarChar(sql.MAX),
            MarketingComments ?? null
        );

        request.input(
            'InternalComments',
            sql.NVarChar(sql.MAX),
            InternalComments ?? null
        );

        request.input(
            'Photo',
            sql.VarBinary(sql.MAX),
            Photo ?? null
        );

        request.input(
            'CustomFields',
            sql.NVarChar(sql.MAX),
            CustomFields ?? null
        );

        request.input(
            'LastEditedBy',
            sql.Int,
            LastEditedBy ?? 1
        );

        const result = await request.execute(
            'SP_Inventario_Insertar'
        );

        res.status(201).json({

            mensaje: 'Producto creado correctamente',

            inventario: result.recordset[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


router.put('/:id', async (req, res) => {

    try {

        const {

            StockItemName,
            SupplierID,
            ColorID,
            UnitPackageID,
            OuterPackageID,
            Brand,
            Size,
            LeadTimeDays,
            QuantityPerOuter,
            IsChillerStock,
            Barcode,
            TaxRate,
            UnitPrice,
            RecommendedRetailPrice,
            Weight,
            MarketingComments,
            InternalComments,
            Photo,
            CustomFields,
            LastEditedBy

        } = req.body;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'StockItemID',
            sql.Int,
            req.params.id
        );

        request.input(
            'StockItemName',
            sql.NVarChar(100),
            StockItemName
        );

        request.input(
            'SupplierID',
            sql.Int,
            SupplierID
        );

        request.input(
            'ColorID',
            sql.Int,
            ColorID ?? null
        );

        request.input(
            'UnitPackageID',
            sql.Int,
            UnitPackageID
        );

        request.input(
            'OuterPackageID',
            sql.Int,
            OuterPackageID
        );

        request.input(
            'Brand',
            sql.NVarChar(50),
            Brand ?? null
        );

        request.input(
            'Size',
            sql.NVarChar(20),
            Size ?? null
        );

        request.input(
            'LeadTimeDays',
            sql.Int,
            LeadTimeDays
        );

        request.input(
            'QuantityPerOuter',
            sql.Int,
            QuantityPerOuter
        );

        request.input(
            'IsChillerStock',
            sql.Bit,
            IsChillerStock
        );

        request.input(
            'Barcode',
            sql.NVarChar(50),
            Barcode ?? null
        );

        request.input(
            'TaxRate',
            sql.Decimal(18, 3),
            TaxRate
        );

        request.input(
            'UnitPrice',
            sql.Decimal(18, 2),
            UnitPrice
        );

        request.input(
            'RecommendedRetailPrice',
            sql.Decimal(18, 2),
            RecommendedRetailPrice ?? null
        );

        request.input(
            'Weight',
            sql.Decimal(18, 3),
            Weight
        );

        request.input(
            'MarketingComments',
            sql.NVarChar(sql.MAX),
            MarketingComments ?? null
        );

        request.input(
            'InternalComments',
            sql.NVarChar(sql.MAX),
            InternalComments ?? null
        );

        request.input(
            'Photo',
            sql.VarBinary(sql.MAX),
            Photo ?? null
        );

        request.input(
            'CustomFields',
            sql.NVarChar(sql.MAX),
            CustomFields ?? null
        );

        request.input(
            'LastEditedBy',
            sql.Int,
            LastEditedBy ?? 1
        );

        const result = await request.execute(
            'SP_Inventario_Actualizar'
        );

        res.json({

            mensaje: 'Producto actualizado correctamente',

            inventario: result.recordset[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

router.delete('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'StockItemID',
            sql.Int,
            req.params.id
        );

        const result = await request.execute(
            'SP_Inventario_Eliminar'
        );

        res.json({

            mensaje: 'Producto eliminado correctamente',

            inventario: result.recordset[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;