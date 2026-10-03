USE WideWorldImporters;
GO

/* 
   MODULO CLIENTES
       SP_Inventarios_Listar
       SP_Inventarios_Detalle
       SP_Inventarios_Insertar
       SP_Inventarios_Actualizar
       SP_Inventarios_Eliminar
   TIPOS DE ERROR
       1 = falta un dato obligatorio o el formato es malo
       2 = valor fuera de rango
       3 = un registro relacionado no existe
       4 = duplicado (ya existe un inventario con ese nombre)
       5 = el inventario no existe
       6 = el inventario tiene registros relacionados (no se puede borrar)
 */


/* =========================================================
   1. LISTAR

   Devuelve la lista de proveedores para la tabla principal.
   Permite filtrar por nombre, categoria y metodo de entrega.
   Los resultados se ordenan por nombre de la A - Z.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Inventarios_Listar
    @Nombre NVARCHAR(100) = NULL,
    @Grupo NVARCHAR(100) = NULL,
    @Cantidad INT

AS
BEGIN

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SELECT
        pto.StockItemID,
        pto.StockItemName AS Producto,
        STRING_AGG(g.StockGroupName, ', ') -- Agrupa los grupos en una sola fila
            WITHIN GROUP (ORDER BY g.StockGroupName) 
            AS Grupo,
        pi.QuantityOnHand AS Cantidad_Inventario
    FROM dbo.ProductosActuales AS pto
    INNER JOIN dbo.ItemGrupos AS ig ON pto.StockItemID = ig.StockItemID
    INNER JOIN dbo.Grupos AS g ON ig.StockGroupID = g.StockGroupID
    INNER JOIN dbo.ProductosInventario AS pi ON pto.StockItemID = pi.StockItemID

    WHERE
            (@Nombre IS NULL OR pto.StockItemName LIKE '%' + @Nombre + '%')
            AND 
            (@Grupo IS NULL OR g.StockGroupName LIKE '%' + @Grupo + '%')
            AND
            (@Cantidad IS NULL OR pi.QuantityOnHand >= @Cantidad)

    GROUP BY pto.StockItemID,
             pto.StockItemName,
             pi.QuantityOnHand

    

    ORDER BY pto.StockItemName ASC;

END
GO


/* =========================================================
   2. DETALLE

   Devuelve toda la informacion de un proveedor.
   Recibe el SupplierID.
   ========================================================= */


CREATE OR ALTER PROCEDURE dbo.SP_Inventarios_Detalle
    @StockItemID NVARCHAR(MAX)
AS
BEGIN

    SET NOCOUNT ON;

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SELECT 
        pto.StockItemID,
        pto.StockItemName AS Producto,
        p.SupplierID AS Proveedor_ID,
        p.SupplierName AS Proveedor,
        e.PackageTypeName AS Unidad_Empaquetamiento,
        em.PackageTypeName AS Empaquetamiento,
        pto.QuantityPerOuter AS Cantidad_Empaquetamiento,
        pto.Brand AS Marca,
        pto.Size AS Talla,
        ROUND(pto.UnitPrice * (pto.TaxRate / 100.0), 2) AS Impuesto,
        pto.UnitPrice AS Precio_Unitario,
        pto.RecommendedRetailPrice AS Precio_Venta,
        pto.TypicalWeightPerUnit AS Peso,
        pto.SearchDetails AS Palabras_Clave,
        pi.QuantityOnHand AS Cantidad_Disponible,
        pi.BinLocation AS Ubicacion

    FROM dbo.ProductosActuales AS pto
    INNER JOIN dbo.ProveedoresActuales AS p ON pto.SupplierID = p.SupplierID
    INNER JOIN dbo.Colores AS c ON pto.ColorID = c.ColorID
    INNER JOIN dbo.Empaquetamiento e ON pto.UnitPackageID = e.PackageTypeID
    INNER JOIN dbo.Empaquetamiento AS em ON pto.OuterPackageID = em.PackageTypeID
    INNER JOIN dbo.ProductosInventario AS pi ON pto.StockItemID = pi.StockItemID

    WHERE pto.StockItemID IN
    (
        SELECT TRY_CAST(value AS INT)
        FROM STRING_SPLIT(@StockItemID, ',') 
        WHERE TRY_CAST(value AS INT) IS NOT NULL
    );

END
GO

-- Nombre producto, proveedor ID, color ID, unidad de empaquetamiento ID, empaquetamiento ID,
-- cantidad de empaquetamiento, marca, talla, impuesto y precio unitario
SELECT * FROM Warehouse.StockItems;

-- Conexión item grupo
SELECT * FROM Warehouse.StockItemStockGroups;

--Grupos
SELECT * FROM Warehouse.StockGroups;

-- Productos en inventario
SELECT * FROM Warehouse.StockItemHoldings;

--Proveedor ID
SELECT * FROM dbo.ProveedoresActuales;

--Color ID
SELECT * FROM Warehouse.Colors;

--Unidad de empaquetamiento, empaquetamiento
SELECT * FROM Warehouse.PackageTypes;
