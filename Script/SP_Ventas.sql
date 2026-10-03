USE WideWorldImporters;
GO

/* 
   MODULO PROVEEDORES
       SP_Proveedores_Listar
       SP_Proveedores_Detalle
       SP_Proveedores_Insertar
       SP_Proveedores_Actualizar
       SP_Proveedores_Eliminar
   TIPOS DE ERROR
       1 = falta un dato obligatorio o el formato es malo
       2 = valor fuera de rango
       3 = un registro relacionado no existe
       4 = duplicado (ya existe un proveedor con ese nombre)
       5 = el proveedor no existe
       6 = el proveedor tiene registros relacionados (no se puede borrar)
 */


/* =========================================================
   1. LISTAR

   Devuelve la lista de ventas para la tabla principal.
   Permite filtrar por nombre, categoria y metodo de entrega.
   Los resultados se ordenan por nombre de la A - Z.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Ventas_Listar
    @NumeroFactura INT = NULL,
    @Fecha DATE = NULL,
    @Cliente NVARCHAR(100) = NULL,
    @DeliveryMethod NVARCHAR(50) = NULL,
    @Monto DECIMAL(18,2) = NULL

AS
BEGIN

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SELECT 
        f.InvoiceID,
        f.InvoiceDate AS Fecha_Factura,
        c.CustomerName AS Nombre_Cliente,
        fe.DeliveryMethodName AS Metodo_Entrega,
        SUM(df.ExtendedPrice + df.TaxAmount) AS Monto

    FROM dbo.Facturas f
    INNER JOIN dbo.ClientesActuales AS c ON f.CustomerID = c.CustomerID
    INNER JOIN dbo.FormasEntrega AS fe ON f.DeliveryMethodID = fe.DeliveryMethodID
    INNER JOIN dbo.DetalleFacturas AS df ON f.InvoiceID = df.InvoiceID

    WHERE
        (@NumeroFactura IS NULL OR f.InvoiceID = @NumeroFactura)
        AND
        (@Fecha IS NULL OR f.InvoiceDate = @Fecha)
        AND
        (@Cliente IS NULL OR c.CustomerName LIKE '%' + @Cliente + '%')
        AND
        (@DeliveryMethod IS NULL OR fe.DeliveryMethodName LIKE '%' + @DeliveryMethod + '%')
        
    GROUP BY f.InvoiceID, f.InvoiceDate, c.CustomerName, fe.DeliveryMethodName

    HAVING (@Monto IS NULL OR SUM(df.ExtendedPrice + df.TaxAmount) = @Monto)

    ORDER BY f.InvoiceID ASC;

END
GO


-- Número de factura, fecha, cliente, método de entrega
SELECT * FROM Sales.Invoices;

-- Monto de factura
SELECT * FROM Sales.InvoiceLines;

