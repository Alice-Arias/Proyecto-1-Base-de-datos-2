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

   Devuelve la lista de productos para la tabla principal.
   Permite filtrar por nombre, grupo y cantidad en stock.
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
    INNER JOIN dbo.GruposInventario AS g ON ig.StockGroupID = g.StockGroupID
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

   Devuelve toda la informacion de un producto.
   Recibe el StockItermID.
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
    INNER JOIN dbo.ColoresProductos AS c ON pto.ColorID = c.ColorID
    INNER JOIN dbo.EmpaquetamientoInventario e ON pto.UnitPackageID = e.PackageTypeID
    INNER JOIN dbo.EmpaquetamientoInventario AS em ON pto.OuterPackageID = em.PackageTypeID
    INNER JOIN dbo.ProductosInventario AS pi ON pto.StockItemID = pi.StockItemID

    WHERE pto.StockItemID IN
    (
        SELECT TRY_CAST(value AS INT)
        FROM STRING_SPLIT(@StockItemID, ',') 
        WHERE TRY_CAST(value AS INT) IS NOT NULL
    );

END
GO

/* =========================================================
   3. INSERTAR

   Utiliza una TRANSACCION porque realiza dos operaciones:
    INSERT del producto.
   Si ambas operaciones funcionan:  COMMIT
   Si ocurre un error: ROLLBACK
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Inventario_Insertar

    @StockItemName NVARCHAR(100),
    @SupplierID INT,
    @ColorID INT,
    @UnitPackageID INT,
    @OuterPackageID INT,
    @Brand NVARCHAR(50),
    @Size NVARCHAR(20),
    @LeadTimeDays INT,
    @QuantityPerOuter INT,
    @IsChillerStock BIT,
    @Barcode NVARCHAR(50),
    @TaxRate DECIMAL(18,3),
    @UnitPrice DECIMAL(18,2),
    @RecommendedRetailPrice DECIMAL(18,2),
    @Weight DECIMAL(18,3),
    @MarketingComments NVARCHAR(MAX),
    @InternalComments NVARCHAR(MAX),
    @Photo VARBINARY(MAX),
    @CustomFields NVARCHAR(MAX),
    @LastEditedBy INT = 1

AS
BEGIN

    
    IF @StockItemName IS NULL
    BEGIN
        RAISERROR('El nombre del producto es obligatorio.', 16, 1);
        RETURN;
    END

    IF @SupplierID IS NULL
    BEGIN
        RAISERROR('El proveedor es obligatorio.', 16, 1);
        RETURN;
    END

    IF @UnitPackageID IS NULL
    BEGIN
        RAISERROR('El paquete por unidad es obligatorio.', 16, 1);
        RETURN;
    END

    IF @OuterPackageID IS NULL
    BEGIN
        RAISERROR('El paquete exterior es obligatorio.', 16, 1);
        RETURN;
    END

    IF @LeadTimeDays IS NULL
    BEGIN
        RAISERROR('Los días de entrega son obligatorios.', 16, 1);
        RETURN;
    END

    IF @QuantityPerOuter IS NULL
    BEGIN
        RAISERROR('La cantidad por empaque es obligatoria.', 16, 1);
        RETURN;
    END

    IF @IsChillerStock IS NULL
    BEGIN
        RAISERROR('El indicador de almacenamiento refrigerado es obligatorio.', 16, 1);
        RETURN;
    END

    IF @TaxRate IS NULL
    BEGIN
        RAISERROR('La tasa de impuesto es obligatoria.', 16, 1);
        RETURN;
    END

    IF @UnitPrice IS NULL
    BEGIN
        RAISERROR('El precio unitario es obligatorio.', 16, 1);
        RETURN;
    END

    IF @Weight IS NULL
    BEGIN
        RAISERROR('El peso es obligatorio.', 16, 1);
        RETURN;
    END

    IF @LeadTimeDays < 0
    BEGIN
        RAISERROR('Los días de entrega no pueden ser negativos.', 16, 2);
        RETURN;
    END

    IF @QuantityPerOuter <= 0
    BEGIN
        RAISERROR('La cantidad por empaque debe ser mayor que cero.', 16, 2);
        RETURN;
    END

    IF @TaxRate < 0
    BEGIN
        RAISERROR('La tasa de impuesto no puede ser negativa.', 16, 2);
        RETURN;
    END

    IF @UnitPrice < 0
    BEGIN
        RAISERROR('El precio unitario no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF @RecommendedRetailPrice < 0
    BEGIN
        RAISERROR('El precio de venta recomendado no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF @Weight < 0
    BEGIN
        RAISERROR('El peso no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProveedoresActuales
        WHERE SupplierID = @SupplierID
    )
    BEGIN
        RAISERROR('El proveedor indicado no existe.', 16, 3);
        RETURN;
    END

    IF @ColorID IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM dbo.ColoresProductos
            WHERE ColorID = @ColorID
        )
    BEGIN
        RAISERROR('El color indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.EmpaquetamientoInventario
        WHERE PackageTypeID = @UnitPackageID
    )
    BEGIN
        RAISERROR('El tipo de paquete por unidad indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.EmpaquetamientoInventario
        WHERE PackageTypeID = @OuterPackageID
    )
    BEGIN
        RAISERROR('El tipo de paquete exterior indicado no existe.', 16, 3);
        RETURN;
    END


    -- Verificar duplicado
    IF EXISTS
    (
        SELECT 1
        FROM dbo.ProductosActuales
        WHERE StockItemName = @StockItemName
    )
    BEGIN
        RAISERROR('Ya existe un producto con ese nombre.', 16, 4);
        RETURN;
    END


    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SET XACT_ABORT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        INSERT INTO dbo.ProductosActuales
        (
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
            TypicalWeightPerUnit,
            MarketingComments,
            InternalComments,
            Photo,
            CustomFields,
            LastEditedBy
        )
        VALUES
        (
            @StockItemName,
            @SupplierID,
            @ColorID,
            @UnitPackageID,
            @OuterPackageID,
            @Brand,
            @Size,
            @LeadTimeDays,
            @QuantityPerOuter,
            @IsChillerStock,
            @Barcode,
            @TaxRate,
            @UnitPrice,
            @RecommendedRetailPrice,
            @Weight,
            @MarketingComments,
            @InternalComments,
            @Photo,
            @CustomFields,
            @LastEditedBy
        );

        DECLARE @NuevoID INT;

        SELECT @NuevoID = StockItemID
        FROM dbo.ProductosActuales
        WHERE StockItemName = @StockItemName;


        COMMIT TRANSACTION;

        SELECT @NuevoID AS StockItemID;

    END TRY
    BEGIN CATCH

        /* DESHACER TRANSACCION */
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH;

END
GO

/* =========================================================
   4. ACTUALIZAR

   Modifica los datos de un producto existente.

   Utiliza una TRANSACCION para proteger el UPDATE.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Inventario_Actualizar

    @StockItemID INT,
    @StockItemName NVARCHAR(100),
    @SupplierID INT,
    @ColorID INT,
    @UnitPackageID INT,
    @OuterPackageID INT,
    @Brand NVARCHAR(50),
    @Size NVARCHAR(20),
    @LeadTimeDays INT,
    @QuantityPerOuter INT,
    @IsChillerStock BIT,
    @Barcode NVARCHAR(50),
    @TaxRate DECIMAL(18,3),
    @UnitPrice DECIMAL(18,2),
    @RecommendedRetailPrice DECIMAL(18,2),
    @Weight DECIMAL(18,3),
    @MarketingComments NVARCHAR(MAX),
    @InternalComments NVARCHAR(MAX),
    @Photo VARBINARY(MAX),
    @CustomFields NVARCHAR(MAX),
    @LastEditedBy INT

AS
BEGIN

    IF @StockItemID IS NULL
    BEGIN
        RAISERROR('El StockItemID es obligatorio.', 16, 1);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProductosActuales
        WHERE StockItemID = @StockItemID
    )
    BEGIN
        RAISERROR('El producto que intenta actualizar no existe.', 16, 5);
        RETURN;
    END

    IF @StockItemName IS NULL
    BEGIN
        RAISERROR('El nombre del producto es obligatorio.', 16, 1);
        RETURN;
    END

    IF @SupplierID IS NULL
    BEGIN
        RAISERROR('El proveedor es obligatorio.', 16, 1);
        RETURN;
    END

    IF @UnitPackageID IS NULL
    BEGIN
        RAISERROR('El paquete por unidad es obligatorio.', 16, 1);
        RETURN;
    END

    IF @OuterPackageID IS NULL
    BEGIN
        RAISERROR('El paquete exterior es obligatorio.', 16, 1);
        RETURN;
    END

    IF @LeadTimeDays IS NULL
    BEGIN
        RAISERROR('Los días de entrega son obligatorios.', 16, 1);
        RETURN;
    END

    IF @QuantityPerOuter IS NULL
    BEGIN
        RAISERROR('La cantidad por empaque es obligatoria.', 16, 1);
        RETURN;
    END

    IF @IsChillerStock IS NULL
    BEGIN
        RAISERROR('El indicador de almacenamiento refrigerado es obligatorio.', 16, 1);
        RETURN;
    END

    IF @TaxRate IS NULL
    BEGIN
        RAISERROR('La tasa de impuesto es obligatoria.', 16, 1);
        RETURN;
    END

    IF @UnitPrice IS NULL
    BEGIN
        RAISERROR('El precio unitario es obligatorio.', 16, 1);
        RETURN;
    END

    IF @Weight IS NULL
    BEGIN
        RAISERROR('El peso es obligatorio.', 16, 1);
        RETURN;
    END

    IF @LastEditedBy IS NULL
    BEGIN
        RAISERROR('El usuario que registra es obligatorio.', 16, 1);
        RETURN;
    END


    IF @LeadTimeDays < 0
    BEGIN
        RAISERROR('Los días de entrega no pueden ser negativos.', 16, 2);
        RETURN;
    END

    IF @QuantityPerOuter <= 0
    BEGIN
        RAISERROR('La cantidad por empaque debe ser mayor que cero.', 16, 2);
        RETURN;
    END

    IF @TaxRate < 0
    BEGIN
        RAISERROR('La tasa de impuesto no puede ser negativa.', 16, 2);
        RETURN;
    END

    IF @UnitPrice < 0
    BEGIN
        RAISERROR('El precio unitario no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF @RecommendedRetailPrice < 0
    BEGIN
        RAISERROR('El precio de venta recomendado no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF @Weight < 0
    BEGIN
        RAISERROR('El peso no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProveedoresActuales
        WHERE SupplierID = @SupplierID
    )
    BEGIN
        RAISERROR('El proveedor indicado no existe.', 16, 3);
        RETURN;
    END

    IF @ColorID IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM dbo.ColoresProductos
            WHERE ColorID = @ColorID
        )
    BEGIN
        RAISERROR('El color indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.EmpaquetamientoInventario
        WHERE PackageTypeID = @UnitPackageID
    )
    BEGIN
        RAISERROR('El tipo de paquete por unidad indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.EmpaquetamientoInventario
        WHERE PackageTypeID = @OuterPackageID
    )
    BEGIN
        RAISERROR('El tipo de paquete exterior indicado no existe.', 16, 3);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM dbo.ProductosActuales
        WHERE StockItemName = @StockItemName
          AND StockItemID <> @StockItemID
    )
    BEGIN
        RAISERROR('Ya existe un producto con ese nombre.', 16, 4);
        RETURN;
    END


    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SET XACT_ABORT ON;


    BEGIN TRY

        BEGIN TRANSACTION;


        UPDATE dbo.ProductosActuales
        SET
            StockItemName = @StockItemName,
            SupplierID = @SupplierID,
            ColorID = @ColorID,
            UnitPackageID = @UnitPackageID,
            OuterPackageID = @OuterPackageID,
            Brand = @Brand,
            Size = @Size,
            LeadTimeDays = @LeadTimeDays,
            QuantityPerOuter = @QuantityPerOuter,
            IsChillerStock = @IsChillerStock,
            Barcode = @Barcode,
            TaxRate = @TaxRate,
            UnitPrice = @UnitPrice,
            RecommendedRetailPrice = @RecommendedRetailPrice,
            TypicalWeightPerUnit = @Weight,
            MarketingComments = @MarketingComments,
            InternalComments = @InternalComments,
            Photo = @Photo,
            CustomFields = @CustomFields,
            LastEditedBy = @LastEditedBy

        WHERE StockItemID = @StockItemID;


        COMMIT TRANSACTION;


        SELECT @StockItemID AS StockItemID;


    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH;

END
GO

-- Nombre producto, proveedor ID, color ID, unidad de empaquetamiento ID, empaquetamiento ID,
-- cantidad de empaquetamiento, marca, talla, impuesto y precio unitario
SELECT * FROM dbo.ProductosActuales;

-- Conexión item grupo
SELECT * FROM dbo.ItemGrupos;

--Grupos
SELECT * FROM dbo.GruposInventario;

-- Productos en inventario
SELECT * FROM dbo.ProductosInventario;

--Proveedor ID
SELECT * FROM dbo.ProveedoresActuales;

--Color ID
SELECT * FROM dbo.ColoresProductos

--Unidad de empaquetamiento, empaquetamiento
SELECT * FROM dbo.EmpaquetamientoInventario
