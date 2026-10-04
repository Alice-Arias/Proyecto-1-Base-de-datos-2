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
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL,
    @Cliente NVARCHAR(100) = NULL,
    @DeliveryMethod NVARCHAR(50) = NULL,
    @MontoInicio DECIMAL(18,2) = NULL,
    @MontoFin DECIMAL(18,2) = NULL

AS
BEGIN

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    SELECT 
        f.InvoiceID,
        f.InvoiceDate AS Fecha_Factura,
        c.CustomerName AS Nombre_Cliente,
        fe.DeliveryMethodName AS Metodo_Entrega,
        df.ExtendedPrice AS Monto

    FROM dbo.Facturas f
    INNER JOIN dbo.ClientesActuales AS c ON f.CustomerID = c.CustomerID
    INNER JOIN dbo.FormasEntrega AS fe ON f.DeliveryMethodID = fe.DeliveryMethodID
    INNER JOIN dbo.DetalleFacturas AS df ON f.InvoiceID = df.InvoiceID

    WHERE
        (@NumeroFactura IS NULL OR f.InvoiceID = @NumeroFactura)
        AND
        (@FechaInicio IS NULL OR f.InvoiceDate >= @FechaInicio)
        AND
        (@FechaFin IS NULL OR f.InvoiceDate <= @FechaFin)
        AND
        (@Cliente IS NULL OR c.CustomerName LIKE '%' + @Cliente + '%')
        AND
        (@DeliveryMethod IS NULL OR fe.DeliveryMethodName LIKE '%' + @DeliveryMethod + '%')
        
    GROUP BY f.InvoiceID, f.InvoiceDate, c.CustomerName, fe.DeliveryMethodName

    HAVING (@MontoInicio IS NULL OR SUM(df.ExtendedPrice) >= @MontoInicio)
            AND (@MontoFin IS NULL OR SUM(df.ExtendedPrice) <= @MontoFin)

    ORDER BY f.InvoiceID ASC;

END
GO


/* =========================================================
   2. DETALLE

   Devuelve toda la informacion de una venta.
   Recibe el InvoiceID.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Ventas_Detalle
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


/* =========================================================
   3. INSERTAR

   Utiliza una TRANSACCION porque realiza dos operaciones:
    INSERT de la venta.
   Si ambas operaciones funcionan:  COMMIT
   Si ocurre un error: ROLLBACK
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Ventas_Insertar

    -- Factura
    @CustomerID INT,
    @BillToCustomerID INT,
    @OrderID INT,
    @DeliveryMethod INT,
    @ContactPersonID INT,
    @AccountsPersonID INT,
    @SalespersonPersonID INT,
    @PackedByPersonID INT,
    @InvoiceDate DATE,
    @CustomerPurchaseOrderNumber NVARCHAR(20),
    @IsCreditNote BIT,
    @CreditNoteReason NVARCHAR(MAX),
    @Comments NVARCHAR(MAX),
    @DeliveryInstructions NVARCHAR(MAX),
    @InternalComments NVARCHAR(MAX),
    @TotalDryItems INT,
    @TotalChillerItems INT,
    @DeliveryRun NVARCHAR(5),
    @RunPosition NVARCHAR(5),
    @ReturnedDeliveryData NVARCHAR(MAX),
    @LastEditedBy INT = 1,

    -- DetalleFactura
    @StockItemID INT,
    @Description NVARCHAR(100),
    @PackageTypeID INT,
    @Quantity INT,
    @UnitPrice DECIMAL(18,2),
    @TaxRate DECIMAL(18,2)

AS
BEGIN


    SET NOCOUNT ON;
    
    -- =====================================================
    -- VALIDACIÓN DE CAMPOS OBLIGATORIOS - FACTURA
    -- =====================================================

    IF @CustomerID IS NULL
    BEGIN
        RAISERROR('El CustomerID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @BillToCustomerID IS NULL
    BEGIN
        RAISERROR('El BillToCustomerID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @DeliveryMethod IS NULL
    BEGIN
        RAISERROR('El DeliveryMethodID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @ContactPersonID IS NULL
    BEGIN
        RAISERROR('El ContactPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @AccountsPersonID IS NULL
    BEGIN
        RAISERROR('El AccountsPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @SalespersonPersonID IS NULL
    BEGIN
        RAISERROR('El SalespersonPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @PackedByPersonID IS NULL
    BEGIN
        RAISERROR('El PackedByPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @InvoiceDate IS NULL
    BEGIN
        RAISERROR('La fecha de factura es obligatoria.', 16, 1);
        RETURN;
    END

    IF @IsCreditNote IS NULL
    BEGIN
        RAISERROR('El indicador de nota de crédito es obligatorio.', 16, 1);
        RETURN;
    END

    IF @TotalDryItems IS NULL
    BEGIN
        RAISERROR('El total de artículos secos es obligatorio.', 16, 1);
        RETURN;
    END

    IF @TotalChillerItems IS NULL
    BEGIN
        RAISERROR('El total de artículos refrigerados es obligatorio.', 16, 1);
        RETURN;
    END

    IF @LastEditedBy IS NULL
    BEGIN
        RAISERROR('El LastEditedBy es obligatorio.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ClientesActuales
        WHERE CustomerID = @CustomerID
    )
    BEGIN
        RAISERROR('El CustomerID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ClientesActuales
        WHERE CustomerID = @BillToCustomerID
    )
    BEGIN
        RAISERROR('El BillToCustomerID indicado no existe.', 16, 3);
        RETURN;
    END

    IF @OrderID IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM dbo.Pedidos
            WHERE OrderID = @OrderID
        )
    BEGIN
        RAISERROR('El OrderID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.FormasEntrega
        WHERE DeliveryMethodID = @DeliveryMethod
    )
    BEGIN
        RAISERROR('El DeliveryMethodID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @ContactPersonID
    )
    BEGIN
        RAISERROR('El ContactPersonID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @AccountsPersonID
    )
    BEGIN
        RAISERROR('El AccountsPersonID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @SalespersonPersonID
    )
    BEGIN
        RAISERROR('El SalespersonPersonID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @PackedByPersonID
    )
    BEGIN
        RAISERROR('El PackedByPersonID indicado no existe.', 16, 3);
        RETURN;
    END

    IF @CustomerPurchaseOrderNumber IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM dbo.Pedidos
            WHERE CustomerPurchaseOrderNumber = @CustomerPurchaseOrderNumber
        )
    BEGIN
        RAISERROR(
            'El CustomerPurchaseOrderNumber indicado no existe en los pedidos.',
            16,
            3
        );
        RETURN;
    END

    IF @StockItemID IS NULL
    BEGIN
        RAISERROR('El StockItemID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @Description IS NULL OR @Description = ''
    BEGIN
        RAISERROR('La descripción es obligatoria.', 16, 1);
        RETURN;
    END

    IF @PackageTypeID IS NULL
    BEGIN
        RAISERROR('El PackageTypeID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @Quantity IS NULL
    BEGIN
        RAISERROR('La cantidad es obligatoria.', 16, 1);
        RETURN;
    END

    IF @TaxRate IS NULL
    BEGIN
        RAISERROR('El TaxRate es obligatorio.', 16, 1);
        RETURN;
    END

     IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProductosActuales
        WHERE StockItemID = @StockItemID
    )
    BEGIN
        RAISERROR('El StockItemID indicado no existe.', 16, 3);
        RETURN;
    END

    -- PackageTypeID
    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.EmpaquetamientoInventario
        WHERE PackageTypeID = @PackageTypeID
    )
    BEGIN
        RAISERROR('El PackageTypeID indicado no existe.', 16, 3);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProductosInventario
        WHERE StockItemID = @StockItemID
          AND LastCostPrice IS NOT NULL
    )
    BEGIN
        RAISERROR(
            'El producto no tiene un LastCostPrice disponible para calcular la ganancia.',
            16,
            3
        );
        RETURN;
    END

    IF @Quantity <= 0
    BEGIN
        RAISERROR('La cantidad debe ser mayor que cero.', 16, 2);
        RETURN;
    END

    IF @TaxRate < 0 OR @TaxRate > 100
    BEGIN
        RAISERROR('El TaxRate debe estar entre 0 y 100.', 16, 2);
        RETURN;
    END

    IF @UnitPrice IS NOT NULL AND @UnitPrice < 0
    BEGIN
        RAISERROR('El UnitPrice no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF @TotalDryItems < 0
    BEGIN
        RAISERROR('El total de artículos secos no puede ser negativo.', 16, 2);
        RETURN;
    END

    IF @TotalChillerItems < 0
    BEGIN
        RAISERROR('El total de artículos refrigerados no puede ser negativo.', 16, 2);
        RETURN;
    END


    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    SET XACT_ABORT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        -- =====================================================
        -- INSERT PARA FACTURA
        -- =====================================================

        INSERT INTO dbo.Facturas
        (
            CustomerID,
            BillToCustomerID,
            OrderID,
            DeliveryMethodID,
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
            LastEditedBy
        )
        VALUES
        (
            @CustomerID,
            @BillToCustomerID,
            @OrderID,
            @DeliveryMethod,
            @ContactPersonID,
            @AccountsPersonID,
            @SalespersonPersonID,
            @PackedByPersonID,
            @InvoiceDate,
            @CustomerPurchaseOrderNumber,
            @IsCreditNote,
            @CreditNoteReason,
            @Comments,
            @DeliveryInstructions,
            @InternalComments,
            @TotalDryItems,
            @TotalChillerItems,
            @DeliveryRun,
            @RunPosition,
            @ReturnedDeliveryData,
            @LastEditedBy
        );

        DECLARE @NuevoInvoiceID INT;

        SET @NuevoInvoiceID = SCOPE_IDENTITY();


        -- Se obtiene el costo del producto
        DECLARE @LastCostPrice DECIMAL(18,2);

        SELECT @LastCostPrice = LastCostPrice
        FROM dbo.ProductosInventario
        WHERE StockItemID = @StockItemID;


        -- Se calculan los valores derivados
        DECLARE @TaxAmount DECIMAL(18,2);
        DECLARE @ExtendedPrice DECIMAL(18,2);
        DECLARE @LineProfit DECIMAL(18,2);

        IF @UnitPrice IS NULL
        BEGIN
            SET @TaxAmount = 0;
            SET @ExtendedPrice = 0;
            SET @LineProfit = 0;
        END
        ELSE
        BEGIN
            SET @TaxAmount =
                (@Quantity * @UnitPrice) * (@TaxRate / 100);

            SET @ExtendedPrice =
                (@Quantity * @UnitPrice) + @TaxAmount;

            SET @LineProfit =
                (@Quantity * @UnitPrice) - (@Quantity * @LastCostPrice);
        END

        -- =====================================================
        -- INSERTAR DETALLE DE FACTURA
        -- =====================================================

        INSERT INTO dbo.DetalleFacturas
        (
            InvoiceID,
            StockItemID,
            Description,
            PackageTypeID,
            Quantity,
            UnitPrice,
            TaxRate,
            TaxAmount,
            LineProfit,
            ExtendedPrice,
            LastEditedBy
        )
        VALUES
        (
            @NuevoInvoiceID,
            @StockItemID,
            @Description,
            @PackageTypeID,
            @Quantity,
            @UnitPrice,
            @TaxRate,
            @TaxAmount,
            @LineProfit,
            @ExtendedPrice,
            @LastEditedBy
        );

         COMMIT TRANSACTION;


        -- Retornar el ID generado
        SELECT @NuevoInvoiceID AS InvoiceID;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH;

END
GO

/* =========================================================
   4. ACTUALIZAR

   Modifica los datos de una venta existente.

   Utiliza una TRANSACCION para proteger el UPDATE.
   ========================================================= */

CREATE OR ALTER PROCEDURE dbo.SP_Ventas_Actualizar

    -- Se usa para identificar en ambas tablas
    @InvoiceID INT,

    -- Factura
    @CustomerID INT,
    @BillToCustomerID INT,
    @OrderID INT,
    @DeliveryMethod INT,
    @ContactPersonID INT,
    @AccountsPersonID INT,
    @SalespersonPersonID INT,
    @PackedByPersonID INT,
    @InvoiceDate DATE,
    @CustomerPurchaseOrderNumber NVARCHAR(20),
    @IsCreditNote BIT,
    @CreditNoteReason NVARCHAR(MAX),
    @Comments NVARCHAR(MAX),
    @DeliveryInstructions NVARCHAR(MAX),
    @InternalComments NVARCHAR(MAX),
    @TotalDryItems INT,
    @TotalChillerItems INT,
    @DeliveryRun NVARCHAR(5),
    @RunPosition NVARCHAR(5),
    @ReturnedDeliveryData NVARCHAR(MAX),
    @LastEditedBy INT = 1,

    -- DetalleFactura
    @StockItemID INT,
    @Description NVARCHAR(100),
    @PackageTypeID INT,
    @Quantity INT,
    @UnitPrice DECIMAL(18,2),
    @TaxRate DECIMAL(18,2)

AS
BEGIN

    SET NOCOUNT ON;

    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    SET XACT_ABORT ON;

    IF @InvoiceID IS NULL
    BEGIN
        RAISERROR('El InvoiceID es obligatorio.', 16, 1);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Facturas
        WHERE InvoiceID = @InvoiceID
    )
    BEGIN
        RAISERROR('La factura que intenta actualizar no existe.', 16, 5);
        RETURN;
    END

    IF @StockItemID IS NULL
    BEGIN
        RAISERROR('El StockItemID es obligatorio.', 16, 1);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.DetalleFacturas
        WHERE InvoiceID = @InvoiceID
          AND StockItemID = @StockItemID
    )
    BEGIN
        RAISERROR(
            'El producto indicado no existe dentro del detalle de la factura.',
            16,
            5
        );
        RETURN;
    END

    IF @CustomerID IS NULL
    BEGIN
        RAISERROR('El CustomerID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @BillToCustomerID IS NULL
    BEGIN
        RAISERROR('El BillToCustomerID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @DeliveryMethod IS NULL
    BEGIN
        RAISERROR('El DeliveryMethodID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @ContactPersonID IS NULL
    BEGIN
        RAISERROR('El ContactPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @AccountsPersonID IS NULL
    BEGIN
        RAISERROR('El AccountsPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @SalespersonPersonID IS NULL
    BEGIN
        RAISERROR('El SalespersonPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @PackedByPersonID IS NULL
    BEGIN
        RAISERROR('El PackedByPersonID es obligatorio.', 16, 1);
        RETURN;
    END

    IF @InvoiceDate IS NULL
    BEGIN
        RAISERROR('La fecha de factura es obligatoria.', 16, 1);
        RETURN;
    END

    IF @IsCreditNote IS NULL
    BEGIN
        RAISERROR('El indicador de nota de crédito es obligatorio.', 16, 1);
        RETURN;
    END

    IF @TotalDryItems IS NULL
    BEGIN
        RAISERROR('El total de artículos secos es obligatorio.', 16, 1);
        RETURN;
    END

    IF @TotalChillerItems IS NULL
    BEGIN
        RAISERROR('El total de artículos refrigerados es obligatorio.', 16, 1);
        RETURN;
    END

    IF @LastEditedBy IS NULL
    BEGIN
        RAISERROR('El LastEditedBy es obligatorio.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ClientesActuales
        WHERE CustomerID = @CustomerID
    )
    BEGIN
        RAISERROR('El CustomerID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ClientesActuales
        WHERE CustomerID = @BillToCustomerID
    )
    BEGIN
        RAISERROR('El BillToCustomerID indicado no existe.', 16, 3);
        RETURN;
    END


    IF @OrderID IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM dbo.Pedidos
            WHERE OrderID = @OrderID
        )
    BEGIN
        RAISERROR('El OrderID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.FormasEntrega
        WHERE DeliveryMethodID = @DeliveryMethod
    )
    BEGIN
        RAISERROR('El DeliveryMethodID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @ContactPersonID
    )
    BEGIN
        RAISERROR('El ContactPersonID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @AccountsPersonID
    )
    BEGIN
        RAISERROR('El AccountsPersonID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @SalespersonPersonID
    )
    BEGIN
        RAISERROR('El SalespersonPersonID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Contactos
        WHERE PersonID = @PackedByPersonID
    )
    BEGIN
        RAISERROR('El PackedByPersonID indicado no existe.', 16, 3);
        RETURN;
    END


    IF @CustomerPurchaseOrderNumber IS NOT NULL
        AND NOT EXISTS
        (
            SELECT 1
            FROM dbo.Pedidos
            WHERE CustomerPurchaseOrderNumber = @CustomerPurchaseOrderNumber
        )
    BEGIN
        RAISERROR(
            'El CustomerPurchaseOrderNumber indicado no existe en los pedidos.',
            16,
            3
        );
        RETURN;
    END

    IF @Description IS NULL OR @Description = ''
    BEGIN
        RAISERROR('La descripción es obligatoria.', 16, 1);
        RETURN;
    END


    IF @PackageTypeID IS NULL
    BEGIN
        RAISERROR('El PackageTypeID es obligatorio.', 16, 1);
        RETURN;
    END


    IF @Quantity IS NULL
    BEGIN
        RAISERROR('La cantidad es obligatoria.', 16, 1);
        RETURN;
    END


    IF @TaxRate IS NULL
    BEGIN
        RAISERROR('El TaxRate es obligatorio.', 16, 1);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProductosActuales
        WHERE StockItemID = @StockItemID
    )
    BEGIN
        RAISERROR('El StockItemID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.EmpaquetamientoInventario
        WHERE PackageTypeID = @PackageTypeID
    )
    BEGIN
        RAISERROR('El PackageTypeID indicado no existe.', 16, 3);
        RETURN;
    END


    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.ProductosInventario
        WHERE StockItemID = @StockItemID
          AND LastCostPrice IS NOT NULL
    )
    BEGIN
        RAISERROR(
            'El producto no tiene un LastCostPrice disponible para calcular la ganancia.',
            16,
            3
        );
        RETURN;
    END


    BEGIN TRY

        BEGIN TRANSACTION;


        -- =================================================
        -- ACTUALIZAR FACTURA
        -- =================================================

        UPDATE dbo.Facturas
        SET
            CustomerID = @CustomerID,
            BillToCustomerID = @BillToCustomerID,
            OrderID = @OrderID,
            DeliveryMethodID = @DeliveryMethod,
            ContactPersonID = @ContactPersonID,
            AccountsPersonID = @AccountsPersonID,
            SalespersonPersonID = @SalespersonPersonID,
            PackedByPersonID = @PackedByPersonID,
            InvoiceDate = @InvoiceDate,
            CustomerPurchaseOrderNumber = @CustomerPurchaseOrderNumber,
            IsCreditNote = @IsCreditNote,
            CreditNoteReason = @CreditNoteReason,
            Comments = @Comments,
            DeliveryInstructions = @DeliveryInstructions,
            InternalComments = @InternalComments,
            TotalDryItems = @TotalDryItems,
            TotalChillerItems = @TotalChillerItems,
            DeliveryRun = @DeliveryRun,
            RunPosition = @RunPosition,
            ReturnedDeliveryData = @ReturnedDeliveryData,
            LastEditedBy = @LastEditedBy

        WHERE InvoiceID = @InvoiceID;


        -- OBTENER COSTO DEL PRODUCTO
        DECLARE @LastCostPrice DECIMAL(18,2);

        SELECT @LastCostPrice = LastCostPrice
        FROM dbo.ProductosInventario
        WHERE StockItemID = @StockItemID;
 
        -- CALCULAR VALORES DERIVADOS
        DECLARE @TaxAmount DECIMAL(18,2);
        DECLARE @ExtendedPrice DECIMAL(18,2);
        DECLARE @LineProfit DECIMAL(18,2);


        IF @UnitPrice IS NULL
        BEGIN
            SET @TaxAmount = 0;
            SET @ExtendedPrice = 0;
            SET @LineProfit = 0;
        END
        ELSE
        BEGIN
            SET @TaxAmount =
                (@Quantity * @UnitPrice) * (@TaxRate / 100);

            SET @ExtendedPrice =
                (@Quantity * @UnitPrice) + @TaxAmount;

            SET @LineProfit =
                @ExtendedPrice - (@Quantity * @LastCostPrice);
        END


        -- =================================================
        -- ACTUALIZAR DETALLE DE FACTURA
        -- =================================================

        UPDATE dbo.DetalleFacturas
        SET
            Description = @Description,
            PackageTypeID = @PackageTypeID,
            Quantity = @Quantity,
            UnitPrice = @UnitPrice,
            TaxRate = @TaxRate,
            TaxAmount = @TaxAmount,
            LineProfit = @LineProfit,
            ExtendedPrice = @ExtendedPrice,
            LastEditedBy = @LastEditedBy
        WHERE InvoiceID = @InvoiceID
          AND StockItemID = @StockItemID;


        COMMIT TRANSACTION;


        -- Retornar los identificadores actualizados
        SELECT
            @InvoiceID AS InvoiceID,
            @StockItemID AS StockItemID;


    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH;

END
GO


CREATE OR ALTER PROCEDURE dbo.SP_Ventas_Opciones
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Clientes
    SELECT
        CustomerID AS ID,
        CustomerName AS Nombre
    FROM dbo.ClientesActuales
    ORDER BY CustomerName;


    -- 2. Métodos de entrega
    SELECT
        DeliveryMethodID AS ID,
        DeliveryMethodName AS Nombre
    FROM dbo.FormasEntrega
    ORDER BY DeliveryMethodName;


    -- 3. Contactos generales
    SELECT
        PersonID AS ID,
        FullName AS Nombre
    FROM dbo.Contactos
    WHERE IsSalesperson = 0
    ORDER BY FullName;

    -- 4. Vendedores
    SELECT
        PersonID AS ID,
        FullName AS Nombre
    FROM dbo.Contactos
    WHERE IsSalesperson = 1
    ORDER BY FullName;


    -- 5. Pedidos
    SELECT
        OrderID AS ID,
        CustomerPurchaseOrderNumber AS Numero_Orden
    FROM dbo.Pedidos
    ORDER BY OrderID;


    -- 6. Productos
    SELECT
        StockItemID AS ID,
        StockItemName AS Nombre
    FROM dbo.ProductosActuales
    ORDER BY StockItemName;


    -- 7. Tipos de paquete
    SELECT
        PackageTypeID AS ID,
        PackageTypeName AS Nombre
    FROM dbo.EmpaquetamientoInventario
    ORDER BY PackageTypeName;

END;
GO

