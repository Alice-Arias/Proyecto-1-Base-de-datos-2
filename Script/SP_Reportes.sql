USE WideWorldImporters;
GO

/* 
   MODULO PROVEEDORES
       SP_Reporte_ComprasProveedores
       SP_Ventas_Clientes
       SP_Top_Productos
       SP_Top_Clientes
       SP_Top_Proveedores
       SP_Ventas_Categorias
       SP_Seguimiento_Compras_Clientes
       SP_Seguimiento_Compras_Proveedores
       SP_Rotacion_Inventario
       SP_Metodo_Envio_Favorito
   TIPOS DE ERROR
       1 = falta un dato obligatorio o el formato es malo
       2 = valor fuera de rango
       3 = un registro relacionado no existe
       4 = duplicado (ya existe un proveedor con ese nombre)
       5 = el proveedor no existe
       6 = el proveedor tiene registros relacionados (no se puede borrar)
 */


/* =========================================================

   1. REPORTE DE COMPRAS A PROVEEDORES

   Devuelve los montos maximos, minimos y promedio de las
   compras realizadas a los proveedores, agrupados por
   categoria y proveedor.

   Utiliza ROLLUP para mostrar subtotales por categoria
   y un total general.

   Permite filtrar por categoria y nombre del proveedor
   mediante entrada libre de texto.

   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Reporte_ComprasProveedores

    @SupplierCategoryName NVARCHAR(50) = NULL,
    @SupplierName NVARCHAR(100) = NULL

AS
BEGIN

    SET NOCOUNT ON;

    WITH ComprasPorOrden AS
    (
        SELECT
            oc.PurchaseOrderID,
            pa.SupplierID,
            pa.SupplierName,
            catp.SupplierCategoryID,
            catp.SupplierCategoryName,
            SUM(doc.OrderedOuters * doc.ExpectedUnitPricePerOuter) AS Monto_Orden

        FROM dbo.OrdenesCompra AS oc
        INNER JOIN dbo.ProveedoresActuales AS pa
            ON oc.SupplierID = pa.SupplierID
        INNER JOIN dbo.CategoriaProveedores AS catp
            ON pa.SupplierCategoryID = catp.SupplierCategoryID
        INNER JOIN dbo.DetalleOrdenCompra AS doc
            ON oc.PurchaseOrderID = doc.PurchaseOrderID

        WHERE (@SupplierName IS NULL OR pa.SupplierName LIKE '%' + @SupplierName + '%')
            AND
            (@SupplierCategoryName IS NULL OR catp.SupplierCategoryName LIKE '%' + @SupplierCategoryName + '%')

        GROUP BY oc.PurchaseOrderID, pa.SupplierID, pa.SupplierName, catp.SupplierCategoryID, catp.SupplierCategoryName
    )

    SELECT
        CASE
            WHEN GROUPING(SupplierName) = 1
                AND GROUPING(SupplierCategoryName) = 0
                THEN 'Subtotal Categoría'
            WHEN GROUPING(SupplierName) = 1
                AND GROUPING(SupplierCategoryName) = 1 THEN 'Total General'
            ELSE SupplierName
        END AS Nombre_Proveedor,
        CASE
            WHEN GROUPING(SupplierCategoryName) = 1 THEN '-'
            ELSE SupplierCategoryName
        END AS Categoria_Proveedor,
        MAX(Monto_Orden) AS Monto_Maximo,
        MIN(Monto_Orden) AS Monto_Minimo,
        AVG(Monto_Orden) AS Monto_Promedio

    FROM ComprasPorOrden

    GROUP BY ROLLUP (SupplierCategoryName, SupplierName);

END
GO


/* =========================================================

   2. VENTAS A CLIENTES

   Devuelve los montos maximos, minimos y promedio de las
   compras realizadas por los clientes, agrupados por
   categoria y cliente.

   Utiliza ROLLUP para mostrar subtotales por categoria
   y un total general.

   Permite filtrar por categoria y nombre del cliente
   mediante entrada libre de texto.

   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Reporte_VentasToClientes

    @CustomerCategoryName NVARCHAR(50) = NULL,
    @CustomerName NVARCHAR(100) = NULL

AS
BEGIN

    SET NOCOUNT ON;

    WITH VentasPorFactura AS
    (
        SELECT
            f.InvoiceID,
            ca.CustomerID,
            ca.CustomerName,
            tc.CustomerCategoryID,
            tc.CustomerCategoryName,
            SUM(df.ExtendedPrice) AS Monto_Factura
        FROM dbo.Facturas AS f
        INNER JOIN dbo.ClientesActuales AS ca
            ON f.CustomerID = ca.CustomerID
        INNER JOIN dbo.TiposCliente AS tc
            ON ca.CustomerCategoryID = tc.CustomerCategoryID
        INNER JOIN dbo.DetalleFacturas AS df
            ON f.InvoiceID = df.InvoiceID
            
        WHERE (@CustomerName IS NULL OR ca.CustomerName LIKE '%' + @CustomerName + '%')
            AND
            (@CustomerCategoryName IS NULL OR tc.CustomerCategoryName LIKE '%' + @CustomerCategoryName + '%')

        GROUP BY f.InvoiceID, ca.CustomerID, ca.CustomerName, tc.CustomerCategoryID, tc.CustomerCategoryName
    )

    SELECT
        CASE
            WHEN GROUPING(CustomerName) = 1
                AND GROUPING(CustomerCategoryName) = 0
                THEN 'Subtotal Categoría'
            WHEN GROUPING(CustomerName) = 1
                AND GROUPING(CustomerCategoryName) = 1
                THEN 'Total General'
            ELSE CustomerName
        END AS Nombre_Cliente,
        CASE
            WHEN GROUPING(CustomerCategoryName) = 1
                THEN '-'
            ELSE CustomerCategoryName
        END AS Categoria_Cliente,
        MIN(Monto_Factura) AS Monto_Minimo,
        MAX(Monto_Factura) AS Monto_Maximo,
        AVG(Monto_Factura) AS Monto_Promedio

    FROM VentasPorFactura

    GROUP BY ROLLUP (CustomerCategoryName, CustomerName);

END
GO


/* =========================================================

   2. TOP 5 PRODUCTOS QUE MÁS GENERAN

   Devuelve los montos maximos, minimos y promedio de las
   compras realizadas por los clientes, agrupados por
   categoria y cliente.

   Utiliza ROLLUP para mostrar subtotales por categoria
   y un total general.

   Permite filtrar por categoria y nombre del cliente
   mediante entrada libre de texto.

   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Top_GananciaProductos

    @Anio INT = NULL

AS
BEGIN

    SET NOCOUNT ON;

    WITH GananciaPorProducto AS (
        SELECT
            YEAR(f.InvoiceDate) AS Anio,
            pa.StockItemID,
            pa.StockItemName AS Producto,
            SUM(df.LineProfit) AS Ganancia_Total

        FROM dbo.DetalleFacturas AS df
        INNER JOIN dbo.ProductosActuales AS pa ON df.StockItemID = pa.StockItemID
        INNER JOIN dbo.Facturas AS f ON df.InvoiceID = f.InvoiceID

        WHERE @Anio IS NULL OR YEAR(f.InvoiceDate) = @Anio

        GROUP BY YEAR(f.InvoiceDate), pa.StockItemID, pa.StockItemName
    ),

    RankingProductos AS (
        SELECT
            Anio,
            StockItemID,
            Producto,
            Ganancia_Total,
            DENSE_RANK() OVER (PARTITION BY Anio ORDER BY Ganancia_Total DESC) AS Posicion

        FROM GananciaPorProducto
    )

    SELECT
        Anio,
        StockItemID AS ID_Producto,
        Producto,
        Ganancia_Total,
        Posicion
    FROM RankingProductos
    WHERE Posicion <= 5
    ORDER BY Anio, Posicion;

END
GO


CREATE OR ALTER PROCEDURE dbo.SP_Reportes_Opciones
AS
BEGIN

    SET NOCOUNT ON;

    -- Nos permite saber los años disponibles en el sistema
    SELECT DISTINCT
        YEAR(InvoiceDate) AS Anio
    FROM dbo.Facturas
    ORDER BY Anio;

END
GO


-- Select de apoyo para desarrollo
SELECT * FROM dbo.ProductosActuales;

SELECT * FROM dbo.DetalleOrdenCompra;

SELECT * FROM dbo.OrdenesCompra;

SELECT * FROM dbo.TransaccionesProveedores;

SELECT * FROM Purchasing.PurchaseOrderLines;

SELECT * FROM dbo.CategoriaProveedores;

SELECT * FROM dbo.Facturas;

SELECT * FROM dbo.ClientesActuales;

SELECT * FROM dbo.DetalleFacturas;

SELECT * FROM dbo.ClientesActuales;

SELECT * FROM dbo.TiposCliente;

SELECT TOP 5 *
FROM dbo.OrdenesCompra;

SELECT TOP 5 *
FROM dbo.DetalleOrdenCompra;