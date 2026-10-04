const express = require('express');

const router = express.Router();

const { sql, poolPromise } = require('../db');



router.get('/opciones', async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().execute(
            'SP_Ventas_Opciones'
        );

        res.json({
            clientes: result.recordsets[0],
            metodosEntrega: result.recordsets[1],
            contactos: result.recordsets[2],
            vendedores: result.recordsets[3],
            pedidos: result.recordsets[4],
            productos: result.recordsets[5],
            tiposPaquete: result.recordsets[6]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener las opciones de ventas'
        });

    }

});



router.get('/', async (req, res) => {

    try {

        const {
            numeroFactura,
            fechaInicio,
            fechaFin,
            cliente,
            metodoEntrega,
            montoInicio,
            montoFin
        } = req.query;

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'NumeroFactura',
            sql.Int,
            numeroFactura !== undefined && numeroFactura !== ''
                ? Number(numeroFactura)
                : null
        );

        request.input(
            'FechaInicio',
            sql.Date,
            fechaInicio || null
        );

        request.input(
            'FechaFin',
            sql.Date,
            fechaFin || null
        );

        request.input(
            'Cliente',
            sql.NVarChar(100),
            cliente || null
        );

        request.input(
            'DeliveryMethod',
            sql.NVarChar(50),
            metodoEntrega || null
        );

        request.input(
            'MontoInicio',
            sql.Decimal(18, 2),
            montoInicio !== undefined && montoInicio !== ''
                ? Number(montoInicio)
                : null
        );

        request.input(
            'MontoFin',
            sql.Decimal(18, 2),
            montoFin !== undefined && montoFin !== ''
                ? Number(montoFin)
                : null
        );

        const result = await request.execute(
            'SP_Ventas_Listar'
        );

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al listar las ventas'
        });

    }

});



router.get('/:id', async (req, res) => {

    try {

        const pool = await poolPromise;

        const request = pool.request();

        request.input(
            'InvoiceID',
            sql.Int,
            req.params.id
        );

        const result = await request.execute(
            'SP_Ventas_Detalle'
        );

        const encabezado = result.recordsets[0][0];

        if (!encabezado) {

            return res.status(404).json({
                error: 'Venta no encontrada'
            });

        }

        res.json({
            encabezado,
            lineas: result.recordsets[1]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error al obtener el detalle de la venta'
        });

    }

});



router.post('/', async (req, res) => {

    try {

        const {
            CustomerID,
            BillToCustomerID,
            OrderID,
            DeliveryMethod,
            ContactPersonID,
            AccountsPersonID,
            SalespersonPersonID,
            PackedByPersonID,
            InvoiceDate,
            CustomerPurchaseOrderNumber,
            IsCreditNote,
            CreditNoteReason,
            Comments,
            DeliveryInstructions,
            InternalComments,
            TotalDryItems,
            TotalChillerItems,
            DeliveryRun,
            RunPosition,
            ReturnedDeliveryData,
            LastEditedBy,
            StockItemID,
            Description,
            PackageTypeID,
            Quantity,
            UnitPrice,
            TaxRate
        } = req.body;

        const pool = await poolPromise;

        const request = pool.request();

        request.input('CustomerID', sql.Int, CustomerID);
        request.input('BillToCustomerID', sql.Int, BillToCustomerID);
        request.input('OrderID', sql.Int, OrderID ?? null);
        request.input('DeliveryMethod', sql.Int, DeliveryMethod);
        request.input('ContactPersonID', sql.Int, ContactPersonID);
        request.input('AccountsPersonID', sql.Int, AccountsPersonID);
        request.input('SalespersonPersonID', sql.Int, SalespersonPersonID);
        request.input('PackedByPersonID', sql.Int, PackedByPersonID);
        request.input('InvoiceDate', sql.Date, InvoiceDate);
        request.input(
            'CustomerPurchaseOrderNumber',
            sql.NVarChar(20),
            CustomerPurchaseOrderNumber ?? null
        );
        request.input('IsCreditNote', sql.Bit, IsCreditNote);
        request.input(
            'CreditNoteReason',
            sql.NVarChar(sql.MAX),
            CreditNoteReason ?? null
        );
        request.input('Comments', sql.NVarChar(sql.MAX), Comments ?? null);
        request.input(
            'DeliveryInstructions',
            sql.NVarChar(sql.MAX),
            DeliveryInstructions ?? null
        );
        request.input(
            'InternalComments',
            sql.NVarChar(sql.MAX),
            InternalComments ?? null
        );
        request.input('TotalDryItems', sql.Int, TotalDryItems);
        request.input('TotalChillerItems', sql.Int, TotalChillerItems);
        request.input('DeliveryRun', sql.NVarChar(5), DeliveryRun ?? null);
        request.input('RunPosition', sql.NVarChar(5), RunPosition ?? null);
        request.input(
            'ReturnedDeliveryData',
            sql.NVarChar(sql.MAX),
            ReturnedDeliveryData ?? null
        );
        request.input('LastEditedBy', sql.Int, LastEditedBy ?? 1);

        request.input('StockItemID', sql.Int, StockItemID);
        request.input('Description', sql.NVarChar(100), Description);
        request.input('PackageTypeID', sql.Int, PackageTypeID);
        request.input('Quantity', sql.Int, Quantity);
        request.input('UnitPrice', sql.Decimal(18, 2), UnitPrice ?? null);
        request.input('TaxRate', sql.Decimal(18, 2), TaxRate);

        const result = await request.execute(
            'SP_Ventas_Insertar'
        );

        res.status(201).json({
            mensaje: 'Venta creada correctamente',
            venta: result.recordset[0]
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
            CustomerID,
            BillToCustomerID,
            OrderID,
            DeliveryMethod,
            ContactPersonID,
            AccountsPersonID,
            SalespersonPersonID,
            PackedByPersonID,
            InvoiceDate,
            CustomerPurchaseOrderNumber,
            IsCreditNote,
            CreditNoteReason,
            Comments,
            DeliveryInstructions,
            InternalComments,
            TotalDryItems,
            TotalChillerItems,
            DeliveryRun,
            RunPosition,
            ReturnedDeliveryData,
            LastEditedBy,
            StockItemID,
            Description,
            PackageTypeID,
            Quantity,
            UnitPrice,
            TaxRate
        } = req.body;

        const pool = await poolPromise;

        const request = pool.request();

        request.input('InvoiceID', sql.Int, req.params.id);

        request.input('CustomerID', sql.Int, CustomerID);
        request.input('BillToCustomerID', sql.Int, BillToCustomerID);
        request.input('OrderID', sql.Int, OrderID ?? null);
        request.input('DeliveryMethod', sql.Int, DeliveryMethod);
        request.input('ContactPersonID', sql.Int, ContactPersonID);
        request.input('AccountsPersonID', sql.Int, AccountsPersonID);
        request.input('SalespersonPersonID', sql.Int, SalespersonPersonID);
        request.input('PackedByPersonID', sql.Int, PackedByPersonID);
        request.input('InvoiceDate', sql.Date, InvoiceDate);
        request.input(
            'CustomerPurchaseOrderNumber',
            sql.NVarChar(20),
            CustomerPurchaseOrderNumber ?? null
        );
        request.input('IsCreditNote', sql.Bit, IsCreditNote);
        request.input(
            'CreditNoteReason',
            sql.NVarChar(sql.MAX),
            CreditNoteReason ?? null
        );
        request.input('Comments', sql.NVarChar(sql.MAX), Comments ?? null);
        request.input(
            'DeliveryInstructions',
            sql.NVarChar(sql.MAX),
            DeliveryInstructions ?? null
        );
        request.input(
            'InternalComments',
            sql.NVarChar(sql.MAX),
            InternalComments ?? null
        );
        request.input('TotalDryItems', sql.Int, TotalDryItems);
        request.input('TotalChillerItems', sql.Int, TotalChillerItems);
        request.input('DeliveryRun', sql.NVarChar(5), DeliveryRun ?? null);
        request.input('RunPosition', sql.NVarChar(5), RunPosition ?? null);
        request.input(
            'ReturnedDeliveryData',
            sql.NVarChar(sql.MAX),
            ReturnedDeliveryData ?? null
        );
        request.input('LastEditedBy', sql.Int, LastEditedBy ?? 1);

        request.input('StockItemID', sql.Int, StockItemID);
        request.input('Description', sql.NVarChar(100), Description);
        request.input('PackageTypeID', sql.Int, PackageTypeID);
        request.input('Quantity', sql.Int, Quantity);
        request.input('UnitPrice', sql.Decimal(18, 2), UnitPrice ?? null);
        request.input('TaxRate', sql.Decimal(18, 2), TaxRate);

        const result = await request.execute(
            'SP_Ventas_Actualizar'
        );

        res.json({
            mensaje: 'Venta actualizada correctamente',
            venta: result.recordset[0]
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
            'InvoiceID',
            sql.Int,
            req.params.id
        );

        const result = await request.execute(
            'SP_Ventas_Eliminar'
        );

        res.json({
            mensaje: 'Venta eliminada correctamente',
            venta: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


module.exports = router;