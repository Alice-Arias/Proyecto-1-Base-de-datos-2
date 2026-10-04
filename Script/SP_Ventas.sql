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


/* =========================================================
   2. DETALLE

   Devuelve toda la informacion de una venta.
   Recibe el InvoiceID.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Proveedores_Detalle
    @InvoiceID INT
AS
BEGIN

    SET NOCOUNT ON;

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    -- Encabezado
    SELECT
        f.InvoiceID,
        ca.CustomerName AS Nombre_Cliente, 
        fe.DeliveryMethodName AS Metodo_Entrega,
        f.CustomerPurchaseOrderNumber AS Numero_Orden,
        cts.FullName AS Persona_Contacto,
        ctos.FullName AS Vendedor,
        f.InvoiceDate AS Fecha_Factura,
        f.DeliveryInstructions AS Intrucciones_Entrega

    FROM dbo.Facturas f
    INNER JOIN dbo.ClientesActuales AS ca ON f.CustomerID = ca.CustomerID
    INNER JOIN dbo.FormasEntrega AS fe ON f.DeliveryMethodID = fe.DeliveryMethodID
    INNER JOIN dbo.Contactos AS cts ON f.ContactPersonID = cts.PersonID
    INNER JOIN dbo.Contactos AS ctos ON f.SalespersonPersonID = ctos.PersonID

    WHERE f.InvoiceID = @InvoiceID; 

    -- Detalle
    SELECT 
        pa.StockItemName AS Producto,
        df.Quantity AS Cantidad,
        df.UnitPrice AS Precio_Unitario,
        df.TaxRate AS Impuesto_Aplicado,
        df.TaxAmount AS Impuesto_Monto,
        df.ExtendedPrice AS Total_Linea

    FROM dbo.DetalleFacturas df
    INNER JOIN dbo.ProductosActuales AS pa ON df.StockItemID = pa.StockItemID

    WHERE df.InvoiceID = @InvoiceID;

END
GO



-- Número de factura, fecha, cliente, método de entrega
SELECT * FROM Sales.Invoices;

-- Monto de factura
SELECT * FROM Sales.InvoiceLines;

SELECT * FROM Application.People;